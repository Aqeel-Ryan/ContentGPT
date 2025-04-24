import openai
from ..config import settings
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ContentService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        openai.api_base = "https://api.deepseek.com"

    async def generate_video_ideas(self, headlines: List[Dict], count: int = 5, style: str = "informative") -> List[str]:
        """Generate video ideas based on news headlines"""
        try:
            headlines_text = "\n".join([h["title"] for h in headlines])
            
            style_prompt = {
                "informative": "Focus on clear, factual presentation",
                "humorous": "Add humor and lighthearted takes",
                "dramatic": "Use dramatic storytelling techniques", 
                "educational": "Provide educational insights and context"
            }.get(style, "")
            
            response = await openai.ChatCompletion.acreate(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": f"""
                        You are a creative content strategist for short-form video platforms.
                        {style_prompt}
                        """
                    },
                    {
                        "role": "user",
                        "content": f"""
                        Based on these current news headlines:
                        {headlines_text}
                        
                        Generate {count} creative and engaging short-form video ideas.
                        Each idea should be 1-2 sentences maximum.
                        Style: {style}
                        """
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            ideas = response.choices[0].message.content.split("\n")
            return [idea.strip() for idea in ideas if idea.strip()]
            
        except Exception as e:
            logger.error(f"Error generating video ideas: {str(e)}")
            raise Exception("Failed to generate video ideas")

    async def generate_content_package(self, idea: str, platform: str = "tiktok", 
                                     duration: int = 30, style: str = "informative") -> Dict:
        """Generate a content package for a video idea"""
        try:
            style_prompt = {
                "informative": "Focus on clear, factual presentation",
                "humorous": "Add humor and lighthearted elements",
                "dramatic": "Use dramatic storytelling techniques",
                "educational": "Provide educational insights and context"
            }.get(style, "")
            
            response = await openai.ChatCompletion.acreate(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": f"""
                        You are a professional video content creator for {platform}.
                        Create detailed content packages for {duration}-second videos.
                        {style_prompt}
                        """
                    },
                    {
                        "role": "user",
                        "content": f"""
                        Generate a complete content package for this video idea:
                        "{idea}"
                        
                        Style: {style}
                        Duration: {duration} seconds
                        Platform: {platform}
                        
                        Include:
                        1. A detailed script with timing markers
                        2. Visual ideas (shots, angles, effects)
                        3. Suggested hashtags
                        4. Recommended thumbnail text
                        """
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return {
                "script": "",
                "visuals": [],
                "hashtags": [],
                "thumbnail": ""
            }
            
        except Exception as e:
            logger.error(f"Error generating content package: {str(e)}")
            raise Exception("Failed to generate content package")

content_service = ContentService()
