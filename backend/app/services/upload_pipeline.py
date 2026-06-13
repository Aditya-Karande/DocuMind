from .chunking import create_chunks
from .embeddings import EmbeddingManger
from .vector_store import VectorStoreManager
from .load_files import load_docs

def process_documents(chat_id,file_path):

    document = load_docs(file_path)

    chunks = create_chunks(document)

    embedding_manager = EmbeddingManger()
    texts = [doc.page_content for doc in chunks]
    embeddings = embedding_manager.create_embeddings(texts)

    vector_store = VectorStoreManager(chat_id)
    vector_store.create_vector_store(
        chunks,
        embeddings
    )

    return True