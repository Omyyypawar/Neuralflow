from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Any, Literal


MemoryNodeType = Literal["idea", "decision", "task", "question", "pivot", "bug"]


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None


class ProjectOut(BaseModel):
    id: UUID
    title: str
    description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ThreadCreate(BaseModel):
    title: str
    parent_id: UUID | None = None
    content: str | None = None
    node_type: MemoryNodeType = "idea"
    position_x: float | None = None
    position_y: float | None = None


class ThreadUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    node_type: MemoryNodeType | None = None
    position_x: float | None = None
    position_y: float | None = None


class ThreadOut(BaseModel):
    id: UUID
    project_id: UUID
    parent_id: UUID | None = None
    title: str
    content: str | None = None
    node_type: MemoryNodeType = "idea"
    position_x: float | None = None
    position_y: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class AskRequest(BaseModel):
    query: str
    thread_id: UUID | None = None
    include_debug: bool = False


class AskResponse(BaseModel):
    answer: str
    intent: str
    traversal: str
    used_thread_count: int
    reasoning_pack: str | None = None
    context_graph: dict[str, Any] | None = None
