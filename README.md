# ContentGPT - AI-Powered Content Generation Platform

ContentGPT is a full-stack application that leverages AI to generate video content ideas and packages based on trending news. The platform consists of a Next.js frontend and a FastAPI backend with OpenAI integration.

## Features
- Fetch trending news headlines
- Generate video content ideas from news
- Create complete content packages including scripts and outlines
- Customizable content style and platform formats

## Technology Stack
### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Framer Motion animations

### Backend
- FastAPI
- Uvicorn server
- OpenAI API
- Python 3.10+

## Installation

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- OpenAI API key (set in .env file)

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Frontend Development Server
From the frontend directory:
```bash
npm run dev
```
Runs on http://localhost:3000

### Backend Development Server
From the backend directory:
```bash
uvicorn app.main:app --reload
```
Runs on http://localhost:8000

## API Endpoints
- `GET /api/news/trending` - Get trending news headlines
- `GET /api/news/article-content` - Get full article content
- `POST /api/content/video-ideas` - Generate video ideas from news
- `POST /api/content/generate-package` - Create full content package

## Configuration
Create a `.env` file in both frontend and backend directories with:
```
OPENAI_API_KEY=your_api_key_here
```

## Requirements

### Backend Requirements (backend/requirements.txt)
```
fastapi==0.95.2
uvicorn==0.22.0
httpx==0.24.1
openai==0.27.8
python-dotenv==1.0.0
```

### Frontend Key Dependencies
See full list in frontend/package.json
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI components
- OpenAI client

## Project Structure
```
backend/
  app/
    main.py               # FastAPI application
    services/             # Business logic
    config.py             # Application settings
frontend/
  app/                    # Next.js app router
  components/             # UI components
  lib/                    # Utility functions
  public/                 # Static assets
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
