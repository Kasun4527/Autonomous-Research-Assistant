import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv(override=True)

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def web_search(query: str, max_results: int = 3) -> str:
    """Tavily වලින් search කරලා results text එකක් return කරනවා"""
    response = client.search(query=query, max_results=max_results)

    results = []
    for r in response.get("results", []):
        results.append(f"Source: {r['title']}\nURL: {r['url']}\nContent: {r['content']}\n")

    return "\n---\n".join(results)