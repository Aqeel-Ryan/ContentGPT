import httpx
from ..config import settings
from typing import List, Dict

class NewsService:
    async def get_trending_news(self, category: str = "general", country: str = "us", page_size: int = 10) -> List[Dict]:
        """Fetch trending news from NewsAPI"""
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "apiKey": settings.NEWS_API_KEY,
            "category": category,
            "country": country,
            "pageSize": page_size
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                return [
                    {
                        "source": article["source"]["name"],
                        "title": article["title"],
                        "description": article["description"],
                        "url": article["url"],
                        "publishedAt": article["publishedAt"]
                    }
                    for article in data.get("articles", [])
                ]
                
        except httpx.HTTPStatusError as e:
            raise Exception(f"NewsAPI request failed: {e.response.status_code}")
        except Exception as e:
            raise Exception(f"Error fetching news: {str(e)}")

news_service = NewsService()
