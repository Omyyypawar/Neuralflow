"""
Branch ancestry traversal.

This is the core differentiator of NeuralFlow: instead of packing the LLM
with "the last N messages" (linear chat) or "semantically similar docs"
(RAG), we feed it the structural ancestry of the node the user is asking
from — the actual lineage of thought that led to this point.

Given a thread_id, we walk parent_id → parent → ... up to the root and
return that chain (root-first). This chain is what the reasoning pack
serializes and what the LLM treats as ground truth.

If no thread_id is supplied (e.g. a free-floating project-level query),
we fall back to the most recent threads in the project — a reasonable
default before the canvas places the query somewhere specific.
"""

from enum import Enum
from typing import Any
from app.database import SessionLocal
from app.models import Project, Thread


class Intent(str, Enum):
    DEBUG = "debug"
    PLANNING = "planning"
    RECALL = "recall"
    GENERAL = "general"


def classify_intent(query: str) -> Intent:
    q = query.lower()
    if any(w in q for w in ("why", "reason", "cause")):
        return Intent.DEBUG
    if any(w in q for w in ("build", "plan", "next")):
        return Intent.PLANNING
    if any(w in q for w in ("remember", "earlier", "last")):
        return Intent.RECALL
    return Intent.GENERAL


# Depth cap so a pathologically deep branch can't blow the context window.
MAX_ANCESTRY_DEPTH = 50
FALLBACK_RECENT_THREADS = 5


def _walk_ancestry(db, leaf_id: str, project_id: str) -> list[Thread]:
    chain: list[Thread] = []
    seen: set[str] = set()
    current_id: str | None = leaf_id

    for _ in range(MAX_ANCESTRY_DEPTH):
        if current_id is None or current_id in seen:
            break
        seen.add(current_id)

        node = (
            db.query(Thread)
            .filter(
                Thread.id == current_id,
                Thread.project_id == str(project_id),
            )
            .first()
        )
        if node is None:
            break
        chain.append(node)
        current_id = node.parent_id

    chain.reverse()  # root-first
    return chain


def _serialize_thread(t: Thread) -> dict[str, Any]:
    return {
        "id": str(t.id),
        "parent_id": str(t.parent_id) if t.parent_id else None,
        "title": t.title,
        "content": t.content,
        "node_type": t.node_type,
        "created_at": t.created_at,
    }


def build_context_graph(
    project_id: str,
    query: str,
    thread_id: str | None = None,
) -> dict[str, Any]:
    intent = classify_intent(query)

    db = SessionLocal()
    try:
        project = (
            db.query(Project)
            .filter(Project.id == str(project_id))
            .first()
        )
        if not project:
            return {
                "intent": intent.value,
                "project": None,
                "threads": [],
                "traversal": "none",
            }

        if thread_id is not None:
            chain = _walk_ancestry(db, str(thread_id), str(project_id))
            traversal = "ancestry"
        else:
            chain = (
                db.query(Thread)
                .filter(Thread.project_id == str(project_id))
                .order_by(Thread.created_at.desc())
                .limit(FALLBACK_RECENT_THREADS)
                .all()
            )
            # Fallback is newest-first; reverse so serialization is chronological.
            chain = list(reversed(chain))
            traversal = "recent_fallback"

        return {
            "intent": intent.value,
            "project": {
                "id": str(project.id),
                "title": project.title,
            },
            "threads": [_serialize_thread(t) for t in chain],
            "traversal": traversal,
        }
    finally:
        db.close()
