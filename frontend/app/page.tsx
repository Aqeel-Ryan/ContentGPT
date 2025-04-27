import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnimatedText from "@/components/animated-text"
import { ArrowRight } from "lucide-react"
import Logo from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo />
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent">
            ContentGPT
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
        </nav>
        <Button variant="outline">Sign In</Button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <AnimatedText text="Transform News Into Engaging Content in Minutes" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Streamline your content creation process with AI-powered tools designed specifically for news influencers.
          </p>
          <Link href="/categories">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
            >
              Let&apos;s Begin! <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard
              number={1}
              title="Select Category"
              description="Choose from a variety of news categories that interest you."
            />
            <StepCard
              number={2}
              title="Pick Headlines"
              description="Browse through the latest news headlines and select your topic."
            />
            <StepCard
              number={3}
              title="Choose Length"
              description="Select your desired video length from 15 seconds to 5+ minutes."
            />
            <StepCard
              number={4}
              title="Generate Content"
              description="Get a complete package with scripts, graphics ideas, and thumbnail concepts."
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose ContentGPT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Save Time"
              description="Generate complete content packages in minutes, not hours."
              icon="⏱️"
            />
            <FeatureCard
              title="Stay Relevant"
              description="Access the latest news headlines across multiple categories."
              icon="📰"
            />
            <FeatureCard
              title="Boost Engagement"
              description="Create compelling scripts and visuals that captivate your audience."
              icon="🚀"
            />
          </div>
        </div>
      </section>

      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 ContentGPT. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border/50">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border/50">
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-2 text-primary">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
