from pdf2image import convert_from_path
import easyocr
from langchain_core.documents import Document
import numpy as np

reader = easyocr.Reader(['en'])

def load_scanned_pdf(file_path):

    images = convert_from_path(str(file_path))

    extracted_txt = ""

    for image in images:
        
        result = reader.readtext(
            np.array(image),
            detail=0
        )

        page_text = "\n".join(result)

        extracted_txt += page_text + "\n"


    
    return [
        Document(
            page_content= extracted_txt,
            metadata = {
                "source": str(file_path)
            }
        )
    ]