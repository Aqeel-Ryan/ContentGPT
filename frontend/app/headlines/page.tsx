"use client"

import { useEffect, useState } from "react"
import { fetchTrendingNews } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useContent } from "@/context/content-context"
import { NewsItem } from "@/types/news"

export default function HeadlinesPage() {
  const [headlines, setHeadlines] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory, setSelectedHeadline } = useContent();
  const router = useRouter();
  
  useEffect(() => {
    const loadHeadlines = async () => {
      setLoading(true);
      try {
        const news = await fetchTrendingNews(
          selectedCategory?.name.toLowerCase() || 'general'
        );
        setHeadlines(news);
      } catch (error) {
        console.error('Error loading headlines:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHeadlines();
  }, [selectedCategory]);

  if (loading) {
    return <div className="p-4">Loading headlines...</div>;
  }

  if (!headlines.length) {
    return <div className="p-4">No headlines found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {selectedCategory?.name || 'General'} Headlines - Select one to generate video content
      </h1>
      <div className="space-y-4">
        {headlines.map((headline) => (
          <div 
            key={headline.url} 
            className="border p-4 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
            onClick={() => {
              setSelectedHeadline({
                id: headline.url, // Using URL as ID since NewsItem doesn't have one
                title: headline.title,
                description: headline.description,
                source: headline.source,
                url: headline.url
              });
              router.push('/video-length');
            }}
          >
            <h2 className="text-xl font-semibold">{headline.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{headline.source}</p>
            <p className="mt-2">{headline.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <a 
                href={headline.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Read original article
              </a>
              <span className="text-sm text-muted-foreground">
                Click to generate video content
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
