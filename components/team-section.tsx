import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Instagram, Shield, Award, Target } from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    name: "Natan Hailu",
    role: "Penetration testing Specialist",
    specialties: ["Penetration Testing", "Cyber Incident Response", "Training"],
    achievements: ["HackTheBox Top 5%", "Certified Penetration testing Specialist ( CPTS )", "Content Creator"],
    description:
      "Senior penetration testing specialist with 6+ years of experience in Penetration testing, Cyber Incident Response and training.",
    image: "/dempp.jpg",
    linkedin: "https://www.linkedin.com/in/natan-hailu-68b926202",
    instagram: "https://www.instagram.com/h_nathan26",
    stats: { courses: 10, students: 800, rating: 4.9 },
  },  
  {
    name: "Mentesnot Wendimagegn",
    role: "Jr Penetration tester",
    specialties: ["Web Application Security", "Red Team Operations", "Training"],
    achievements: ["THM Jr. Penetest", "Bug Bounty Hunter"],
    description:
      "Experianced red teamer specializing in web application security and over 2 year Training Experiance.",
    image: "/mintepp.jpg",
    linkedin: "https://www.linkedin.com/in/mentesnot-wendimagegn-73a3a4299",
    stats: { courses: 8, students: 500, rating: 4.9 },
  },
  {
    name: "Nehimya Mesfin",
    role: "Penetration Tester",
    specialties: ["Web App Security", "System Security", "Red-Teaming"],
    achievements: ["Top 3% Global Leader – TryHackMe", "Mentor & Admin – INSA Cyber Talent Center", "Offensive Security Specialist – INSA", "CTF Developer – Adwa CTF"],
    description:
      "Penetration Tester with 2+ years of experience on Red-Teaming, exploiting vulnerabilities, reporting security issues and counter-measures",
    image: "/nehpp.jpg",
    linkedin: "https://www.linkedin.com/in/nehimyamesfin",
    stats: { courses: 1, students: 6, rating: 5.0 },
  },
  {
    name: "Abdurezak Hamid",
    role: "Red Team Lead",
    specialties: ["Active Directory", "Red Team Operations", "Security Research"],
    achievements: ["Certified Ethical Hacker (CEH)", "Certified Red Team Professional (CRTP)", "6+ Years Experience"],
    description:
      "Elite red team operator specializing in Active Directory exploitation and advanced adversarial tactics with extensive real-world experience.",
    image: "/inst3profile.png",
    linkedin: "https://www.linkedin.com/in/cyberabdu/",
    stats: { courses: 1, students: 50, rating: 4.9 },
  },
]

export function TeamSection() {
  return (
    <section id="team" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#02EF56]/30 mb-6">
            <Shield className="h-4 w-4 text-[#02EF56]" />
            <span className="text-white font-inter text-sm">World-Class Instructors</span>
          </div> */}

          <h2 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6">
            MEET THE <span className="neon-text">MENTORS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Learn from battle-tested cybersecurity professionals who have defended against real-world threats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="card-cyber hover-lift group overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-64 bg-gradient-to-br from-[#02EF56]/20 to-black/80 p-6">
              <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ 
                  backgroundImage: `url(${member.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="relative z-10 h-full flex items-end">
                  <div>
                    <h3 className="text-2xl font-cyber font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[#02EF56] font-inter font-semibold tracking-wide">{member.role}</p>
                  </div>
                </div>

                {/* Floating Achievement Badge */}
                <div className="absolute top-4 right-4 glass rounded-full p-3">
                  <Award className="h-6 w-6 text-[#02EF56]" />
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                {/* Description */}
                <p className="text-gray-300 font-inter leading-relaxed">{member.description}</p>

                {/* Specialties */}
                <div>
                  <h4 className="text-white font-cyber font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#02EF56]" />
                    SPECIALTIES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#02EF56]/10 border border-[#02EF56]/30 rounded-full text-[#02EF56] text-sm font-inter"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-white font-cyber font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#02EF56]" />
                    ACHIEVEMENTS
                  </h4>
                  <div className="space-y-2">
                    {member.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#02EF56] rounded-full neon-glow"></div>
                        <span className="text-gray-300 font-inter text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-cyber font-bold neon-text">{member.stats.courses}</div>
                    <div className="text-gray-400 text-xs font-inter uppercase tracking-wider">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-cyber font-bold neon-text">{member.stats.students}+</div>
                    <div className="text-gray-400 text-xs font-inter uppercase tracking-wider">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-cyber font-bold neon-text">{member.stats.rating}</div>
                    <div className="text-gray-400 text-xs font-inter uppercase tracking-wider">Rating</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 pt-4">
                  {member.linkedin && (
                    <Link
                     target="_blank"
                      href={member.linkedin}
                      className="p-3 glass rounded-full hover:bg-[#02EF56]/20 transition-all duration-300 group"
                    >
                      <Linkedin className="h-5 w-5 text-[#02EF56] group-hover:scale-110 transition-transform" />
                    </Link>
                  )}
                  {member.instagram && (
                    <Link
                      href={member.instagram}
                      className="p-3 glass rounded-full hover:bg-[#02EF56]/20 transition-all duration-300 group"
                    >
                      <Instagram className="h-5 w-5 text-[#02EF56] group-hover:scale-110 transition-transform" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Team CTA */}
        {/* <div className="text-center mt-20">
          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto border border-[#02EF56]/30">
            <h3 className="text-2xl font-cyber font-bold text-white mb-4">
              WANT TO <span className="neon-text">Tech WITH US?</span>
            </h3>
            <p className="text-gray-300 font-inter mb-6">
              We're always looking for cybersecurity professionals to join our instructor team.
            </p>
            <button className="btn-cyber font-cyber px-8 py-3">APPLY TO Tech</button>
          </div>
        </div> */}
      </div>
    </section>
  )
}
