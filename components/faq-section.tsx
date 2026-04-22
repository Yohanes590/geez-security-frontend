import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircleIcon } from "lucide-react"

const faqs = [
  {
    id: "faq-1",
    question: "What courses do you offer?",
    answer: "We offer a wide range of courses in cyber security, covering topics such as network security, encryption, and ethical hacking.",
  },
  {
    id: "faq-2",
    question: "How long are your courses?",
    answer: "Our courses are 4 month or 120 days long",
  },
  {
    id: "faq-3",
    question: "What skills will I learn?",
    answer: "Our courses are designed to give you a comprehensive understanding of cyber security, including practical skills in Basic Programming, Fundamental of Cyber Security and Exploring Different Cyber Security Fields like Web Security, System Security, Network Security.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-32 cyber-bg relative">
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6">
            FREQUENTLY ASKED <span className="neon-text">QUESTIONS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
            Have questions? We've got answers. Check out our FAQs or contact us for more information.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-[#02EF56]/30 rounded-lg bg-black/50 backdrop-blur-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <HelpCircleIcon className="h-5 w-5 text-[#02EF56]" />
                    <span className="font-cyber text-white text-lg">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-gray-300 font-inter">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#02EF56]/30">
              <HelpCircleIcon className="h-4 w-4 text-[#02EF56]" />
              <span className="text-white font-inter text-sm">Still have questions? <a href="/contact" className="text-[#02EF56] hover:underline">Contact us</a></span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
} 