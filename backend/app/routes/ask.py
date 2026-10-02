from fastapi import APIRouter, HTTPException
from uuid import UUID

from app.graph_traversal import build_context_graph
from app.llm_engine import answer_from_reasoning_pack
from app.reasoning_pack import build_reasoning_pack
from app import schemas

router = APIRouter(prefix="/projects/{project_id}", tags=["ask"])


@router.post("/ask", response_model=schemas.AskResponse)
def ask_project_memory(project_id: UUID, request: schemas.AskRequest):
    context_graph = build_context_graph(
        project_id=str(project_id),
        query=request.query,
        thread_id=str(request.thread_id) if request.thread_id else None,
    )

    if context_graph["project"] is None:
        raise HTTPException(status_code=404, detail="Project not found")

    if request.thread_id is not None and not context_graph["threads"]:
        raise HTTPException(status_code=404, detail="Thread not found")

    reasoning_pack = build_reasoning_pack(context_graph)
    answer = answer_from_reasoning_pack(reasoning_pack, request.query)

    return schemas.AskResponse(
        answer=answer,
        intent=context_graph["intent"],
        traversal=context_graph["traversal"],
        used_thread_count=len(context_graph["threads"]),
        reasoning_pack=reasoning_pack if request.include_debug else None,
        context_graph=context_graph if request.include_debug else None,
    )
