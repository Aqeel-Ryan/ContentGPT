"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Category = {
  id: string
  name: string
  icon: string
}

type Headline = {
  id: string
  title: string
  description: string
  source: string
  url: string
}

type VideoLength = "15s" | "30s" | "1m" | "2-3m" | "5m+"

type ContentPackage = {
  script: {
    intro: string
    body: string
    conclusion: string
  }
  graphics: string[]
  thumbnails: string[]
}

interface ContentContextType {
  selectedCategory: Category | null
  selectedHeadline: Headline | null
  selectedVideoLength: VideoLength | null
  contentPackage: ContentPackage | null
  videoIdeas: string[] | null
  setSelectedCategory: (category: Category) => void
  setSelectedHeadline: (headline: Headline) => void
  setSelectedVideoLength: (length: VideoLength) => void
  setContentPackage: (content: ContentPackage) => void
  setVideoIdeas: (ideas: string[]) => void
  resetSelections: () => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedHeadline, setSelectedHeadline] = useState<Headline | null>(null)
  const [selectedVideoLength, setSelectedVideoLength] = useState<VideoLength | null>(null)
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null)
  const [videoIdeas, setVideoIdeas] = useState<string[] | null>(null)

  const resetSelections = () => {
    setSelectedCategory(null)
    setSelectedHeadline(null)
    setSelectedVideoLength(null)
    setContentPackage(null)
    setVideoIdeas(null)
  }

  return (
    <ContentContext.Provider
      value={{
        selectedCategory,
        selectedHeadline,
        selectedVideoLength,
        contentPackage,
        videoIdeas,
        setSelectedCategory,
        setSelectedHeadline,
        setSelectedVideoLength,
        setContentPackage,
        setVideoIdeas,
        resetSelections,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}
