import { useEffect, useState } from "react";
import { useSession } from "../services/session";
import { playBootSound } from "../services/audio";
import { motion } from "motion/react";

export function Boot() {
  const [progress, setProgress] = useState(0);
  const completeBoot = useSession((s) => s.completeBoot);

  useEffect(() => {
    playBootSound();
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Fast simulate loading
      current += Math.random() * 30 + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => completeBoot(), 150);
      }
      setProgress(Math.min(current, 100));
    }, 30);

    return () => clearInterval(interval);
  }, [completeBoot]);

  useEffect(() => {
    const skip = () => completeBoot();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [completeBoot]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-12"
      >
        {/* Glowing Logo */}
        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-white/20 to-white/5 border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] backdrop-blur-xl flex items-center justify-center">
          <span className="text-white text-5xl font-semibold tracking-tighter ml-1 font-sans">
            D
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-full w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
