"use client"

import { useRouter } from "next/navigation"
import { useContent } from "@/context/content-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Logo from "@/components/logo"
import { generateVideoIdeas } from "@/lib/api"
import { useState } from "react"

type VideoLengthOption = {
  value: "15s" | "30s" | "1m" | "2-3m" | "5m+"
  label: string
  description: string
}

const videoLengthOptions: VideoLengthOption[] = [
  {
    value: "15s",
    label: "15 Seconds",
    description: "Perfect for short-form content like TikTok or Instagram Reels",
  },
  {
    value: "30s",
    label: "30 Seconds",
    description: "Ideal for quick news updates and social media posts",
  },
  {
    value: "1m",
    label: "1 Minute",
    description: "Good for concise topic coverage with key points",
  },
  {
    value: "2-3m",
    label: "2-3 Minutes",
    description: "Detailed coverage with supporting information",
  },
  {
    value: "5m+",
    label: "5+ Minutes",
    description: "In-depth analysis and comprehensive coverage",
  },
]

export default function VideoLengthPage() {
  const router = useRouter()
  const { selectedHeadline, setSelectedVideoLength, setVideoIdeas } = useContent()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!selectedHeadline) {
    // Redirect if no headline is selected
    if (typeof window !== "undefined") {
      router.push("/headlines")
    }
    return null
  }

  const handleLengthSelect = async (length: "15s" | "30s" | "1m" | "2-3m" | "5m+") => {
    if (!selectedHeadline) return
    
    setLoading(true)
    setError(null)
    try {
      // Make sure to properly destructure the selectedHeadline properties
      // or ensure selectedHeadline has the expected structure
      const headline = {
        title: selectedHeadline.title || "",
        description: selectedHeadline.description || "",
        source: selectedHeadline.source || "",
        url: selectedHeadline.url || "",
        content: selectedHeadline.content || ""
      }
      
      const ideas = await generateVideoIdeas([headline], "informative")
      setSelectedVideoLength(length)
      setVideoIdeas(ideas)
      router.push("/content")
    } catch (err) {
      console.error("Error generating video ideas:", err)
      setError("Failed to generate video ideas. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Logo className="h-8 w-auto mr-2" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ContentGPT
          </span>
        </div>
        <div className="mb-8">
          <Link href="/headlines">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Headlines
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Select Video Length
          </h1>
          <p className="text-muted-foreground mb-2">Choose how long your content should be</p>
          <div className="bg-muted p-4 rounded-md mb-6">
            <h2 className="font-semibold">Selected Topic:</h2>
            <p>{selectedHeadline.title}</p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-8 w-3/4 mb-4 bg-muted rounded-md animate-pulse" />
                  <div className="h-4 w-full mb-4 bg-muted rounded-md animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {videoLengthOptions.map((option) => (
              <motion.div key={option.value} variants={item}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  onClick={() => handleLengthSelect(option.value)}
                >
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{option.label}</h2>
                    <p className="text-muted-foreground mb-4">{option.description}</p>
                    <Button variant="outline" className="w-full">
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}