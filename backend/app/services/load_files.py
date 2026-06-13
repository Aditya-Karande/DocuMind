import os
from langchain_community.document_loaders import PyMuPDFLoader,TextLoader, CSVLoader, Docx2txtLoader, UnstructuredPowerPointLoader
from pathlib import Path
from .image_loader import load_image
from .pdf_ocr_loader import load_scanned_pdf

def load_pdf(file_path):
    documents = PyMuPDFLoader(
        str(file_path)
    ).load()

    extracted_txt = ""

    for doc in documents:
        extracted_txt += doc.page_content.strip()
    
    print(f"Extracted Characters: {len(extracted_txt)}")

    if len(extracted_txt) > 50:
        print("Normal PDF Detected...")
        return documents
    print("Scanned PDF Detected -> using OCR")
    return load_scanned_pdf(file_path)

def load_docs(file_path):
    
    extention = Path(file_path).suffix.lower()

    if extention == ".pdf":
        return load_pdf(str(file_path))
    elif extention == ".docx":
        return Docx2txtLoader(str(file_path)).load()
    elif extention == ".txt":
        return TextLoader(str(file_path)).load()
    elif extention == ".pptx":
        return UnstructuredPowerPointLoader(str(file_path)).load()
    elif extention == '.csv':
        return CSVLoader(str(file_path)).load()
    elif extention in ['.jpg','.jpeg','.png','.webpg']:
        return load_image(str(file_path))
    else:
        raise ValueError(f"unsupported file type: {extention}")
            
