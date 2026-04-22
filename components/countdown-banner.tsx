"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set the end date (December 15, 2025 12:00 AM)


  const endDate = new Date('December 15, 2025 00:00:00').getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endDate - now;
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="w-full flex justify-center py-6 bg-black">
      <div className="relative w-full max-w-3xl rounded-xl neon-glow-orange bg-gradient-to-r from-amber-500/80 to-orange-600/80 border-2 border-orange-500/40 shadow-lg px-6 py-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <Clock className="h-6 w-6 text-white animate-pulse" />
          <span className="text-lg md:text-xl font-cyber text-white tracking-wide uppercase">Registration ends in:</span>
        </div>
        <div className="flex gap-2 md:gap-4 text-white font-mono text-lg md:text-2xl">
          <div className="flex flex-col items-center">
            <span className="bg-orange-500/20 border border-orange-500/40 rounded px-2 py-1 min-w-[3.5rem] text-center text-orange-300 text-xl md:text-2xl font-bold shadow-md">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="text-xs text-white  mt-1">days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-orange-500/20 border border-orange-500/40 rounded px-2 py-1 min-w-[3.5rem] text-center text-orange-300 text-xl md:text-2xl font-bold shadow-md">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-xs text-white  mt-1">hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-orange-500/20 border border-orange-500/40 rounded px-2 py-1 min-w-[3.5rem] text-center text-orange-300 text-xl md:text-2xl font-bold shadow-md">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-xs text-white  mt-1">min</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-orange-500/20 border border-orange-500/40 rounded px-2 py-1 min-w-[3.5rem] text-center text-orange-300 text-xl md:text-2xl font-bold shadow-md">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-xs text-white  mt-1">sec</span>
          </div>
        </div>
      </div>
    </div>
  )
}
