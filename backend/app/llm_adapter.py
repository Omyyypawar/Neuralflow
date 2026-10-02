"""
Pluggable LLM adapter.

Why this layer exists:
- NeuralFlow sends the same lineage prefix across many sibling branches.
  With Anthropic's prompt caching, that prefix is read once and reused,
  which is the cost moat that makes branching affordable at scale.
- Phase 2 (agentic swarm) will mix providers and model tiers per agent
  (fast/cheap for classification, strong reasoning for synthesis).
  Callers should not care which provider runs the call.

Callers pass: system_prompt, cached_context (lineage — marked cacheable),
user_query. They get back a plain string answer.

Provider is selected via env var LLM_PROVIDER ("anthropic" | "openai").
Model is selected via LLM_MODEL (optional; adapter-specific default).
"""

import os
from abc import ABC, abstractmethod


DEFAULT_ANTHROPIC_MODEL = "claude-opus-4-7"
DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


class LLMAdapter(ABC):
    @abstractmethod
    def complete(
        self,
        system_prompt: str,
        cached_context: str,
        user_query: str,
    ) -> str:
        ...


class AnthropicAdapter(LLMAdapter):
    def __init__(self, model: str | None = None):
        from anthropic import Anthropic

        self._client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self._model = model or os.getenv("LLM_MODEL") or DEFAULT_ANTHROPIC_MODEL

    def complete(
        self,
        system_prompt: str,
        cached_context: str,
        user_query: str,
    ) -> str:
        # System block is split so the lineage prefix sits behind a
        # cache_control marker. Sibling branches sharing ancestry hit
        # this cache instead of paying full input tokens each time.
        system_blocks = [
            {"type": "text", "text": system_prompt},
            {
                "type": "text",
                "text": f"CONTEXT:\n{cached_context}",
                "cache_control": {"type": "ephemeral"},
            },
        ]

        response = self._client.messages.create(
            model=self._model,
            max_tokens=4096,
            system=system_blocks,
            messages=[{"role": "user", "content": user_query}],
        )

        parts = []
        for block in response.content:
            if getattr(block, "type", None) == "text":
                parts.append(block.text)
        return "".join(parts).strip()


class OpenAIAdapter(LLMAdapter):
    def __init__(self, model: str | None = None):
        from openai import OpenAI

        self._client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self._model = model or os.getenv("LLM_MODEL") or DEFAULT_OPENAI_MODEL

    def complete(
        self,
        system_prompt: str,
        cached_context: str,
        user_query: str,
    ) -> str:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"CONTEXT:\n{cached_context}\n\nQUESTION:\n{user_query}",
                },
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()


def get_adapter() -> LLMAdapter:
    provider = (os.getenv("LLM_PROVIDER") or "anthropic").lower()
    if provider == "anthropic":
        return AnthropicAdapter()
    if provider == "openai":
        return OpenAIAdapter()
    raise ValueError(f"Unknown LLM_PROVIDER: {provider!r}")
