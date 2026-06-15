class RAGRetriever:
    def __init__(self, embedding_manager, vector_store):
        self.embedding_manager = embedding_manager
        self.vector_store = vector_store
    
    def retrieve(self, query, top_k=5):

        embeddings = self.embedding_manager.create_embeddings(query)

        results = self.vector_store.search(
            query_embedding = embeddings,
            chat_id = self.vector_store.chat_id,
            limit = top_k
        )

        retrieved_docs = []

        for i, result in enumerate(results):

            retrieved_docs.append({
                "metadata": result["metadata"],
                "document": result["document"],
                "similarity_score": result["score"],
                "rank": i + 1
            })

        print(
            f"Retrieved Document Length: {len(retrieved_docs)}"
        )

        return retrieved_docs