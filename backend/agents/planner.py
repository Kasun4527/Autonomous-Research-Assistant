from langchain_core.messages import HumanMessage
from services.llm import llm

def planner_agent(state: dict) -> dict:
    topic = state["topic"]

    prompt = f"""
You are a research planner. The user wants to research this topic:

"{topic}"

Break this down into 3 specific, focused research questions that together
cover the topic comprehensively.

Return ONLY the 3 questions, one per line, no numbering.
"""
    response = llm.invoke([HumanMessage(content=prompt)])
    questions = [q.strip() for q in response.content.split("\n") if q.strip()]
    print(f"\n✅ Planner: {len(questions)} questions")
    return {**state, "questions": questions[:3]}