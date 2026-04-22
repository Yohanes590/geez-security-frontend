'use client'

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users, Star, Shield, Zap, Target, Brain, Calendar, Info } from "lucide-react"
import { Dot } from "lucide-react"
// import { useGetAllCourses } from "@/app/lib/hooks/use-courses"
import { useEffect, useState } from "react"

// Fallback courses data
const fallbackCourses = [
  {
    id: "gtst",
    title: "Geez Tech Security Tester",
    subtitle: "GTST CERTIFICATION",
    description:
      "A foundational cybersecurity training program for complete beginners, covering basic programming, networking, and advanced security concepts in both offensive and defensive cybersecurity.",
    duration: "4 months",
    students: "1000+",
    rating: 4.9,
    price: 2999,
    level: "Beginner",
    icon: Shield,
    gradient: "from-red-500 to-red-700",
    features: [
      "Basic Programming",
      "Networking",
      "Cyber Security Fundamentals",
      "Penetration Testing",
      "Blue Teaming Fundamentals",
      "Report Writing",
    ],
  },
  {
    id: "gtwss",
    title: "GeezTech Web Security Specialist",
    subtitle: "INTERMEDIATE WEB SECURITY",
    description: "An intermediate course on web security for developers and aspiring security professionals, covering everything from web fundamentals to advanced exploitation techniques.",
    duration: "3 Months",
    students: "60+",
    rating: 4.9,
    price: 4999,
    level: "Intermediate",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    features: [
      "Monthly Live Website Pentest",
      "Bug Bounty Report Case Study",
      "Access to Real Web Security Enthusiasts Community",
      "In-depth API Security Testing",
      "WAF Bypass Techniques",
      "Professional Report Writing"
    ],
    curriculum: [
      "Module 1: Introduction to Web Security",
      "Module 2: Web Development & Front End",
      "Module 3: Further on Front End",
      "Module 4: HTTP & Back-End",
      "Module 5: Web Reconnaissance",
      "Module 6: Web Proxy",
      "Module 7: Broken Authentication & Session Management",
      "Module 8: Injection Attacks",
      "Module 9: Database Attacks",
      "Module 10: Access Control & Business Logic Flaws",
      "Module 11: Client-Side & Advanced Exploitation",
      "Module 12: Further on API & WAF Bypass",
      "Module 13: Attacking Common Apps(Wordpress, Drupal, Joomla, Gitlab, Tomcat)",
      "Module 14: Bug Bounty Hunting & Reporting",
      "Module 15: Real-Word Web Exploitation & Crafting Methodologies"
    ],
    prerequisites: [
      "Linux Fundamentals",
      "Basics of Programming (any language)",
      "Networking Concepts (TCP/IP, HTTP)",
      "Cyber Security Fundamentals",
      "GTST Certification is Recommended"
    ],
    targetAudience: [
      "Cyber Security Beginners",
      "Web Developers",
      "API Developers",
      "Aspiring Pentesters"
    ],
    instructor: "Natan Hailu & Team",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "gtcrt",
    title: "Geez Tech Certified Red Teamer",
    subtitle: "INTERMEDIATE RED TEAMING",
    description: "An intermediate Red Teaming course for IT Admins and Security Researchers, covering everything from breaching the DMZ to compromising the entire enterprise network.",
    duration: "5 Months",
    students: "50+",
    rating: 4.9,
    price: 6999,
    level: "Intermediate",
    icon: Target,
    gradient: "from-red-500 to-red-700",
    features: [
      "Enterprise Security",
      "Red Team Operation",
      "OpSec and Evasion",
      "Pivoting and Tunneling",
      "Abusing MSSQL Services",
      "Red Team Report Writing"
    ],
    curriculum: [
      "Module 1: Intro to Red Teaming & Red Team Mindset",
      "Module 2: Protocols and Their Abuses",
      "Module 3: Active Directory Basics for Red Teamers",
      "Module 4: Initial Access",
      "Module 5: Linux Local Privilege Escalation",
      "Module 6: Pivoting and Tunneling",
      "Module 7: Domain Enumeration",
      "Module 8: Windows Local Privilege Escalation",
      "Module 9: Credential Access",
      "Module 10: Lateral Movement",
      "Module 11: Domain PrivEsc techniques",
      "Module 12: Local Persistence",
      "Module 13: Domain Persistence and Dominance",
      "Module 14: OPSEC & Detection Evasion",
      "Module 15: Abusing MSSQL",
      "Module 16: Professional Red Team Reporting"
    ],
    prerequisites: [
      "Basic understanding of Website attacks (GTWSS Recommended but not required)",
      "Good Understanding of Networking",
      "Good Understanding of Linux (GTST Recommended)",
      "Cyber Security Fundamentals (GTST Recommended)"
    ],
    targetAudience: [
      "IT Admins",
      "Cyber Security Students",
      "Blue Teamers",
      "Security Researchers",
      "Red Team Beginners"
    ],
    instructor: "Abdurezak Hamid",
    videoUrl: "https://www.youtube.com/embed/W-ZMyN_CZU0",
  },
]

