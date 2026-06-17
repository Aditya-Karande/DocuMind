from pdf2image import convert_from_path
import base64
import io
from groq import Groq
from langchain_core.documents import Document
import os
from dotenv import load_dotenv
from pathlib import Path



load_dotenv(Path(__file__).resolve().parents[2] / ".env")
client = Groq(api_key=os.getenv("GROQ_API_KEY") or os.getenv("API_KEY"))

def image_to_base64(image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def load_scanned_pdf(file_path):
    images = convert_from_path(str(file_path))
    extracted_text = ""

    for image in images:
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
                            "text": "Extract all text from this image exactly as it appears. Return only the extracted text, nothing else."
                        }
                    ]
                }
            ],
            max_tokens=2000
        )

        extracted_text += response.choices[0].message.content + "\n"

    return [
        Document(
            page_content=extracted_text,
            metadata={"source": str(file_path)}
        )
    ]