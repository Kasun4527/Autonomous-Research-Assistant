from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from agents.planner import planner_agent
from agents.searcher import searcher_agent
from agents.writer import writer_agent
from agents.critic import critic_agent

class ResearchState(TypedDict):
    topic: str
    questions: List[str]
    sources: str
    report: str
    score: int
    feedback: str
    revision: int

# Conditional logic — loop කරනවද END කරනවද?
def should_continue(state: dict) -> str:
    score = state.get("score", 0)
    revision = state.get("revision", 0)

    # Score හොඳයි නම් හෝ 3 වතාවක් try කළා නම් → finish
    if score >= 7 or revision >= 3:
        print(f"\n🏁 Finishing (score={score}, revisions={revision})")
        return "end"
    else:
        print(f"\n🔄 Looping back (score={score}, revision={revision})")
        return "rewrite"

def build_graph():
    graph = StateGraph(ResearchState)

    graph.add_node("planner", planner_agent)
    graph.add_node("searcher", searcher_agent)
    graph.add_node("writer", writer_agent)
    graph.add_node("critic", critic_agent)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "searcher")
    graph.add_edge("searcher", "writer")
    graph.add_edge("writer", "critic")

    # 🔄 Conditional edge — critic වලින් පස්සේ loop හෝ end
    graph.add_conditional_edges(
        "critic",
        should_continue,
        {
            "rewrite": "writer",   # loop back to writer
            "end": END
        }
    )

    return graph.compile()

pipeline = build_graph()