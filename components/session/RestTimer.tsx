"use client";

import { useEffect, useState } from "react";

interface Props { seconds: number; onComplete: () => void; onSkip: () => void; }

export default function RestTimer({ seconds, onComplete, onSkip }: Props) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) { onComplete(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onComplete]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>
        — Repos —
      </p>

      {/* Circular countdown */}
      <div className="relative" style={{ width: 128, height: 128 }}>
        <svg width={128} height={128} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={64} cy={64} r={r} fill="none" stroke="var(--bg-raised)" strokeWidth={6} />
          <circle cx={64} cy={64} r={r} fill="none" stroke="var(--accent)" strokeWidth={6}
            strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="square"
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            {remaining}
          </span>
        </div>
      </div>

      <button onClick={onSkip} className="text-xs uppercase tracking-widest px-5 py-2 border transition-colors"
        style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, borderColor: "var(--border)", color: "var(--text-muted)", letterSpacing: "0.06em" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-faint)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
        Passer
      </button>
    </div>
  );
}
