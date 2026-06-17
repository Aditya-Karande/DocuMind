import base64
from groq import Groq
from langchain_core.documents import Document
import os
from dotenv import load_dotenv
from pathlib import Path



load_dotenv(Path(__file__).resolve().parents[2] / ".env")



client = Groq(
    api_key=os.getenv("API_KEY")
)

def image_to_base64(file_path):
    with open(file_path, "rb") as image_file:
        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def load_image(file_path):

    base64_image = image_to_base64(file_path)

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

    extracted_text = response.choices[0].message.content

    if not extracted_text.strip():
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