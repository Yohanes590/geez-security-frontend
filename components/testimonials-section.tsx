import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuoteIcon } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Natnael Brhane Tesfay",
    role: "Alumni",
    content:
      "Loved this course. The instructor made complex topics easy to grasp and tnx for everything.",
    avatar: "/avatars/dagmawi.png",
  },
  {
    id: 2,
    name: "Anteneh gulema",
    role: "Alumni",
    content:
      "The course give me tha basics of coding becouse before that i didn't know anything and in generally it gives me the path for becoming best in cyber security (hacker)",
    avatar: "/avatars/anteneh.png",
  },
  {
    id: 3,
    name: "Neamn Assefa",
    role: "Alumni",
    content:
      "This course was amazing! The content was well-structured, and the instructor explained complex concepts in a simple and engaging way. There hands-on projects really helped solidify my understanding. Highly recommend it!",
    avatar: "/avatars/tsion.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 relative ">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6">
            WHAT OUR <span className="neon-text">CLIENTS SAY</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Hear what our clients have to say about their experience with Geez Security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-cyber hover-lift group">
              <CardContent className="p-6 space-y-6">
                <QuoteIcon className="h-10 w-10 text-[#02EF56] opacity-70" />
                <p className="text-gray-300 font-inter leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                  <Avatar className="border-2 border-[#02EF56]/30">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-[#02EF56]/20 text-[#02EF56]">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-cyber font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400 font-inter">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 