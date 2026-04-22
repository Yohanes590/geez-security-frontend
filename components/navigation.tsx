"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, Zap, ShieldCheck } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 will-change-transform backface-visibility-hidden ${
        scrolled ? "glass-dark" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image unoptimized src={"/transparentlogo.png"} alt="Geez Security" width={40} height={40} className="h-10 w-10  transition-all duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-cyber font-bold text-2xl text-white neon-text">GEEZ</span>
              <span className="font-cyber text-sm text-white font-semibold tracking-wider">SECURITY</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
              {/* <Zap className="absolute top-1 left-1 h-4 w-4 text-white animate-pulse" /> */}
            {["Home", "Courses", "Team"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : pathname === "/" ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
                className="relative text-white hover:text-[#02EF56] transition-all duration-300 font-inter font-medium group"
                onClick={(e) => {
                  if (pathname !== "/" && item !== "Home") {
                    e.preventDefault()
                    window.location.href = `/#${item.toLowerCase()}`
                  }
                }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#02EF56] transition-all duration-300 group-hover:w-full neon-glow"></span>
              </Link>
            ))}
            <Link
              href="/verify"
              className="relative text-white hover:text-[#02EF56] transition-all duration-300 font-inter font-medium group flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Certificate
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#02EF56] transition-all duration-300 group-hover:w-full neon-glow"></span>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#02EF56] hover:bg-transparent"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-dark rounded-lg mt-2 border border-[#02EF56]/20 backface-visibility-hidden">
            <div className="px-4 py-6 space-y-4">
              {["Home", "Courses", "Team"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : pathname === "/" ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
                  className="block px-4 py-2 text-white hover:text-[#02EF56] hover:bg-white/5 rounded-lg transition-all duration-300 font-inter"
                  onClick={(e) => {
                    setIsOpen(false)
                    if (pathname !== "/" && item !== "Home") {
                      e.preventDefault()
                      window.location.href = `/#${item.toLowerCase()}`
                    }
                  }}
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/verify"
                className="flex items-center gap-2 px-4 py-2 text-white hover:text-[#02EF56] hover:bg-white/5 rounded-lg transition-all duration-300 font-inter"
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Certificate
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
