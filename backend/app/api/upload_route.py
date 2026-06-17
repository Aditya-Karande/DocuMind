from fastapi import APIRouter, HTTPException, UploadFile, File, status, Depends
from pathlib import Path
import shutil
from app.database.curd import create_document
from app.database.connection import get_db
from sqlalchemy.orm import Session
from app.database.models import User
from app.services.oauth2 import get_current_user

upload_router = APIRouter(prefix="/upload",tags=['Upload'])

FOLDER_PATH = Path(__file__).parent.parent.parent / "uploaded_files"
FOLDER_PATH.mkdir(exist_ok=True)


@upload_router.post("/upload_file/{chat_id}")
async def upload_pdf(chat_id:int, file: UploadFile = File(...),db:Session = Depends(get_db),get_current_user: User = Depends(get_current_user)):

    ALLOWED_EXTENTIONS = [
        '.pdf',
        '.docx',
        '.txt',
        '.ppxt',
        '.csv',
        '.png',
        '.jpg',
        '.jpeg',
        '.webp'
    ]

    extention = Path(file.filename).suffix.lower()

    if extention not in ALLOWED_EXTENTIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="unsupproted file type..."
        )
    
    chat_folder = FOLDER_PATH / f"chat_{chat_id}"

    chat_folder.mkdir(
        parents=True,
        exist_ok=True
    )

    FILE_PATH = chat_folder / file.filename

    if FILE_PATH.exists():
        raise HTTPException(
            status_code= status.HTTP_409_CONFLICT,
            detail=f"'{file.filename}' is already uploaded.."
        )
    
    with open(FILE_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    try:

        from app.services.upload_pipeline import process_documents

        document = create_document(
            db=db,
            chat_id=chat_id,
            filename=file.filename,
            filepath=str(FILE_PATH),
        )

        process_documents(
            chat_id= chat_id,
            docuemnt_id=document.id,
            file_path=FILE_PATH
        )

        if FILE_PATH.exists():
            FILE_PATH.unlink()
    
        # create_document(
        #     db=db,
        #     chat_id=chat_id,
        #     filename=file.filename,
        #     filepath=str(FILE_PATH),
        # )

    except Exception as e:

        if FILE_PATH.exists():
            FILE_PATH.unlink()
        
        raise HTTPException(
            status_code= 500,
            detail=f"Document processing failed: {str(e)} "
        )
    

    return {
        "file name": file.filename,
        "status": "file uploaded successfully..",
        "file path": str(FILE_PATH)
    }