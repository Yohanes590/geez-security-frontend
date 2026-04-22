import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, ArrowRight, Lock } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-32 cyber-bg overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#02EF56]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-[#02EF56]/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#02EF56]/10 rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA Content */}
          <div className="glass-dark rounded-3xl p-12 border border-[#02EF56]/30 max-w-4xl mx-auto">
            <div className="mb-8">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#02EF56]/30 mb-6">
                <Lock className="h-4 w-4 text-[#02EF56]" />
                <span className="text-white font-inter text-sm">Limited Time Offer</span>
              </div> */}

              <h2 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6 leading-tight">
                START YOUR
                <br />
                <span className="neon-text">CYBER JOURNEY</span>
                <br />
                TODAY
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
                Join thousands of professionals who have transformed their careers with our cybersecurity training
                programs.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="btn-cyber px-12 py-4 text-lg font-cyber group">
                <Link href="#courses" className="flex items-center gap-3">
                  <Shield className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  ENROLL NOW
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-12 py-4 text-lg font-cyber border-[#02EF56] text-[#02EF56] hover:bg-[#02EF56] hover:text-black neon-border group"
              >
                <Zap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                FREE CONSULTATION
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-700">
              {[
                { icon: Shield, label: "Industry Certified", value: "100%" },
                { icon: Zap, label: "Job Placement", value: "95%" },
                { icon: Lock, label: "Hands-on Labs", value: "24/7" },
                { icon: ArrowRight, label: "Career Growth", value: "300%" },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass border border-[#02EF56]/30 mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-[#02EF56]" />
                    </div>
                    <div className="text-2xl font-cyber font-bold neon-text mb-1">{item.value}</div>
                    <div className="text-gray-400 font-inter text-sm">{item.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Secondary CTA */}
          {/* <div className="mt-16 text-center">
            <p className="text-gray-400 font-inter mb-4">Questions? Need help choosing the right course?</p>
            <Link
              href="#contact"
              className="text-[#02EF56] hover:text-white transition-colors font-inter font-semibold underline decoration-[#02EF56] underline-offset-4"
            >
              Contact our cybersecurity advisors →
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  )
}
