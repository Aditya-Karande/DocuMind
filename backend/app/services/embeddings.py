import requests
import os
from dotenv import load_dotenv
from pathlib import Path

class EmbeddingManger:

    def __init__(self):

        load_dotenv(
            Path(__file__).resolve().parents[2] / ".env"
        )
        self.api_key = os.getenv("JINA_API_KEY")

        if not self.api_key:
            raise ValueError("JINA_API_KEY not found")

    def create_embeddings(self, text):

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "jina-embeddings-v3",
            "input": text
        }

        response = requests.post(
            "https://api.jina.ai/v1/embeddings",
            headers=headers,
            json=payload
        )

        response.raise_for_status()

        result = response.json()

        if isinstance(text, str):
            return result["data"][0]["embedding"]

        return [
            item["embedding"]
            for item in result["data"]
        ]
    