// Map for course icons
const courseIcons: Record<string, any> = {
  'gtst': Shield,
  'gtwss': Zap,
  'gtcrt': Target,
  'default': Target
}

// Helper function to get course color
const getCourseColor = (courseId: string) => {
  switch (courseId) {
    case 'gtwss': return 'amber';
    case 'gtcrt': return 'red';
    case 'gtst':
    default: return 'green';
  }
}

export function CoursesSection() {
  // Fetch courses from API
  // const { data, isLoading, isError } = useGetAllCourses()

  // Transform API data into the format needed for display
  const [displayCourses, setDisplayCourses] = useState(fallbackCourses)

  // useEffect(() => {
  //   if (data && Array.isArray(data) && data.length > 0) {
  //     // Transform API data to match our UI needs
  //     const transformedCourses = data.map(course => ({
  //       id: course.slug,
  //       title: course.title,
  //       subtitle: course.title.split(' ').map((word: string) => word[0]).join(''),
  //       description: course.description || "Learn more about this cybersecurity course.",
  //       duration: "4 months",
  //       students: 815,
  //       rating: 4.9,
  //       price: course.price,
  //       level: course.price > 1500 ? "Intermediate" : "Beginner",
  //       icon: courseIcons[course.slug] || courseIcons.default,
  //       gradient: course.slug === 'gtst' ? "from-red-500 to-red-700" : "from-amber-500 to-orange-600",
  //       features: ["Security Fundamentals", "Hands-on Labs", "Professional Tools", "Industry Techniques"],
  //     }))

  //     setDisplayCourses(transformedCourses)
  //   }
  // }, [data])

  return (
    <section id="courses" className="py-32 mt- cyber-bg relative">
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      <div className="relative max-w-[1700px] mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#02EF56]/30 mb-6">
            <Shield className="h-4 w-4 text-[#02EF56]" />
            <span className="text-white font-inter text-sm">Flexible Training Programs</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6">
            OUR <span className="neon-text">COURSES</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Choose from our comprehensive range of cybersecurity courses designed by industry experts and battle-tested
            professionals.
          </p>
        </div>

        {false ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="card-cyber overflow-hidden">
                <div className="h-48 bg-gray-700">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-4 w-full bg-gray-700" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => {
              const IconComponent = course.icon
              return (
                <Card
                  key={course.id}
                  className={`card-cyber hover-lift group overflow-hidden ${course.id === 'gtwss' ? 'card-gtwss' :
                    course.id === 'gtcrt' ? 'card-gtcrt' : ''
                    }`}
                >
                  {/* Header with image only */}
                  <div
                    className={`relative h-48 ${course.id === 'gtst'
                      ? 'overflow-hidden bg-black'
                      : `bg-gradient-to-br ${course.gradient}`
                      }`}
                  >
                    {course.id === 'gtst' ? (
                      <Image
                        src="/images/gtst_thumbnail.png"
                        alt="GTST Course Background"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : course.id === 'gtwss' ? (
                      <Image
                        src="/images/gtwss_banner.png"
                        alt="GTWSS Course Background"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      />
                    ) : course.id === 'gtcrt' ? (
                      <Image
                        src="/images/GTCRT_Thumb.png"
                        alt="GTCRT Course Background"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/20"></div>
                    )}
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-8 w-8 ${course.id === 'gtwss' ? 'text-amber-400' :
                          course.id === 'gtcrt' ? 'text-red-400' :
                            'text-[#02EF56]'
                          }`} />
                        <Badge
                          variant="secondary"
                          className={`${course.level === "Intermediate"
                            ? course.id === 'gtcrt'
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            : "bg-[#02EF56]/20 text-[#02EF56] border-[#02EF56]/30"
                            }`}
                        >
                          {course.level}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-cyber font-black ${course.id === 'gtwss' ? 'text-amber-400' :
                          course.id === 'gtcrt' ? 'text-red-400' :
                            'text-[#02EF56]'
                          } mb-1`}>{course.price}</div>
                        <div className="text-gray-400 text-sm">Birr</div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-cyber font-bold text-white mb-1">{course.title}</h3>
                    <p className={`${course.id === 'gtwss' ? 'text-amber-400/90' :
                      course.id === 'gtcrt' ? 'text-red-400/90' :
                        'text-[#02EF56]/80'
                      } font-inter text-sm tracking-wider mb-3`}>{course.subtitle}</p>

                    <CardDescription className="text-gray-300 font-inter leading-relaxed">
                      {course.description}
                    </CardDescription>


                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Course Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 ${course.id === 'gtwss' ? 'bg-amber-400 neon-glow-orange' :
                            course.id === 'gtcrt' ? 'bg-red-400 neon-glow-red' :
                              'bg-[#02EF56] neon-glow'
                            } rounded-full`}></div>
                          <span className="text-gray-300 font-inter">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400 py-4 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        {
                          (() => {
                            const color =
                              course.id === "gtwss"
                                ? "text-amber-400"
                                : course.id === "gtcrt"
                                  ? "text-red-400"
                                  : "text-[#02EF56]";

                            return course.id === "gtst" ? (
                              <Clock className={`h-4 w-4 ${color}`} />
                            ) : <Dot className={`h-7 w-7 ${color}`} />;
                          })()
                        }

                        <span className="font-inter">{course.id == 'gtst' ? course.duration : ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className={`h-4 w-4 ${course.id === 'gtwss' ? 'text-amber-400' :
                          course.id === 'gtcrt' ? 'text-red-400' :
                            'text-[#02EF56]'
                          }`} />
                        <span className="font-inter">{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className={`h-4 w-4 ${course.id === 'gtwss' ? 'text-amber-400' :
                          course.id === 'gtcrt' ? 'text-red-400' :
                            'text-[#02EF56]'
                          } fill-current`} />
                        <span className="font-inter">{course.rating}</span>
                      </div>
                    </div>

                    {course.id === "web" ? (
                      <Button
                        className="w-full font-cyber btn-cyber"
                        onClick={() => {
                          alert("This course is coming soon!");
                        }}
                      >
                        LEARN MORE
                      </Button>
                    ) : (
                      <Button asChild className={`w-full ${course.id === 'gtwss' ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black border-none font-bold' :
                        course.id === 'gtcrt' ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white border-none font-bold' :
                          'btn-cyber'
                        }`}>
                        <Link href={`/course/${course.id}`}>ENROLL NOW</Link>
                      </Button>
                    )}

                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Call to Action */}
        {/* <div className="text-center mt-20">
          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto border border-[#02EF56]/30">
            <h3 className="text-2xl font-cyber font-bold text-white mb-4">
              CAN'T DECIDE? <span className="neon-text">GET GUIDANCE</span>
            </h3>
            <p className="text-gray-300 font-inter mb-6">
              Schedule a free consultation with our experts to find the perfect course for your career goals.
            </p>
            <Button className="btn-cyber font-cyber">BOOK CONSULTATION</Button>
          </div>
        </div> */}
      </div>
    </section>
  )
}
