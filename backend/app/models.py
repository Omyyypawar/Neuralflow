from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Text, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    threads = relationship(
        "Thread",
        back_populates="project",
        cascade="all, delete-orphan",
    )


class Thread(Base):
    __tablename__ = "threads"
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    project_id = Column(UUID(as_uuid=False), ForeignKey("projects.id"), nullable=False)

    # Branch lineage — the core differentiator.
    # A thread is a node; parent_id is the edge back toward the root.
    # NULL parent_id => root node of the project canvas.
    parent_id = Column(
        UUID(as_uuid=False),
        ForeignKey("threads.id"),
        nullable=True,
        index=True,
    )

    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    node_type = Column(String, nullable=False, default="idea", server_default="idea")

    # Canvas coordinates for the spatial UI.
    position_x = Column(Float, nullable=True)
    position_y = Column(Float, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="threads")
    parent = relationship("Thread", remote_side=[id], backref="children")


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    source_id = Column(UUID(as_uuid=False), ForeignKey("threads.id"), index=True)
    target_id = Column(UUID(as_uuid=False), ForeignKey("threads.id"), index=True)

    # Semantic type: 'refines', 'contradicts', 'prerequisite', 'related'
    rel_type = Column(String, default="related")
    weight = Column(Float, default=1.0)
    context_hint = Column(String, nullable=True)
