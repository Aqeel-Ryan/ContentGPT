from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .services.news_service import news_service
from .services.content_service import content_service
from typing import List, Dict
# import httpx
# import openai
import logging

# Initialize FastAPI app
app = FastAPI(title=settings.APP_NAME)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}"}

@app.get("/api/news/trending")
async def get_trending_news(category: str = "general", country: str = "us"):
    """Get trending news headlines"""
    try:
        news = await news_service.get_trending_news(category, country)
        return {"status": "success", "data": news}
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content/video-ideas")
async def generate_video_ideas(request: Dict = Body(...)):
    """Generate video ideas based on news headlines"""
    try:
        if "headlines" not in request:
            raise HTTPException(status_code=400, detail="Headlines are required")
            
        style = request.get("style", "informative")
        ideas = await content_service.generate_video_ideas(
            request["headlines"],
            style=style
        )
        return {"status": "success", "ideas": ideas}
    except Exception as e:
        logger.error(f"Error generating ideas: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content/generate-package")
async def generate_content_package(request: Dict = Body(...)):
    """Generate full content package for a video idea"""
    try:
        if "idea" not in request:
            raise HTTPException(status_code=400, detail="Idea is required")
            
        platform = request.get("platform", "tiktok")
        duration = request.get("duration", 30)
        style = request.get("style", "informative")
        
        package = await content_service.generate_content_package(
            request["idea"],
            platform=platform,
            duration=duration,
            style=style
        )
        return {"status": "success", "package": package}
    except Exception as e:
        logger.error(f"Error generating package: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
