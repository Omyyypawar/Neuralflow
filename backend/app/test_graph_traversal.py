from app.graph_traversal import build_context_graph
from pprint import pprint

PROJECT_ID = "71da6960-0795-45b5-aef0-c5e59fe0a465"
QUERY = "Why did we stop earlier?"

result = build_context_graph(PROJECT_ID, QUERY)

print("\n--- GRAPH TRAVERSAL OUTPUT ---\n")
pprint(result)

