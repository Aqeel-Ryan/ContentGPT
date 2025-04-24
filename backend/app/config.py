import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME = "TrendClip API"
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    API_VERSION = "v1"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database settings
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trendclip.db")
    
    # API rate limiting
    RATE_LIMIT = int(os.getenv("RATE_LIMIT", "100"))  # requests per minute

settings = Settings()
