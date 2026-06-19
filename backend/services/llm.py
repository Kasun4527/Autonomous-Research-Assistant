import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv(override=True)

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    max_tokens=3000
)