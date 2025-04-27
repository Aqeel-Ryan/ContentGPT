"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useContent } from "@/context/content-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { generateContentPackage } from "@/lib/api"

// Import or define the ContentPackage interface
interface ContentPackage {
  script: {
    intro: string;
    body: string;
    conclusion: string;
  };
  graphics: string[];
  thumbnails: string[];
}

const Logo = dynamic(() => import("@/components/logo"), {
  ssr: false,
  loading: () => <div className="h-8 w-8" /> // Add loading placeholder
});

export default function ContentPage() {
  const router = useRouter()
  const { selectedHeadline, selectedVideoLength } = useContent()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !selectedHeadline || !selectedVideoLength) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 py-10">
      <div className="container mx-auto px-4">
        <ContentGenerator 
          router={router}
          selectedHeadline={selectedHeadline}
          selectedVideoLength={selectedVideoLength}
        />
      </div>
    </div>
  )
}

// Define proper types for the ContentGenerator props
interface ContentGeneratorProps {
  router: ReturnType<typeof useRouter>;
  selectedHeadline: { title: string; [key: string]: any };
  selectedVideoLength: string;
}

function ContentGenerator({ router, selectedHeadline, selectedVideoLength }: ContentGeneratorProps) {
  // Move ALL hooks to the top, before any conditions
  const [isHydrated, setIsHydrated] = useState(false);
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("script");
  const [duration, setDuration] = useState<number>(0);

  // Define the fetchContent function before using it in useEffect
  const fetchContent = async () => {
    if (!contentPackage && selectedHeadline && duration) {
      setLoading(true);
      try {
        const packageData = await generateContentPackage(
          selectedHeadline.title,
          "tiktok",
          duration,
          "informative"
        );
        console.log("Received content package:", packageData);
        setContentPackage(packageData as ContentPackage);
      } catch (err) {
        console.error("Error in fetchContent:", err);
        setError("Failed to generate content. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Group all useEffects together
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (selectedVideoLength) {
      // Convert string like "15s", "30s", "1m", "2-3m", "5m+" to a number
      let durationValue = 0;
      if (selectedVideoLength === "15s") durationValue = 15;
      else if (selectedVideoLength === "30s") durationValue = 30;
      else if (selectedVideoLength === "1m") durationValue = 60;
      else if (selectedVideoLength === "2-3m") durationValue = 150; // Average of 2-3 minutes
      else if (selectedVideoLength === "5m+") durationValue = 300; // 5 minutes
      
      setDuration(durationValue);
    }
  }, [selectedVideoLength]);

  // Fix the infinite loop by removing contentPackage from the dependency array
  useEffect(() => {
    let isMounted = true;
    console.log(isHydrated ,selectedHeadline,duration, !contentPackage, !loading)
    console.log(isHydrated && selectedHeadline && duration > 0 && !contentPackage)
    if (isHydrated && selectedHeadline && duration > 0 && !contentPackage ) {
      fetchContent();
    }

    return () => {
      isMounted = false;
    };
  }, [isHydrated, selectedHeadline, duration]);

  // Move the hydration check after all hooks
  if (!isHydrated) {
    return null;
  }

  const handleCopyText = async (text: string) => {
    if (!text) return;
    
    try {
      await navigator?.clipboard?.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied to clipboard!');
    }
  }

  const handleRegenerateContent = async () => {
    if (!selectedHeadline?.title || !duration) return
    
    setLoading(true)
    setError(null)
    try {
      const packageData = await generateContentPackage(
        selectedHeadline.title,
        "tiktok",
        duration,
        "informative"
      )
      console.log("Regenerated content package:", packageData)
      setContentPackage(packageData as ContentPackage)
    } catch (err) {
      setError("Failed to regenerate content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center mb-8">
        <Logo className="h-8 w-auto mr-2" />
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ContentGPT
        </span>
      </div>
      <div className="mb-8">
        <Link href="/video-length">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Video Length
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Content Package
        </h1>
        <p className="text-muted-foreground mb-2">Generated content based on your selections</p>
        <div className="bg-muted p-4 rounded-md mb-6">
          <h2 className="font-semibold">Topic:</h2>
          <p>{selectedHeadline.title}</p>
          <h2 className="font-semibold mt-2">Video Length:</h2>
          <p>{selectedVideoLength}</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      {loading ? (
        <div className="space-y-6">
          <p>Loading content...</p>
        </div>
      ) : !contentPackage ? (
        <div className="space-y-6">
          <p>No content available</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="script" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="script">Video Script</TabsTrigger>
              <TabsTrigger value="graphics">Graphics Ideas</TabsTrigger>
              <TabsTrigger value="thumbnails">Thumbnail Concepts</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {contentPackage?.script?.intro || "No intro generated yet"}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(contentPackage?.script?.intro || "")}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Body</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {contentPackage?.script?.body || "No body content generated yet"}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(contentPackage?.script?.body || "")}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conclusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {contentPackage?.script?.conclusion || "No conclusion generated yet"}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(contentPackage?.script?.conclusion || "")}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    handleCopyText(
                      `${contentPackage?.script?.intro || ''}\n\n${contentPackage?.script?.body || ''}\n\n${contentPackage?.script?.conclusion || ''}`,
                    )
                  }
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Full Script
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="graphics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Graphics Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {contentPackage?.graphics?.map((graphic, index) => (
                      <li key={index} className="p-4 border rounded-md">
                        <p>{graphic}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => handleCopyText(contentPackage?.graphics?.join("\n\n") || "")}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="thumbnails" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {contentPackage?.thumbnails?.map((thumbnail, index) => (
                      <li key={index} className="p-4 border rounded-md">
                        <p>{thumbnail}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => handleCopyText(contentPackage?.thumbnails?.join("\n\n") || "")}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => router.push("/")}>
              Start Over
            </Button>
            <Button onClick={handleRegenerateContent}>
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Content
            </Button>
          </div>

          {/* {process.env.NODE_ENV === 'development' && <DebugPanel data={contentPackage} />} */}
        </motion.div>
      )}
    </>
  )
}