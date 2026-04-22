'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Clock, Star, CheckCircle, User, BookOpen, Zap, Info, Award, Linkedin, Instagram, Dot } from "lucide-react"
import Image from "next/image"
import { fallbackCourses } from "@/app/course/[courseId]/page"


interface CourseDetailProps {
  course: any;
  theme: any;
}

const gtcrtWhatsIncluded = [
  "Cloud-based lab with Windows Server 2022 (VPN access)",
  "Pre-installed tools for hands-on practice",
  "Lifetime access to all course materials",
  "1 exam attempt for GTCRT certification",
  "Support via email & Telegram",
]

const gtcrtExamStructure: { title: string; body: string }[] = [
  {
    title: "48-Hour Practical Assessment",
    body: "24 hours of hands-on access to the enterprise lab, followed by 24 hours to prepare and submit a professional red team report.",
  },
  {
    title: "Real-World Enterprise Simulation",
    body: "Students are provided access to an internet-facing web server and a fully patched Windows environment designed to reflect real organizational infrastructure, configurations, and privilege models.",
  },
  {
    title: "Realistic Attack Scenarios",
    body: "The exam focuses on real-world techniques, requiring students to perform in-depth enumeration and build logical attack paths. Success depends on understanding how Windows domains and web applications operate in practice, not on using pre-built exploits.",
  },
  {
    title: "Professional Reporting",
    body: "Students must submit a detailed report documenting their methodology, findings, and practical mitigation strategies.",
  },
]

const gtcrtCertificateBenefits = [
  "Demonstrates a strong understanding of Active Directory security in real-world environments",
  "Ability to effectively enumerate systems and identify high-value targets",
  "Skilled in executing a wide range of attack techniques, including local and domain privilege escalation",
  "Capable of establishing persistence and performing antivirus evasion with a focus on operational stealth",
  "Prepared to operate with a practical, real-world red team mindset",
]

