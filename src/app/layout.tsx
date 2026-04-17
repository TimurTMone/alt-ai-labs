import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GdprConsent } from "@/components/challenge/gdpr-consent"
import { PostHogProvider } from "@/components/analytics/posthog-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { ThemeProvider } from "@/lib/theme-provider"
import { MetaPixel } from "@/components/analytics/meta-pixel"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://altailabs.club"),
  title: {
    default: "Alt AI Labs Club — AI Tournament for Future Founders",
    template: "%s | Alt AI Labs Club",
  },
  description: "Learn AI by building. Compete in challenges. Win cash prizes. Top builders get hired. Join the club.",
  keywords: ["AI", "learn AI", "build AI", "AI tournament", "AI challenges", "AI community", "win prizes", "AI jobs", "future founders", "vibe coding"],
  authors: [{ name: "Alt AI Labs" }],
  creator: "Alt AI Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://altailabs.club",
    siteName: "Alt AI Labs Club",
    title: "Alt AI Labs Club — Learn. Build. Compete. Get Hired.",
    description: "AI tournament for future founders. Watch drops, build challenges, win cash prizes. Top performers get hired by Alt AI Labs and partners.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alt AI Labs Club — AI Tournament for Future Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alt AI Labs Club — Learn. Build. Compete. Get Hired.",
    description: "AI tournament for future founders. Watch drops, build challenges, win cash prizes. Top performers get hired.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
          <ThemeProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </ThemeProvider>
        </PostHogProvider>
        <MetaPixel />
        <GdprConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
