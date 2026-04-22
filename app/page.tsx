import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { TeamSection } from "@/components/team-section"
import { CoursesSection } from "@/components/courses-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FaqSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { CountdownBanner } from "@/components/countdown-banner"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div>Loading...</div>}>
        <CoursesSection />
      </Suspense>
      {/* <CountdownBanner /> */}
      <TestimonialsSection />
      <TeamSection />
      <FaqSection />
      <CTASection />
    </main>
  )
}
