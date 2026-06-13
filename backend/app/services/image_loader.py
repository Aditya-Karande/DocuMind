import easyocr
from langchain_core.documents import Document

reader = easyocr.Reader(['en'])

def load_image(file_path):

    result = reader.readtext(
        str(file_path),
        detail=0
    )

    extracted_text = "\n".join(result)

    if not extracted_text:
        raise ValueError(
            "No text detected in image"
        )

    return [
        Document(
            page_content=extracted_text,
            metadata={
                "source": str(file_path)
            } 
        )
    ]