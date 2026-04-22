'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CourseDetail } from "@/components/course-detail"
import { RegistrationForm } from "@/components/registration-form"
import { WaitlistModal } from "@/components/waitlist-modal"
import { useGetCourse } from '@/app/lib/hooks/use-courses';
import { getTheme } from '@/app/lib/course-themes';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CourseStatus } from '@/app/api-frontend/fetch-discount';
import { Loader2 } from 'lucide-react';
// Fallback data for when the API is not working or during development
export const fallbackCourses = {
  gtwss: {
    id: 2,
    slug: "gtwss",
    title: "GeezTech Web Security Specialist (GTWSS)",
    description: "An intermediate course on web security for developers and aspiring security professionals, covering everything from web fundamentals to advanced exploitation techniques.",
    price: 4999,
    duration: "3",
    level: "Intermediate",
    features: [
      "Live Website Pentest",
      "Bug Bounty Report Case Study",
      "24 Hour Hand-On Exam",
      "14 Lab Exercises",
      "In-depth API Security Testing",
      "WAF Bypass Techniques",
      "Access to Real Web Security Enthusiasts Community",
      "Professional Report Writing"
    ],
    curriculum: [
      "Introduction to Web Security , 2 lectures, 3:00 hours",
      "Web Development & Front End ,3 lectures, 05:40 hours",
      "Further on Front End , 4 lectures, 08:31 hours",
      "HTTP & Back-End , 4 lectures, 08:00 hours",
      "Web Reconnaissance ,7 lectures, 13:30 hours",
      "Web Proxy ,2 lectures, 03:45 hours",
      "Broken Authentication & Session Management , 4 lectures, 08:20 hours",
      "Injection Attacks ,6 lectures, 12:15 hours",
      "Database Attacks , 6 lectures, 11:35 hours",
      "Access Control & Business Logic Flaws ,4 lectures, 08:10 hours",
      "Client-Side & Advanced Exploitation ,5 lectures,  10:05 hours",
      "Further on API & WAF Bypass ,2 lectures, 04:13 hours",
      "Attacking Common Apps(Wordpress |Drupal|Joomla|Gitlab) ,2 lectures, 03:30 hours",
      "Bug Bounty Hunting & Reporting ,3 lectures, 07:40 hours",
      // "Module 15: Real-Word Web Exploitation & Crafting Methodologies"
    ],
    videoUrl: "https://www.youtube.com/embed/R9CsWEw2J24",

    instructor: "Natan Hailu & Team",
    instructors: [
      {
        name: "Natan Hailu",
        role: "Penetration testing Specialist",
        image: "/dempp.jpg",
        bio: "Senior penetration testing specialist with 6+ years of experience."
      },
      // {
      //   name: "Mentesnot Wendimagegn",
      //   role: "Jr Penetration tester",
      //   image: "/mintepp.jpg",
      //   bio: "Experienced red teamer specializing in web application security."
      // }
    ],
    prerequisites: [
      "Linux Fundamentals",
      "Basics of Programming (any language)",
      "Networking Concepts (TCP/IP, HTTP)",
      "Cyber Security Fundamentals",
      "GTST Certification is Recommended",
    ],
    targetAudience: [
      "Cyber Security Beginners",
      "Web Developers",
      "API Developers",
      "Aspiring Pentesters"
    ],
    startDate: "ሐምሌ 21",
    endDate: "ጥቅምት 15",
    days: "ሰኞ, እሮብ, አርብ",
    time: "8pm - 10pm",
    students: "60+",
    rating: "4.9/5"
  },
  gtst: {
    id: 1,
    slug: "gtst",
    title: "Geez Tech Security Tester (GTST)",
    description:
      "A foundational cybersecurity training program for complete beginners, covering  programming, networking, and advanced security concepts in both offensive and defensive cybersecurity.",
    price: 2999,
    duration: "4",
    level: "Beginner",
    features: [
      "Basic Programming & Networking",
      "Hands-on Penetration testing",
      "Log and Network Analysis",
      "Web, Network and Mobile Security Basics",
      "Report writing and documentation",
      "Industry-standard tools and methodologies",
    ],
    curriculum: [
      "Module 1: Introduction To Cyber Security",
      "Module 2: UNIX/Linux Systems",
      "Module 3: Python Programming Language",
      "Module 4: Bash Scripting Language",
      "Module 5: Networking Fundamentals",
      "Module 6: OSINT and Reconnaissance",
      "Module 7: Scanning & Enumeration",
      "Module 8: Malware Threats",
      "Module 9: Social Engineering Attacks",
      "Module 10: Cryptography",
      "Module 11: Network Security",
      "Module 12: Computer System Security",
      "Module 13: Website Security",
      "Module 14: Intro to Blue Teaming & Anonymity",
      "Module 15: Fundamental of Mobile & Wireless Security",
      "Module 16: Capture the Flag",
      "Module 17: Bug Bounty Hunting and Security Report Writing",
    ],
    videoUrl: "https://www.youtube.com/embed/b89UcpFDInM",
    instructor: "Natan Hailu, Mentesnot Wendimagegn, Nehimya Mesfin",
    instructors: [
      {
        name: "Natan Hailu",
        role: "Penetration Testing Specialist",
        bio: "Senior penetration testing specialist with 6+ years of experience in Penetration testing, Cyber Incident Response and training.",
        image: "/dempp.jpg"
      },
      {
        name: "Mentesnot Wendimagegn",
        role: "Jr Penetration Tester",
        bio: "Experienced red teamer specializing in web application security and over 2 year training experience.",
        image: "/mintepp.jpg"
      },
      {
        name: "Nehimya Mesfin",
        role: "Penetration Tester",
        bio: "Penetration Tester with 2+ years of experience in Red-Teaming, exploiting vulnerabilities, reporting security issues and counter-measures.",
        image: "/nehpp.jpg"
      }
    ],
    instructorBio:
      "Learn from a team of security experts with combined experience of 10+ years in offensive security, penetration testing, and cybersecurity training.",
    prerequisites: [
      "ምንም አይነት ፕሮግራሚንግ ወይም የቴክኖሎጂ ስራ BACKGROUND አያስፈልግም ፣ ግን መሰረታዊ የኮምፒዩተር አጠቃቀም ግድ ነው! (Example: using Browsers, Downloading and Installing Software, Creating Folders, Navigating through Folders…)",
      "በዚህ መስክ ላይ ጥሩ ለመሆን ፍላጎት ( Passion )",
      "ዕድሜ 12+",
      "ኮምፒውተር( Minimum requirement 4GB RAM | Laptop or Desktop )",
      "ኢንተርኔት(Wi-Fi or Mobile Data)",
      "የመማርያ እና ፕሮጀክቶችን የመስሪያ ጊዜ (በቀን 4 ሰዓት)",
    ],
    additionalInfo: "ትምህርቱ በሚከተለው መንገድ ይሰጣል\n\nበONLINE ቪድዮ CONFERENCE( Google Meet, Google Classroom )\nበተለያዩ ምክንያቶች Class ካመለጣቹ የClass ቅጂ ምታገኙበት መንገድ አለ\n13 ASSIGNMENT, 23 TASK, 3 Worksheets,50 Learning Class & 2 EXAM(QUIZ) አለው\nበቀን 2 ሰአት (2:00 – 4:00 ማታ)\nበሳምንት 3 ጊዜ (ሰኞ፣ዕሮብ፣አርብ)\nየ 4 ወራት(136 Days) ቆይታ",
    startDate: "የካቲት 23",
    endDate: "ሰኔ 23",
    days: "ሰኞ, እሮብ, አርብ",
    time: "2:00 - 4:00 ማታ",
    students: "1000+",
    rating: "4.9/5"
  },
  gtcrt: {
    id: 3,
    slug: "gtcrt",
    title: "Geez Tech Certified Red Teamer (GTCRT)",
    description: "An intermediate Red Teaming course for IT Admins and Security Researchers, covering everything from breaching the DMZ to compromising the entire enterprise network.",
    price: 6999,
    price_options: [
      {
        label: "Basic", amount: 4999,
        features: ['60 Day Lab Access(3 Hours/Days).', 'Lifetime Course Video Access', 'Lifetime Learning Module Access', 'Lifetime Learning Community Access', 'Private Access to Mentors']
      },
      {
        label: "Silver", amount: 5999,
        features: ['90 Day Lab Access(3 Hours/Days).', 'Lifetime Course Video Access', 'Lifetime Learning Module Access', 'Lifetime Learning Community Access', 'Private Access to Mentors']
      },
      {
        label: "Gold", amount: 6999,
        features: ['120 Day Lab Access(3 Hours/Days).', 'Lifetime Course Video Access', 'Lifetime Learning Module Access', 'Lifetime Learning Community Access', 'Private Access to Mentors']
      },

    ],

    duration: "5",
    level: "Intermediate",
    features: [
      "Enterprise Security",
      "Red Team Operation",
      "OpSec and Evasion",
      "Pivoting and Tunneling",
      "Abusing MSSQL Services",
      "Professional Red Team Report Writing",
      "48 Hours Hand-On Exam with Professional Report",
      "All Theory with Hand-On AWS Lab"
    ],
    curriculum: [
      " Intro to Red Teaming & Red Team Mindset , 2 lectures, 4:00 hours",
      " Protocols and Their Abuses ,  1 lectures , 2:00 hours",
      " Active Directory Basics for Red Teamers , 6 lectures, 11:20 hours",
      " Initial Access , 2 lectures, 03:20 hours",
      " Linux Privilege Escalation , 2 lectures, 04:16 hours",
      " Pivoting and Tunneling , 4 lectures, 08:16 hours",
      " Domain Enumeration , 7 lectures, 14:00 hours ",
      " Windows Local Privilege Escalation , 3 lectures, 05:34 hours",
      " Credential Access , 5 lectures, 10:00 hours",
      " Lateral Movement , 3 lectures, 06:00 hours",
      " Domain PrivEsc techniques , 3 lectures, 06:05 hours",
      " Local Persistence , 1 lectures, 02:05 hours ",
      " Domain Persistence and Dominance ,3 lectures, 06:25 hours",
      " OPSEC & Detection Evasion ,2 lectures, 04:00 hours",
      " Abusing MSSQL , 2 lectures, 04:00 hours",
      " Professional Red Team Reporting , 1 lectures,  01:30 hours"
    ],
    videoUrl: "https://www.youtube.com/embed/W-ZMyN_CZU0",
    instructor: "Abdurezak Hamid",
    instructors: [
      {
        name: "Abdurezak Hamid",
        role: "Red Team Lead",
        image: "/inst3profile.png",
        bio: "Experienced Security Researcher and Red Team Operator with 6+ years in offensive security. Certified Ethical Hacker (CEH) and Certified Red Teamer (CRTP)."
      }
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
    startDate: "ሚያዚያ 19",
    endDate: "ነሐሴ 19",
    days: "ሰኞ, እሮብ, አርብ",
    time: "8pm - 10pm",
    students: "50+",
    rating: "4.9/5",
    // additionalInfo: "Duration – 14 weeks\nStart Date – November 24\nEnd Date – January 24\nDays – ሰኞ, እሮብ, አርብ\nTime – 8pm - 10pm\nLevel – Intermediate\nStudents – 0\nRating – 5"
  }
};

export default function CoursePage() {


  const params = useParams();
  const courseId = params.courseId as string;
  const theme = getTheme(courseId);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { toast } = useToast();
  const [RegistrationInfo, setRegistrationInfo] = useState<any>([]);
  const [loadingCourseStatus, setLoadingCourseStatus] = useState(true);
  useEffect(() => {
    const CloseFetchFunction = async () => {
      try {
        const FetchStatus = await CourseStatus();
        setRegistrationInfo(FetchStatus);
        console.log(FetchStatus)
        setLoadingCourseStatus(false)
      } catch (error) {
        toast({ title: "Error", description: "Internal Server Error!" })
      }


    }
    CloseFetchFunction();
  }, [])

  const closedCourseIds = RegistrationInfo;
  const isRegistrationClosed = closedCourseIds.includes(courseId);

  // Fetch course data from API
  const { data: apiCourse, isLoading, isError } = useGetCourse(courseId);

  // Fallback to hardcoded data if API fails or during development
  const fallbackCourse = fallbackCourses[courseId as keyof typeof fallbackCourses];

  // If API fails and no fallback data is available, show error
  if (isError && !fallbackCourse) {
    return (
      <main className="min-h-screen cyber-bg relative pt-20">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="glass-dark rounded-2xl p-8 text-center text-white">
            <h1 className="text-3xl font-cyber mb-4">Course Not Found</h1>
            <p className="text-gray-300">Sorry, the requested course could not be found.</p>
          </div>
        </div>
      </main>
    );
  }

  // fallback first way
  const course = fallbackCourse || fallbackCourse;

  // if (isLoading) {
  //   return (
  //     <main className="min-h-screen cyber-bg relative pt-20">
  //       <div className="absolute inset-0 cyber-grid opacity-30"></div>
  //       <div className="relative container mx-auto px-4 py-12">
  //         <div className="glass-dark rounded-2xl p-8 text-white">
  //           <div className="flex flex-col gap-4">
  //             <Skeleton className="h-8 w-64 bg-gray-700" />
  //             <Skeleton className="h-4 w-full bg-gray-700" />
  //             <Skeleton className="h-4 w-full bg-gray-700" />
  //             <Skeleton className="h-4 w-3/4 bg-gray-700" />
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen cyber-bg relative">
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      <div className="relative">
        <CourseDetail course={course} theme={theme} />
        {
          loadingCourseStatus ? (<>
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto mb-[50px] mt-8 p-6 bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-xl shadow-2xl text-center">
              <Loader2 className="h-12 w-12 text-geez-green animate-spin" />
              <p className="mt-4 text-green-400">Registration Loading...</p>
            </div>
          </>) : (<>
            {isRegistrationClosed ? (
              <div className="max-w-2xl mx-auto mb-[50px] mt-8 p-6 bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-xl shadow-2xl text-center">
                <div className="text-green-400 text-5xl mb-4">⏳</div>
                <h3 className="text-2xl font-bold text-green-400 mb-3">Registration Closed</h3>
                <p className="text-gray-300 mb-6">
                  Registration for the {course.title} course is currently closed.
                </p>

                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 mb-6">
                  <div className="space-y-3">
                    <p className="text-yellow-400 font-medium">Next Registration Opens In:</p>
                    <div className="flex justify-center gap-6 mt-2">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">2</div>
                        <div className="text-sm text-gray-400">Months</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-4">
                      Secure your spot for the next batch by joining our waitlist now!
                    </p>
                    <Button
                      onClick={() => setIsWaitlistOpen(true)}
                      className="mt-4 bg-[#02EF56] hover:bg-[#02EF56]/80 text-black font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Join Waitlist
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-4">
                    We'll notify you as soon as registration opens. Follow us for updates:
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href="https://t.me/geeztechgroup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#02EF56] transition-colors"
                      aria-label="Telegram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.35-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/geezsecurity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#02EF56] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.youtube.com/@geeztech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#02EF56] transition-colors"
                      aria-label="YouTube"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/geezsecurity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#02EF56] transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <RegistrationForm
                courseId={courseId}
                courseTitle={course.title}
                coursePrice={course.price}
                theme={{
                  icon: "text-[#02EF56]",
                  neon: "neon-text-blue",
                  primary: '#02EF56', // Original green color
                  text: 'text-white',
                  button: 'btn-cyber',
                  badge: 'bg-[#02EF56]/20 text-[#02EF56] border-[#02EF56]/30',
                  bulletBg: 'bg-green-600',
                  bulletGlow: 'glow-cyber',
                  border: 'border-[#02EF56]/30',
                  name: "gtst"
                }}
              />
            )}
          </>)
        }

      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        courseTitle={course.title}
        onSuccess={(message) => {
          toast({
            title: message.includes('already') ? 'Already on Waitlist' : 'Success!',
            description: message,
            variant: 'default',
            duration: 3000,
          });
        }}
      />
    </main>
  )
}
