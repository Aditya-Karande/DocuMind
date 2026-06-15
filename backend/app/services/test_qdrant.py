from qdrant_store import QdrantStore
import numpy as np

qdrant = QdrantStore()

dummy_embedding = np.random.rand(384)

# qdrant.add_document(
#     document="Hello from DocuMind",
#     embedding=dummy_embedding,
#     metadata={
#         "chat_id": 1,
#         "document_id": 100,
#         "source": "test.pdf"
#     }
# )

# print("success")

results = qdrant.search(
    query_embedding=dummy_embedding,
    chat_id=1
)

print(results)

# qdrant.delete_document(100)