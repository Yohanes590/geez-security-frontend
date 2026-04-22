import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[#02EF56]/30 bg-black/50 px-3 py-2 text-white text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#02EF56] focus-visible:ring-1 focus-visible:ring-[#02EF56] disabled:cursor-not-allowed disabled:opacity-50 font-inter",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
