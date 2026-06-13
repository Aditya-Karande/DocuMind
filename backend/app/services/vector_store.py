from pathlib import Path
import os
import shutil
import uuid
import chromadb

class VectorStoreManager:
    def __init__(self,chat_id):
        self.chat_id = chat_id
        self.persist_path = (
            Path(__file__).parent.parent.parent
            / "vector_store"
            / f"chat_{chat_id}"
        )
        self.collection_name = f"Chat_{chat_id}"
        self.collection = None
        self.client = None
        self._initialize_vector_store()

    def _initialize_vector_store(self):
        #create folder
        os.makedirs(self.persist_path, exist_ok=True)

        #1. create client
        self.client = chromadb.PersistentClient(path=self.persist_path)

        #2. create collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description":f"This is a Vector DB for Chat {self.chat_id}"}
        )
        print(f"Name of Collection: {self.collection_name}")
        print(f"Total Documents in Collection: {self.collection.count()}")
    
    def create_vector_store(self, documents, embeddings):

        if (len(documents) != len(embeddings)):
            raise ValueError("Length of Documents must be equal to length of Embeddings...")
        
        #store -> ids, metadatas, documents(chunks), embeddings
        ids=[]
        all_metadata = []
        document_list = []
        embedding_list = []

        for i,(doc, embed) in enumerate(zip(documents, embeddings)):
            
            #1. ids
            doc_id = f"doc_{uuid.uuid4()}"
            ids.append(doc_id)
            
            #2. metadatas
            metadata = dict(doc.metadata)
            metadata["index"] = i+1
            metadata["document_length"] = len(doc.page_content)
            all_metadata.append(metadata)
            
            #3. documents (chunks)
            document_list.append(doc.page_content)

            #4. embeddings
            embedding_list.append(embed.tolist()) 
        
        self.collection.add(
            ids=ids,
            metadatas=all_metadata,
            documents=document_list,
            embeddings=embedding_list
        )

        print("Total docuements added in vector store: ",len(document_list))
        print("Total docuements in collection: ", self.collection.count())
    
    def delete_embedding(self,file_path):
        results = self.collection.get()

        ids_to_delete = []

        for doc_id, metadata in zip(results['documents'], results['metadatas']):

            if metadata["source"] == file_path:
                ids_to_delete.append(doc_id)
            
        
        if ids_to_delete:
            self.collection.delete(ids_to_delete)
            print(f"Deleted {len(ids_to_delete)} chunks..")
        
        else:
            print("No chunks found for document..")

    def get_all_docs(self):
        results = self.collection.get()
        docs = []
        for i,doc in enumerate(results['documents']):
            docs.append({
                "document":doc,
                "metadata":results['metadatas'][i]
            })

        return docs
            

