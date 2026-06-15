import os 
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_file_to_cloudinary(file_path: str):

    result = cloudinary.uploader.upload(
        file_path,
        resource_type="raw"
    )

    return {
        "url":result["secure_url"],
        "public_id":result["public_id"]
    }

def delete_file_from_cloudinary(public_id: str):

    return cloudinary.uploader.destroy(
        public_id,
        resource_type="raw"
    )

