from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)
from qdrant_client.models import Filter, FieldCondition, MatchValue
from qdrant_client.models import PayloadSchemaType
from dotenv import load_dotenv
from pathlib import Path
import os
import uuid

load_dotenv(
    Path(__file__).resolve().parents[2] / ".env"
)

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

class QdrantStore:

    COLLECTION_NAME = "documind_documents"

    def __init__(self):
        
        self.client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY
        )
        self._create_collection()

    def _create_collection(self):

        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.COLLECTION_NAME not in collection_names:
            self.client.create_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=384, #all-MiniLM-L6-v2
                    distance = Distance.COSINE
                )
            )

            self.client.create_payload_index(
                collection_name=self.COLLECTION_NAME,
                field_name="chat_id",
                field_schema=PayloadSchemaType.INTEGER
            )

            self.client.create_payload_index(
                collection_name=self.COLLECTION_NAME,
                field_name="document_id",
                field_schema=PayloadSchemaType.INTEGER
            )

            print("Qdrant collection created..")

    def add_document(self,document,embedding,metadata):

        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding.tolist(),
            payload={
                "document": document,
                **metadata
            }
        )

        self.client.upsert(
            collection_name=self.COLLECTION_NAME,
            points = [point]
        )

        print("document added..")

    def search(self,query_embedding, chat_id, limit=5):
        
        results = self.client.query_points(
            collection_name = self.COLLECTION_NAME,
            query = query_embedding.tolist(),
            limit = limit,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="chat_id",
                        match=MatchValue(value=chat_id)
                    )
                ]
            )
        )

        hits = results.points

        docs = []

        for hit in hits:
            docs.append({
                "document":hit.payload['document'],
                "metadata": hit.payload,
                "score":hit.score
            })

        return docs
    
    def delete_document(self, document_id):

        self.client.delete(
            collection_name=self.COLLECTION_NAME,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=document_id
                        )
                    )
                ]
            )
        )

        print(
            f"Deleted vectors for document {document_id}"
        )

    def create_vector_store(
        self,
        documents,
        embeddings,
        chat_id,
        document_id
    ):

        for i, (doc, embed) in enumerate(
            zip(documents, embeddings)
        ):

            metadata = dict(doc.metadata)

            metadata["chat_id"] = chat_id
            metadata["document_id"] = document_id

            metadata["index"] = i + 1

            metadata["document_length"] = len(
                doc.page_content
            )

            self.add_document(
                document=doc.page_content,
                embedding=embed,
                metadata=metadata
            )

        print(
            f"Added {len(documents)} chunks to Qdrant"
        )