from services.search import web_search

def searcher_agent(state: dict) -> dict:
    questions = state["questions"]

    all_results = []
    for q in questions:
        print(f"   🔍 Searching: {q[:50]}...")
        result = web_search(q, max_results=2)
        all_results.append(f"### Research Question: {q}\n{result}")

    sources = "\n\n".join(all_results)
    print("\n✅ Searcher done")
    return {**state, "sources": sources}