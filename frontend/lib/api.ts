import { NewsItem } from '../types/news';

export async function fetchTrendingNews(
  category: string = 'science',
  country: string = 'us'
): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `http://localhost:8000/api/news/trending?category=${category}&country=${country}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
}

export async function generateVideoIdeas(headlines: NewsItem[], style: string = 'informative'): Promise<string[]> {
  try {
    const response = await fetch(
      'http://localhost:8000/api/content/video-ideas',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headlines, style }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.ideas || [];
  } catch (error) {
    console.error('Error generating video ideas:', error);
    return [];
  }
}

export async function generateContentPackage(
  idea: string,
  platform: string = 'tiktok',
  duration: number = 30,
  style: string = 'informative'
): Promise<any> {
  try {
    const response = await fetch(
      'http://localhost:8000/api/content/generate-package',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, platform, duration, style }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.package || {};
  } catch (error) {
    console.error('Error generating content package:', error);
    return {};
  }
}
