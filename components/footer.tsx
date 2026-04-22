"use client"

import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Github, Zap, Send, Youtube, Instagram } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="relative cyber-bg border-t border-[#02EF56]/20">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <Image src={"/transparentlogo.png"} alt="Geez Security" width={50} height={50} className="h-11 w-11  transition-all duration-300 group-hover:scale-110" />
            </div>
              <div className="flex flex-col">
                <span className="font-cyber font-bold text-3xl text-white neon-text">GEEZ</span>
                <span className="font-cyber text-sm text-[#02EF56] -mt-1 tracking-wider">SECURITY</span>
              </div>
            </div>

            <p className="text-gray-300 font-inter leading-relaxed mb-6 max-w-md">
              Cybersecurity training by battle-tested professionals. Master the skills needed to defend the
              digital frontier and advance your career.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Send, href: "https://t.me/geeztechgroup", label: "Telegram" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/geezsecurity", label: "LinkedIn" },
                { icon: Youtube, href: "https://www.youtube.com/@geeztech", label: "YouTube" },
                { icon: Instagram, href: "https://www.instagram.com/geezsecurity", label: "Instagram" }
              ].map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    key={social.label}
                    href={social.href}
                    className="p-3 glass rounded-full hover:bg-[#02EF56]/20 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5 text-[#02EF56] group-hover:scale-110 transition-transform" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <h3 className="font-cyber font-semibold text-white mb-6 text-lg">TRAINING PROGRAMS</h3>
            <ul className="space-y-3">
              {[
                { name: "GTST Certification", href: "/course/gtst", coming: false },
                { name: "Web Penetration Testing", href: "/course/gtwss", coming: false },
                { name: "Red Team Operations", href: "/course/gtcrt", coming: false },
                { name: "Incident Response", href: "#", coming: true },
              ].map((course) => (
                <li key={course.name}>
                  {course.coming ? (
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`${course.name} course is coming soon!`);
                      }}
                      className="text-gray-400 hover:text-[#02EF56] transition-colors font-inter group flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-1 h-1 bg-[#02EF56] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {course.name}
                    </a>
                  ) : (
                    <Link
                      href={course.href}
                      className="text-gray-400 hover:text-[#02EF56] transition-colors font-inter group flex items-center gap-2"
                    >
                      <div className="w-1 h-1 bg-[#02EF56] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {course.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-cyber font-semibold text-white mb-6 text-lg">CONTACT INFO</h3>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: "support@geezsecurity.com", href: "mailto:support@geezsecurity.com" },
                { icon: Phone, text: "0953537820", href: "tel:+251953537820" },
                { icon: MapPin, text: "Addis Ababa, Ethiopia", href: "#" },
                { icon: Send ,text: "@geezsecsupport", href: "https://t.me/geezsecsupport" },
              ].map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <li key={index}>
                    <Link
                      href={contact.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-[#02EF56] transition-colors font-inter group"
                    >
                      <IconComponent className="h-4 w-4 text-[#02EF56] group-hover:scale-110 transition-transform" />
                      {contact.text}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="font-cyber font-semibold text-white mb-4">QUICK LINKS</h4>
              <ul className="space-y-2">
                {[
                  { name: "About Us", href: "#about" },
                  { name: "Privacy Policy", href: "#privacy" },
                  { name: "Terms of Service", href: "#terms" },
                  { name: "Support", href: "#support" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#02EF56] transition-colors font-inter text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 font-inter text-sm">
              © 2026 Geez Security. All rights reserved. | Cybersecurity Training
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#02EF56] rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-inter">System Status: Online</span>
              </div>
              <div className="text-gray-600">|</div>
              <div className="text-[#02EF56] font-cyber font-semibold">SECURE • ELITE • PROFESSIONAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
