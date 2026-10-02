from app.graph_traversal import build_context_graph
from app.reasoning_pack import build_reasoning_pack
from app.llm_engine import answer_from_reasoning_pack

PROJECT_ID = "71da6960-0795-45b5-aef0-c5e59fe0a465"
QUERY = "Why did we stop earlier?"

graph = build_context_graph(PROJECT_ID, QUERY)
pack = build_reasoning_pack(graph)

answer = answer_from_reasoning_pack(pack, QUERY)

print("\n--- GPT ANSWER ---\n")
print(answer)
