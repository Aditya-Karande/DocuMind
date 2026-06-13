from langchain_text_splitters import RecursiveCharacterTextSplitter

def create_chunks(document,chunk_size=2000,chunk_overlap=400):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = chunk_size,
        chunk_overlap = chunk_overlap
    )
    chunks = text_splitter.split_documents(document)
    return chunks