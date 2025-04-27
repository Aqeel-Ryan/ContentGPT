import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ContentProvider } from "@/context/content-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ContentGPT - Transform News Into Engaging Content",
  description: "Streamline content creation for news influencers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ContentProvider>{children}</ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
