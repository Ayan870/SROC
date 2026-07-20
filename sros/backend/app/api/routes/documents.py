from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=Dict[str, Any])
async def upload_document(file: UploadFile = File(...)):
    """Upload a document for parsing and processing."""
    if not file.filename.endswith(('.pdf', '.txt', '.csv', '.xlsx', '.sav')):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "status": "uploaded",
        "document_id": "doc-placeholder-id-1234"
    }


@router.get("/", response_model=List[Dict[str, Any]])
async def list_documents():
    """List all documents."""
    return [
        {
            "document_id": "doc-placeholder-id-1234",
            "filename": "sample_contract.pdf",
            "status": "processed",
            "size_bytes": 102450
        }
    ]


@router.get("/{document_id}", response_model=Dict[str, Any])
async def get_document(document_id: str):
    """Retrieve document metadata by ID."""
    if document_id != "doc-placeholder-id-1234":
        raise HTTPException(status_code=404, detail="Document not found.")
    return {
        "document_id": "doc-placeholder-id-1234",
        "filename": "sample_contract.pdf",
        "status": "processed",
        "size_bytes": 102450,
        "metadata": {"author": "Unknown", "page_count": 5}
    }


@router.delete("/{document_id}", response_model=Dict[str, Any])
async def delete_document(document_id: str):
    """Delete a document."""
    if document_id != "doc-placeholder-id-1234":
        raise HTTPException(status_code=404, detail="Document not found.")
    return {
        "document_id": document_id,
        "status": "deleted"
    }
