export const courseThemes: { [key: string]: any } = {
  gtst: {
    icon: "text-[#02EF56]",
    neon: "neon-text-blue",
    primary: '#02EF56', // Original green color
    text: 'text-white',
    button: 'btn-cyber',
    badge: 'bg-[#02EF56]/20 text-[#02EF56] border-[#02EF56]/30',
    bulletBg: 'bg-green-600',
    bulletGlow: 'glow-cyber',
    border: 'border-[#02EF56]/30',
    name:"gtst"
  },
  
  gtwss: {
    text: "text-orange-400",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: "text-orange-400",
    button: "btn-cyber-orange",
    bulletGlow: "shadow-[0_0_8px_rgba(249,115,22,0.8)]",
    bulletBg: "bg-orange-400",
    neon: "neon-text-orange",
    primary: '#FF6B00', // Original orange color
    
    name:"gtwss"
  },
  gtcrt: {
    text: "text-red-400",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: "text-red-400",
    button: "btn-cyber-red",
    bulletGlow: "shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    bulletBg: "bg-red-400",
    neon: "neon-text-red",
    primary: '#DC2626', // Red color for red team
    name:"gtcrt"
  },
  'web-pentest': {
    text: "text-green-400",
    border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: "text-green-400",
    button: "btn-cyber-green",
    bulletGlow: "shadow-[0_0_8px_rgba(74,222,128,0.8)]",
    bulletBg: "bg-green-400",
    neon: "neon-text-green",
  },
  default: {
    text: "text-teal-400",
    border: "border-teal-500/30",
    badge: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    icon: "text-teal-400",
    button: "btn-cyber",
    bulletGlow: "shadow-[0_0_8px_rgba(45,212,191,0.8)]",
    bulletBg: "bg-teal-400",
    neon: "neon-text",
  },
};

export const getTheme = (courseId: string) => {
  return courseThemes[courseId] || courseThemes.default;
};
