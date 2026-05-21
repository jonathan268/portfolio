import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("exit"), 2200);
    const t2 = setTimeout(() => onFinish(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-space overflow-hidden"
      style={{
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.05)" : "scale(1)",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-400 to-brand-600 shadow-[0_0_30px_rgba(0,180,216,0.3)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#010214" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        <h1 className="font-display font-black text-[clamp(28px,6vw,52px)] text-white tracking-tight leading-none mb-4">
          {"Code avec".split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: `splash-char 0.5s ease ${0.1 + i * 0.04}s both`,
                opacity: 0,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}{" "}
          <br className="sm:hidden" />
          <span className="gradient-text inline-block mt-1 sm:mt-0">
            {"Jonathan".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: `splash-char 0.5s ease ${0.6 + i * 0.06}s both`,
                  opacity: 0,
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p
          className="font-mono text-[13px] text-white/40 tracking-[3px] uppercase"
          style={{
            animation: "splash-fade 0.8s ease 1.8s both",
            opacity: 0,
          }}
        >
          Fullstack Developer
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/5"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 rounded-full"
          style={{
            animation: "splash-bar 2.4s ease-in-out both",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
}
