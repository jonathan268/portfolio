import { useEffect, useState } from "react";

const LINES = [
  "initialisation du noyau...",
  "chargement des modules...",
  "connexion à la base de données...",
  "compilation des assets...",
  "établissement du secure tunnel...",
  "injection des dépendances...",
  "prêt.",
];

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

function scramble(text, progress) {
  return text.split("").map((ch, i) => {
    if (i < Math.floor(progress * text.length)) return ch;
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }).join("");
}

function ScrambledLine({ text, delay, onDone }) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let step = 0;
    const max = 14;
    const iv = setInterval(() => {
      step++;
      const pct = step / max;
      if (step >= max) {
        clearInterval(iv);
        setDisplay(text);
        onDone?.();
        return;
      }
      setDisplay(scramble(text, pct));
    }, 45);
    return () => clearInterval(iv);
  }, [started, text]);

  if (!started) return <span>{""}</span>;
  return <span>{display || text}</span>;
}

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter");
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [barText, setBarText] = useState("");

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setVisibleLines(prev => prev < LINES.length ? prev + 1 : prev);
    }, 200);

    const progTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (Math.random() * 7 + 1.5);
        return next >= 100 ? 100 : next;
      });
    }, 160);

    setBarText("");

    const t1 = setTimeout(() => setPhase("exit"), 3200);
    const t2 = setTimeout(() => onFinish(), 4000);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const pct = Math.min(Math.round(progress), 100);
  const barLen = 22;
  const fillLen = Math.floor((pct / 100) * barLen);
  const bar = "█".repeat(fillLen) + "·".repeat(barLen - fillLen);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-space overflow-hidden"
      style={{
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.03)" : "scale(1)",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,180,216,0.3) 2px, rgba(0,180,216,0.3) 4px)",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 w-full max-w-sm mx-auto">
        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-400 to-brand-600 shadow-[0_0_30px_rgba(0,180,216,0.3)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#010214" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-[clamp(28px,6vw,52px)] text-white tracking-tight leading-none mb-10">
          {"Code avec".split("").map((ch, i) => (
            <span key={i} className="inline-block" style={{
              animation: `splash-char 0.5s ease ${0.1 + i * 0.04}s both`,
              opacity: 0,
            }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}{" "}
          <br className="sm:hidden" />
          <span className="gradient-text inline-block mt-1 sm:mt-0">
            {"Jonathan".split("").map((ch, i) => (
              <span key={i} className="inline-block" style={{
                animation: `splash-char 0.5s ease ${0.6 + i * 0.06}s both`,
                opacity: 0,
              }}>
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Terminal lines */}
        <div className="text-left font-mono text-[12px] leading-relaxed mb-6 min-h-[120px]">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <p key={i} className="text-brand-400/80 mb-1 truncate">
              <span className="text-brand-500/50 mr-2">$</span>
              {i < visibleLines - 1 ? (
                line
              ) : (
                <ScrambledLine text={line} delay={0} />
              )}
            </p>
          ))}
          {visibleLines < LINES.length && (
            <span className="inline-block w-2 h-4 bg-brand-400/70 ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Hacker progress bar */}
        <div className="w-full">
          <div className="flex items-center justify-between font-mono text-[11px] text-brand-400/60 mb-2">
            <span className="tracking-[2px] uppercase">Transfert</span>
            <span className="font-mono text-brand-400 font-medium">{pct}%</span>
          </div>
          <div className="relative h-6 bg-white/[0.03] rounded border border-brand-500/20 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full w-full rounded bg-gradient-to-r from-brand-700/80 via-brand-500 to-brand-400/80"
              style={{
                width: `${pct}%`,
                transition: "width 0.15s ease-out",
                boxShadow: "0 0 15px rgba(0,180,216,0.3), inset 0 0 20px rgba(0,180,216,0.1)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-white/30 tracking-[3px] pointer-events-none">
              [{bar}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
