import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-10 pb-8 overflow-hidden border-t border-white/5 bg-deep-space">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-violet to-transparent opacity-50" />
      <div className="container-md flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 px-[6vw]">
        
        <div className="flex items-center gap-2">
           <Terminal size={16} className="text-neon-cyan" />
           <span className="font-display font-medium text-[15px] text-white">
             Jonathan<span className="text-neon-cyan">.</span>
           </span>
        </div>

        <span className="font-mono text-[13px] text-white/40 tracking-wider">
          © 2026. ALL RIGHTS RESERVED.
        </span>

        <div className="font-sans text-[13px] text-white/40 flex items-center gap-1.5">
          Crafted with <span className="text-neon-pink drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">♥</span> for the web.
        </div>
      </div>
    </footer>
  );
}
