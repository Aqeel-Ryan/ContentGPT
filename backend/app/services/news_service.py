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
                        "publishedAt": article["publishedAt"],
                        "content": None  # Will be populated by get_article_content
                    }
                    for article in data.get("articles", [])
                ]
                
        except httpx.HTTPStatusError as e:
            raise Exception(f"NewsAPI request failed: {e.response.status_code}")
        except Exception as e:
            raise Exception(f"Error fetching news: {str(e)}")

    async def get_article_content(self, url: str) -> str:
        """Fetch full content of a news article"""
        try:
            async with httpx.AsyncClient() as client:
                # First try to get content from NewsAPI if available
                if "newsapi.org" in url:
                    article_id = url.split("/")[-1]
                    content_url = f"https://newsapi.org/v2/articles/{article_id}"
                    params = {"apiKey": settings.NEWS_API_KEY}
                    response = await client.get(content_url, params=params)
                    if response.status_code == 200:
                        return response.json().get("content", "")
                
                # Fallback to scraping the article URL
                response = await client.get(url)
                if response.status_code == 200:
                    # Simple content extraction - would need proper HTML parsing in production
                    return response.text[:5000]  # Limit to first 5000 chars
                return ""
                
        except httpx.HTTPStatusError as e:
            raise Exception(f"Article content request failed: {e.response.status_code}")
        except Exception as e:
            raise Exception(f"Error fetching article content: {str(e)}")
                

news_service = NewsService()
