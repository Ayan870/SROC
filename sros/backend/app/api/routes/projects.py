from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/projects", tags=["projects"])


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None


class ProjectResponse(BaseModel):
    project_id: str
    name: str
    description: str | None
    status: str


@router.post("/", response_model=ProjectResponse)
async def create_project(project: ProjectCreate):
    """Create a new project workspace."""
    return {
        "project_id": "proj-placeholder-id-999",
        "name": project.name,
        "description": project.description,
        "status": "active"
    }


@router.get("/", response_model=List[ProjectResponse])
async def list_projects():
    """List all projects."""
    return [
        {
            "project_id": "proj-placeholder-id-999",
            "name": "Default Workspace",
            "description": "Standard work environment.",
            "status": "active"
        }
    ]


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get project details."""
    if project_id != "proj-placeholder-id-999":
        raise HTTPException(status_code=404, detail="Project not found.")
    return {
        "project_id": "proj-placeholder-id-999",
        "name": "Default Workspace",
        "description": "Standard work environment.",
        "status": "active"
    }
