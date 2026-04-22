import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

import { Providers } from "@/app/lib/providers"
import { ConditionalLayout } from "@/components/conditional-layout"
import { Analytics } from "@vercel/analytics/next"
const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Geez Security - Cybersecurity Training Courses",
  description: "Professional cybersecurity training courses by experienced security professionals",
  icons: {
    icon: "/geezlogo.png",
    apple: "/geezlogo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="stylesheet" href="https://type.cargo.site/NeueHaasUnica-Regular.css" />
        <style>
          {`
            @font-face {
              font-family: 'Neue Haas Unica';
              src: url('https://type.cargo.site/files/NeueHaasUnica-Medium.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
            }
          `}
        </style>
      </head>
      <body className={dmSans.className} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Analytics />

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
