"""
Small idempotent migrations for the sprint prototype.

This project does not have Alembic wired yet, so Stage 1 keeps schema
drift under control with explicit Postgres DDL. The statements are safe to
run repeatedly and only add the columns/tables needed by the branch-memory
MVP.
"""

from sqlalchemy import inspect, text

from app.database import Base, engine
from app import models  # noqa: F401 - registers models with Base.metadata


def _table_exists(table_name: str) -> bool:
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()


def run_stage1_migrations() -> None:
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        conn.execute(
            text(
                """
                ALTER TABLE threads
                ADD COLUMN IF NOT EXISTS parent_id UUID NULL,
                ADD COLUMN IF NOT EXISTS content TEXT NULL,
                ADD COLUMN IF NOT EXISTS node_type VARCHAR NOT NULL DEFAULT 'idea',
                ADD COLUMN IF NOT EXISTS position_x DOUBLE PRECISION NULL,
                ADD COLUMN IF NOT EXISTS position_y DOUBLE PRECISION NULL
                """
            )
        )

        conn.execute(
            text(
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_constraint
                        WHERE conname = 'threads_parent_id_fkey'
                    ) THEN
                        ALTER TABLE threads
                        ADD CONSTRAINT threads_parent_id_fkey
                        FOREIGN KEY (parent_id)
                        REFERENCES threads(id)
                        ON DELETE SET NULL;
                    END IF;
                END $$;
                """
            )
        )

        conn.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_threads_parent_id
                ON threads(parent_id)
                """
            )
        )

        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS relationships (
                    id UUID PRIMARY KEY,
                    source_id UUID REFERENCES threads(id) ON DELETE CASCADE,
                    target_id UUID REFERENCES threads(id) ON DELETE CASCADE,
                    rel_type VARCHAR DEFAULT 'related',
                    weight DOUBLE PRECISION DEFAULT 1.0,
                    context_hint VARCHAR NULL
                )
                """
            )
        )

        conn.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_relationships_source_id
                ON relationships(source_id)
                """
            )
        )
        conn.execute(
            text(
                """
                CREATE INDEX IF NOT EXISTS ix_relationships_target_id
                ON relationships(target_id)
                """
            )
        )

        if _table_exists("nodes"):
            conn.execute(
                text(
                    """
                    UPDATE threads
                    SET content = latest_node.content
                    FROM (
                        SELECT DISTINCT ON (thread_id)
                            thread_id,
                            content
                        FROM nodes
                        ORDER BY thread_id, created_at DESC
                    ) AS latest_node
                    WHERE threads.id = latest_node.thread_id
                      AND threads.content IS NULL
                    """
                )
            )


if __name__ == "__main__":
    run_stage1_migrations()
    engine.dispose()
    print("Stage 1 migrations applied.")
