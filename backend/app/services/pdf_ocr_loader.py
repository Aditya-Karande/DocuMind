import fitz
import base64
import io
import os


from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
from PIL import Image
from langchain_core.documents import Document

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY") or os.getenv("API_KEY")
)


def image_to_base64(image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def load_scanned_pdf(file_path):

    pdf = fitz.open(str(file_path))
    extracted_text = ""

    for page_num in range(len(pdf)):

        page = pdf.load_page(page_num)

        pix = page.get_pixmap(
            matrix=fitz.Matrix(2, 2)
        )

        image = Image.frombytes(
            "RGB",
            [pix.width, pix.height],
            pix.samples
        )

        base64_image = image_to_base64(image)

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}"
                            }
                        },
                        {
                            "type": "text",
                            "text": """
Extract all text from this image exactly as it appears.
Return only the extracted text.
"""
                        }
                    ]
                }
            ],
            max_tokens=4000
        )

        extracted_text += (
            f"\n\n--- PAGE {page_num + 1} ---\n\n"
            + response.choices[0].message.content
        )

    pdf.close()

    return [
        Document(
            page_content=extracted_text,
            metadata={
                "source": str(file_path)
            }
        )
    ]