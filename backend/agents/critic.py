from langchain_core.messages import HumanMessage
from services.llm import llm

def critic_agent(state: dict) -> dict:
    topic = state["topic"]
    report = state["report"][:5000]

    prompt = f"""
You are a strict research critic. Review this report on "{topic}".

Report:
{report}

Evaluate on:
1. Completeness — does it cover the topic well?
2. Clarity and structure
3. Use of evidence/sources

Respond in EXACTLY this format:
SCORE: <number from 1 to 10>
FEEDBACK: <specific improvements needed, or "Good" if score >= 7>
"""
    response = llm.invoke([HumanMessage(content=prompt)])
    content = response.content

    # Parse score
    score = 5
    feedback = ""
    for line in content.split("\n"):
        if line.upper().startswith("SCORE:"):
            try:
                score = int("".join(c for c in line.split(":")[1] if c.isdigit()))
            except:
                score = 5
        if line.upper().startswith("FEEDBACK:"):
            feedback = line.split(":", 1)[1].strip()

    print(f"\n✅ Critic: Score = {score}/10")
    return {**state, "score": score, "feedback": feedback}