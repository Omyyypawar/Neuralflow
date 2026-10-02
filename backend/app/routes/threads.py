from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import SessionLocal
from app import models, schemas

router = APIRouter(
    prefix="/projects/{project_id}/threads",
    tags=["threads"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.ThreadOut)
def create_thread(
    project_id: UUID,
    thread: schemas.ThreadCreate,
    db: Session = Depends(get_db),
):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == str(project_id))
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if thread.parent_id is not None:
        parent = (
            db.query(models.Thread)
            .filter(
                models.Thread.id == str(thread.parent_id),
                models.Thread.project_id == str(project_id),
            )
            .first()
        )
        if not parent:
            raise HTTPException(
                status_code=400,
                detail="parent_id does not belong to this project",
            )

    db_thread = models.Thread(
        project_id=str(project_id),
        parent_id=str(thread.parent_id) if thread.parent_id else None,
        title=thread.title,
        content=thread.content,
        node_type=thread.node_type,
        position_x=thread.position_x,
        position_y=thread.position_y,
    )
    db.add(db_thread)
    db.commit()
    db.refresh(db_thread)
    return db_thread


@router.get("/", response_model=list[schemas.ThreadOut])
def list_threads(project_id: UUID, db: Session = Depends(get_db)):
    return (
        db.query(models.Thread)
        .filter(models.Thread.project_id == str(project_id))
        .order_by(models.Thread.created_at.desc())
        .all()
    )


@router.patch("/{thread_id}", response_model=schemas.ThreadOut)
def update_thread(
    project_id: UUID,
    thread_id: UUID,
    thread_update: schemas.ThreadUpdate,
    db: Session = Depends(get_db),
):
    thread = (
        db.query(models.Thread)
        .filter(
            models.Thread.id == str(thread_id),
            models.Thread.project_id == str(project_id),
        )
        .first()
    )
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    data = thread_update.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(thread, field, value)

    db.commit()
    db.refresh(thread)
    return thread
