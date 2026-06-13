class RAGRetriever:
    def __init__(self, embedding_manager, vector_store):
        self.embedding_manager = embedding_manager
        self.vector_store = vector_store
    
    def retrieve(self, query, top_k=5):
        #query -> query processing
        embeddings = self.embedding_manager.create_embeddings(query)

        #processes query -> vector db
        results = self.vector_store.collection.query(
            query_embeddings = [embeddings],
            n_results = top_k
        )
        
        #sementic search
        retrived_docs = []
        if results["documents"] and results["documents"][0]:
            ids = results["ids"][0]
            metadatas = results["metadatas"][0]
            documents = results["documents"][0]
            distances = results["distances"][0]

            for i,(doc_id, metadata, doc, dist) in enumerate(zip(ids, metadatas, documents, distances)):
                similarity_score = 1 - dist
                if dist > 0.5:
                    retrived_docs.append({
                        "ids": doc_id,
                        "metadata":metadata,
                        "similarity_score":similarity_score,
                        "document":doc,
                        "rank":i+1
                    })            
            print(f"Retrived Document Length: {len(retrived_docs)}")
        else:
            return "No Documents found... :("
        return retrived_docs