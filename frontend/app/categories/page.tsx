"use client"

import { useRouter } from "next/navigation"
import { useContent } from "@/context/content-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Briefcase, Cpu, Dumbbell, Film, Globe, Microscope, DollarSign } from "lucide-react"
import Logo from "@/components/logo"

const categories = [
  { id: "politics", name: "Politics", icon: <Globe className="h-10 w-10" /> },
  { id: "business", name: "Business", icon: <Briefcase className="h-10 w-10" /> },
  { id: "technology", name: "Technology", icon: <Cpu className="h-10 w-10" /> },
  { id: "science", name: "Science", icon: <Microscope className="h-10 w-10" /> },
  { id: "health", name: "Health", icon: <Dumbbell className="h-10 w-10" /> },
  { id: "entertainment", name: "Entertainment", icon: <Film className="h-10 w-10" /> },
  { id: "sports", name: "Sports", icon: <Dumbbell className="h-10 w-10" /> },
  { id: "finance", name: "Finance", icon: <DollarSign className="h-10 w-10" /> },
]

export default function CategoriesPage() {
  const router = useRouter()
  const { setSelectedCategory } = useContent()

  const handleCategorySelect = (category: any) => {
    setSelectedCategory({
      id: category.id,
      name: category.name,
      icon: category.id,
    })
    router.push("/headlines")
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
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Select a News Category
          </h1>
          <p className="text-muted-foreground">Choose a category to see the latest headlines</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Card
                className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
                onClick={() => handleCategorySelect(category)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 text-primary">{category.icon}</div>
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
