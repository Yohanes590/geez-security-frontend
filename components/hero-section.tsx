import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, Lock, Eye } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center cyber-bg overflow-hidden">
      {/* Enhanced Background with Better Contrast */}
      <div className="absolute inset-0 cyber-grid opacity-40"></div>
      
      {/* Animated Particles */}
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="lg:mb-24 mb-16">
          {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark border-2 border-[#02EF56]/50 mb-12">
            <Lock className="h-4 w-4 text-[#02EF56]" />
            <span className="text-white font-inter text-sm font-medium">Cybersecurity Training</span>
          </div> */}
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-hero font-black mb-10 leading-tight">
          <span className="text-white drop-shadow-md">MASTER</span>
          <br />
          <span className="text-[#02EF56] drop-shadow-[0_0_3px_rgba(2,239,86,0.7)]">CYBERSECURITY</span>
          <br />
          <span className="text-white drop-shadow-md">WITH</span>
          <span className="text-[#02EF56] ml-4 drop-shadow-[0_0_3px_rgba(2,239,86,0.7)]">EXPERTS</span>
        </h1>

        <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto font-inter leading-relaxed bg-black/5 py-4 px-6 rounded-lg">
          Join the best  ranks of cybersecurity professionals. Learn from industry experts, master cutting-edge
          techniques, and defend the digital frontier.
        </p>

        <div className="flex flex-col max-sm:flex-col max-sm:justify-center max-sm:items-center sm:flex-row gap-6 justify-center mb-16">
          <Link href="#courses" passHref>
            <Button size="lg" className="btn-cyber px-12 py-6 text-lg font-cyber font-bold shadow-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              START TRAINING
            </Button>
          </Link>
          <Link href="#team" passHref>
            <Button
              size="lg"
              variant="outline"
              className="px-12 py-6   max-sm:px-16 text-lg font-cyber font-bold border-2 border-[#02EF56] text-white bg-black/70 hover:bg-[#02EF56] hover:text-black shadow-[0_0_15px_rgba(2,239,86,0.4)] flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              MEET EXPERTS
            </Button>
          </Link>
        </div>

        {/* Stats with Improved Contrast */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "915+", label: "Students Trained" },
            { number: "300+", label: "Certified Students" },
            { number: "13", label: "Course Rounds" },
            { number: "21+", label: "Global Students" },
          ].map((stat, index) => (
            <div key={index} className="glass-dark rounded-lg p-6 hover-lift border border-[#02EF56]/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="text-3xl font-cyber font-bold text-[#02EF56] drop-shadow-[0_0_8px_rgba(2,239,86,0.7)] mb-2">{stat.number}</div>
              <div className="text-white font-inter text-sm uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Icons with Better Visibility */}
      <div className="absolute top-20 left-10 animate-bounce">
        <Shield className="h-10 w-10 text-[#02EF56] opacity-50" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse">
        <Lock className="h-8 w-8 text-[#02EF56] opacity-60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: "1s" }}>
        <Zap className="h-12 w-12 text-[#02EF56] opacity-40" />
      </div>
    </section>
  )
}
