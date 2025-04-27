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
            headlines_text = "\n".join([
                f"Title: {h['title']}\n"
                f"Description: {h.get('description', 'No description')}\n"
                f"Content: {h.get('content', 'No additional content')}\n"
                for h in headlines
            ])
            
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
                        Based on these news articles:
                        {headlines_text}
                        
                        Generate {count} creative and engaging short-form video ideas.
                        Each idea should:
                        - Be 1-2 sentences maximum
                        - Incorporate key details from the article content
                        - Match the requested style: {style}
                        - Include a hook to grab attention
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
                        
                        Additional context:
                        - Style: {style}
                        - Duration: {duration} seconds  
                        - Platform: {platform}
                        - Based on news article content
                        
                        Format your response with these exact section headers:
                        INTRO: [script introduction]
                        BODY: [script main content] 
                        CONCLUSION: [script ending]
                        GRAPHICS: [one visual idea per line]
                        THUMBNAILS: [one thumbnail concept per line]
                        
                        Example:
                        INTRO: Welcome to our video about...
                        BODY: Today we'll cover three main points...
                        CONCLUSION: Thanks for watching...
                        GRAPHICS:
                        - Split screen comparison
                        - Animated infographic
                        THUMBNAILS:
                        - Bold text overlay
                        - Minimalist design
                        """
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            logger.info(f"Raw API response content:\n{content}")
            
            # Initialize default structure with all required fields
            package = {
                "script": {
                    "intro": "No intro generated",
                    "body": "No body content generated",
                    "conclusion": "No conclusion generated"
                },
                "graphics": ["No graphics suggestions generated"],
                "thumbnails": ["No thumbnail concepts generated"]
            }

            # Parse script sections with more robust handling
            try:
                content_lines = content.split('\n')
                
                # Find section headers
                intro_idx = next((i for i, line in enumerate(content_lines) if "INTRO:" in line), -1)
                body_idx = next((i for i, line in enumerate(content_lines) if "BODY:" in line), -1)
                conclusion_idx = next((i for i, line in enumerate(content_lines) if "CONCLUSION:" in line), -1)
                graphics_idx = next((i for i, line in enumerate(content_lines) if "GRAPHICS:" in line), -1)
                thumbnails_idx = next((i for i, line in enumerate(content_lines) if "THUMBNAILS:" in line), -1)

                # Extract sections
                if intro_idx >= 0 and body_idx > intro_idx:
                    package["script"]["intro"] = '\n'.join(
                        line.strip() 
                        for line in content_lines[intro_idx+1:body_idx] 
                        if line.strip() and not line.startswith(('**', '==='))
                    ).strip()

                if body_idx >= 0 and conclusion_idx > body_idx:
                    package["script"]["body"] = '\n'.join(
                        line.strip()
                        for line in content_lines[body_idx+1:conclusion_idx]
                        if line.strip() and not line.startswith(('**', '==='))
                    ).strip()

                if conclusion_idx >= 0:
                    end_idx = min(
                        i for i in [graphics_idx, thumbnails_idx, len(content_lines)] 
                        if i > conclusion_idx
                    )
                    package["script"]["conclusion"] = '\n'.join(
                        line.strip()
                        for line in content_lines[conclusion_idx+1:end_idx]
                        if line.strip() and not line.startswith(('**', '==='))
                    ).strip()

                # Extract graphics
                if graphics_idx >= 0:
                    end_idx = thumbnails_idx if thumbnails_idx > graphics_idx else len(content_lines)
                    package["graphics"] = [
                        line.replace('-', '').strip()
                        for line in content_lines[graphics_idx+1:end_idx]
                        if line.strip() and not line.startswith(('**', '==='))
                    ]

                # Extract thumbnails
                if thumbnails_idx >= 0:
                    package["thumbnails"] = [
                        line.replace('-', '').strip()
                        for line in content_lines[thumbnails_idx+1:]
                        if line.strip() and not line.startswith(('**', '==='))
                    ]

            except Exception as e:
                logger.error(f"Error parsing content package: {str(e)}")
                # Fall back to default structure with error messages
                package = {
                    "script": {
                        "intro": "Error generating content",
                        "body": "Please try again",
                        "conclusion": ""
                    },
                    "graphics": ["Error generating graphics"],
                    "thumbnails": ["Error generating thumbnails"]
                }

            logger.info(f"Processed package:\n{package}")
            return package
            
        except Exception as e:
            logger.error(f"Error generating content package: {str(e)}")
            raise Exception("Failed to generate content package")

content_service = ContentService()
