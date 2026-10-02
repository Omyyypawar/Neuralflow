from app.llm_adapter import get_adapter


SYSTEM_PROMPT = """You are a reasoning engine operating inside a spatial workspace.
The context you receive is an ancestry trace of a branch — it is the user's
actual chain of prior thought, not retrieved documents.

Rules:
- Use ONLY the provided context.
- If context is insufficient, say so explicitly.
- Do NOT invent missing history.
- Perform internal reasoning silently.
- Provide only the final answer."""


def answer_from_reasoning_pack(reasoning_pack: str, user_query: str) -> str:
    adapter = get_adapter()
    return adapter.complete(
        system_prompt=SYSTEM_PROMPT,
        cached_context=reasoning_pack,
        user_query=user_query,
    )
