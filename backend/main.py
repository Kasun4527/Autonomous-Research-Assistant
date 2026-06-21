from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import pipeline

app = FastAPI(title="Autonomous Research Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
async def research(request: ResearchRequest):
    result = pipeline.invoke({
        "topic": request.topic,
        "questions": [],
        "sources": "",
        "report": "",
        "score": 0,
        "feedback": "",
        "revision": 0
    })
    return {
        "topic": result["topic"],
        "questions": result["questions"],
        "report": result["report"],
        "score": result["score"],
        "revisions": result["revision"]
    }

@app.get("/")
def root():
    return {"message": "Research Assistant API running"}