function CourseInfoCard({ course }: { course: any }) {
  console.log(course)
  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="font-cyber text-white">Course Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 font-inter">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Duration</span>
          <span className="text-gray-200 text-right">
            {course.slug == "gtcrt" ? "93 hours" : course.slug == "gtwss" ? "108 hours" : (course.duration * 4 + " Weeks")}
          </span>
        </div>
        {/* <div className="flex justify-between gap-4">
          <span className="text-gray-400">Start Date</span>
          <span className="text-gray-200 text-right">{course.startDate || "TBA"}</span>
        </div> */}
        {/* <div className="flex justify-between gap-4">
          <span className="text-gray-400">End Date</span>
          <span className="text-gray-200 text-right">{course.endDate || "TBA"}</span>
        </div> */}
        {/* <div className="flex justify-between gap-4">
          <span className="text-gray-400">Days</span>
          <span className="text-gray-200 text-right">{course.days || "TBA"}</span>
        </div> */}
        {/* <div className="flex justify-between gap-4">
          <span className="text-gray-400">Time</span>
          <span className="text-gray-200 text-right">{course.time || "TBA"}</span>
        </div> */}
        <div className="flex justify-between gap-4 items-center">
          <span className="text-gray-400">Level</span>
          <Badge
            className={`${course.slug === "gtcrt"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : course.level === "Intermediate"
                ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                : "bg-[#02EF56]/20 text-[#02EF56] border-[#02EF56]/30"
              }`}
          >
            {course.level}
          </Badge>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Students</span>
          <span className="text-gray-200">{course.students || "0"}</span>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <span className="text-gray-400">Rating</span>
          <div className="flex items-center gap-1">
            <Star
              fill={
                course.slug === "gtcrt" ? "#ef4444" : course.level === "Intermediate" ? "#f97316" : "#02EF56"
              }
              className={`h-4 w-4 ${course.slug === "gtcrt"
                ? "text-red-400 border-red-500/30"
                : course.level === "Intermediate"
                  ? "text-orange-400 border-orange-500/30"
                  : "text-[#02EF56] border-[#02EF56]/30"
                } fill-current`}
            />
            <span className="text-gray-200">{course.rating || "5/5"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseDetail({ course, theme }: CourseDetailProps) {
  // Default arrays if they don't exist in the API response
  const features = course.features || [];
  const curriculum = course.curriculum || [];
  const prerequisites = course.prerequisites || [];
  const targetAudience = course.targetAudience || [];

  return (
    <section className="py-12  md:mt-12 mt-8">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="glass-dark rounded-2xl border border-[#02EF56]/30 text-white p-8 mb-8">
          <div className="flex justify-center items-center">
            <div>
              <Badge className={theme.badge}>{course.level}</Badge>
              <h1 className="text-3xl md:text-4xl font-cyber font-bold my-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6 font-inter">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm font-inter">
                {/* <div className="flex items-center gap-2"><Clock className={`h-4 w-4 ${theme.icon}`} /><span>{course.duration} Months</span></div> */}
                <div className="flex items-center gap-2"><User className={`h-4 w-4 ${theme.icon}`} /><span>{course.instructor}</span></div>
                <div className="flex items-center gap-2"><Star className={`h-4 w-4 ${theme.icon} fill-current`} /><span>5.0/5 Rating</span></div>
              </div>
            </div>

            {/* <div className="card-cyber p-6 text-center">
              <div className={`text-4xl font-cyber font-bold ${theme.text} ${theme.neon} mb-2`}>{Math.round(course.price / 2)} Birr</div>
              <p className="text-gray-300 font-inter">per season ({course.duration / 2} Months)</p>

              <div className="mt-4 text-gray-300">
                <p className={`text-2xl font-cyber font-bold ${theme.text} ${theme.neon}`}>{course.price} Birr</p>
                <p className="font-inter">One-time payment ({course.duration} Months)</p>
              </div>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Video */}
            {course.videoUrl && (
              <Card className="card-cyber">
                <CardHeader><CardTitle className="font-cyber text-white">Course Preview</CardTitle></CardHeader>
                <CardContent>
                  <div className={`aspect-video bg-black/50 rounded-lg overflow-hidden border ${theme.border}`}>
                    <iframe src={`${course.videoUrl}?autoplay=1&mute=1`} title="Course Preview" className="w-full h-full" allow="autoplay; fullscreen" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Features */}
            {features.length > 0 && (
              <Card className="card-cyber">
                <CardHeader><CardTitle className="font-cyber text-white flex items-center gap-2"><Zap className={`h-5 w-5 ${theme.icon}`} />What You'll Learn</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2`}></div>
                        <span className="text-gray-300 font-inter">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {course.slug === "gtcrt" && (
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="font-cyber text-white">Lab Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`rounded-lg overflow-hidden border ${theme.border} bg-black/50`}>
                    <Image
                      src="/lab_structure.png"
                      alt="Lab structure diagram for the GTCRT hands-on environment"
                      width={1600}
                      height={900}
                      className="w-full h-auto object-contain"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <Card className="card-cyber">
                <CardHeader><CardTitle className="flex items-center gap-2 font-cyber text-white"><BookOpen className={`h-5 w-5 ${theme.icon}`} />Course Curriculum</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {curriculum.map((topic: string, index: number) => (
                      <div key={index} className={`flex items-center gap-3 p-3 bg-black/40 border ${theme.border} rounded-lg`}>
                        <div className={`${theme.bulletBg} text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold`}>{index + 1}</div>
                        <div className="text-gray-300 font-inter w-full flex items-center justify-between">
                          <div className="course-name">
                            {topic.split(',')[0]}
                          </div>
                          <div className="course-duration text-[14px] flex items-center gap-1 text-gray-400">
                            {topic.split(',')[1]}
                            <Dot />
                            {topic.split(',')[2]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructors */}
            {course.instructors ? (
              // Use instructors from course data
              course.instructors.map((instructor: { name: string; role: string; bio: string; image: string; }, index: number) => (
                <div key={index} className={`flex items-start gap-4 ${index > 0 ? "pt-4 border-t border-gray-700" : ""}`}>
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border ${theme.border}`}>
                    <Image src={instructor.image} alt={instructor.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-cyber text-white">{instructor.name}</h3>
                    <p className={`${theme.text} text-xs mb-1`}>{instructor.role}</p>
                    <p className="text-gray-300 text-sm font-inter">{instructor.bio}</p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to single instructor
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#02EF56]/30 to-[#02EF56]/10 border border-[#02EF56]/30 rounded-full mx-auto mb-4"></div>
                <h3 className="font-cyber text-lg text-white mb-2">{course.instructor}</h3>
                <p className="text-gray-300 text-sm font-inter">{course.instructorBio}</p>
              </div>
            )}

            {/* Target Audience */}
            {targetAudience.length > 0 && (
              <Card className="card-cyber">
                <CardHeader><CardTitle className="font-cyber text-white">Who Is This For?</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {targetAudience.map((audience: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2`}></div>
                        <span className="text-sm text-gray-300 font-inter">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            {course.additionalInfo && (
              <Card className="card-cyber">
                <CardHeader><CardTitle className="font-cyber text-white">Additional Info</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 font-inter whitespace-pre-wrap">{course.additionalInfo}</p>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="font-cyber text-white">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prerequisites.map((prereq: string, index: number) => {
                      // Check if prerequisite mentions GTST or GTWSS
                      if (prereq.includes("GTST")) {
                        const parts = prereq.split("GTST");
                        return (
                          <li key={index} className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2`}></div>
                            <span className="text-sm text-gray-300 font-inter">
                              {parts[0]}
                              <Link href="/course/gtst" className="text-[#02EF56] hover:underline font-semibold">
                                GTST
                              </Link>
                              {parts[1]}
                            </span>
                          </li>
                        );
                      } else if (prereq.includes("GTWSS")) {
                        const parts = prereq.split("GTWSS");
                        return (
                          <li key={index} className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2`}></div>
                            <span className="text-sm text-gray-300 font-inter">
                              {parts[0]}
                              <Link href="/course/gtwss" className="text-orange-400 hover:underline font-semibold">
                                GTWSS
                              </Link>
                              {parts[1]}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={index} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2`}></div>
                          <span className="text-sm text-gray-300 font-inter">{prereq}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Info + GTCRT extras — stacked vertically like the original sidebar */}
            {course.slug === "gtcrt" ? (
              <div className="space-y-6">
                <CourseInfoCard course={course} />
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="font-cyber text-white">What&apos;s Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {gtcrtWhatsIncluded.map((line, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2 shrink-0`} />
                          <span className="text-sm text-gray-300 font-inter">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="font-cyber text-white">Exam Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gtcrtExamStructure.map((section, index) => (
                      <div key={index}>
                        <h4 className="text-sm font-semibold text-gray-200 font-inter mb-1">{section.title}</h4>
                        <p className="text-sm text-gray-400 font-inter leading-relaxed">{section.body}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="font-cyber text-white">Certificate Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {gtcrtCertificateBenefits.map((line, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 ${theme.bulletBg} rounded-full ${theme.bulletGlow} mt-2 shrink-0`} />
                          <span className="text-sm text-gray-300 font-inter">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <CourseInfoCard course={course} />
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        {course.additionalInfo && (
          <div className="glass-dark rounded-2xl border border-[#02EF56]/30 text-white p-8 mb-8">
            <h2 className="text-2xl font-cyber font-bold mb-6 flex items-center gap-2">
              <Info className="h-6 w-6 text-[#02EF56]" />
              Additional Information
            </h2>
            <ul className="font-inter text-gray-300 list-disc pl-6" style={{ listStyleType: 'disc' }}>
              {course.additionalInfo.split('\n').map((line: string, idx: number) => (
                line.trim() && <li key={idx} style={{ color: 'inherit', listStyleType: 'disc', WebkitTextStroke: '0px', position: 'relative' }} className="custom-green-bullet">{line.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Team Section */}

      </div>
    </section>
  )
}
