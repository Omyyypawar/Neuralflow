"""
Serializes the ancestry chain into a deterministic, cache-friendly string.

Determinism matters: the Anthropic prompt cache keys on the exact byte
sequence of the cached block. Any nondeterministic formatting (dict
ordering, unstable timestamps, etc.) silently destroys the cache hit
rate, which is the whole cost advantage of branching.
"""

from typing import Any


def build_reasoning_pack(context_graph: dict[str, Any]) -> str:
    intent = context_graph.get("intent", "general")
    project = context_graph.get("project")
    threads = context_graph.get("threads", [])
    traversal = context_graph.get("traversal", "none")

    lines: list[str] = []
    lines.append(f"INTENT: {intent}")
    lines.append(f"TRAVERSAL: {traversal}")

    if project:
        lines.append(f"PROJECT: {project['title']}")
    else:
        lines.append("PROJECT: NOT FOUND")
        return "\n".join(lines)

    if not threads:
        lines.append("NO PRIOR THREADS.")
        return "\n".join(lines)

    if traversal == "ancestry":
        lines.append("ANCESTRY CHAIN (root -> leaf):")
    else:
        lines.append("RECENT THREADS (chronological):")

    for i, t in enumerate(threads, 1):
        node_type = t.get("node_type", "idea").upper()
        lines.append(f"--- NODE {i}: [{node_type}] {t['title']} ---")
        if t.get("content"):
            lines.append(t["content"])
        else:
            lines.append("(no content stored)")

    return "\n".join(lines)
