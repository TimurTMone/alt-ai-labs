import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GdprConsent } from "@/components/challenge/gdpr-consent"
import { PostHogProvider } from "@/components/analytics/posthog-provider"
import { MetaPixel } from "@/components/analytics/meta-pixel"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://alt-ai-labs.vercel.app"),
  title: {
    default: "Alt AI Labs — Learn AI by Building Real Products",
    template: "%s | Alt AI Labs",
  },
  description: "Every week: a new AI project, a video lesson, a build challenge. Ship real AI products and win cash prizes. Join 127+ builders.",
  keywords: ["AI", "learn AI", "build AI", "AI projects", "Claude", "AI course", "AI community", "AI challenges", "vibe coding", "AI agents"],
  authors: [{ name: "Alt AI Labs" }],
  creator: "Alt AI Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alt-ai-labs.vercel.app",
    siteName: "Alt AI Labs",
    title: "Alt AI Labs — Stop Learning AI. Start Shipping It.",
    description: "Every week: a new AI project, a video lesson, a build challenge. The best builds win cash prizes. Join free.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alt AI Labs — Learn AI by building real products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alt AI Labs — Stop Learning AI. Start Shipping It.",
    description: "Every week: a new AI project, a video lesson, a build challenge. The best builds win cash prizes. Join free.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <MetaPixel />
        <GdprConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
