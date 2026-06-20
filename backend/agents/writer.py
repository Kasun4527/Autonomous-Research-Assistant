from langchain_core.messages import HumanMessage
from services.llm import llm

def writer_agent(state: dict) -> dict:
    topic = state["topic"]
    sources = state["sources"][:6000]  # token limit safety
    feedback = state.get("feedback", "")

    feedback_section = ""
    if feedback:
        feedback_section = f"""
IMPORTANT: A previous draft was reviewed. Improve based on this feedback:
{feedback}
"""

    prompt = f"""
You are a research writer. Write a well-structured research report on:

"{topic}"

Use ONLY the following sources:
{sources}
{feedback_section}

The report should have:
1. Introduction
2. Main findings (with clear sections)
3. Conclusion

Write in clear, professional language. Cite sources where relevant.
"""
    response = llm.invoke([HumanMessage(content=prompt)])
    print("\n✅ Writer done")

    # Track how many times we've written
    revision = state.get("revision", 0) + 1
    return {**state, "report": response.content, "revision": revision}