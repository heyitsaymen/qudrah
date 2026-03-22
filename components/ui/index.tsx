// Shared UI primitives for Qudrah
import React from "react";
import { cn } from "@/lib/utils";

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 uppercase tracking-widest transition-opacity disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)]",
    ghost:   "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
    danger:  "bg-[var(--accent-dim)] text-white hover:bg-[var(--accent)]",
    outline: "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-faint)] hover:text-[var(--text-primary)]",
  };
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      style={{ fontFamily: "var(--font-barlow)", fontWeight: 600 }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn("px-4 py-2.5 text-sm w-full outline-none transition-colors", className)}
        style={{ fontFamily: "var(--font-inter)", color: "var(--text-primary)", border: "1px solid var(--border)", background: "var(--bg-surface)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        {...props}
      />
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps { label: string; variant?: "default" | "accent" | "faint" }
export function Badge({ label, variant = "default" }: BadgeProps) {
  const colors = {
    default: { background: "var(--bg-raised)", color: "var(--text-muted)", border: "1px solid var(--border)" },
    accent:  { background: "rgba(200,16,46,0.12)", color: "var(--accent)", border: "1px solid rgba(200,16,46,0.25)" },
    faint:   { background: "transparent", color: "var(--text-faint)", border: "1px solid var(--bg-raised)" },
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, ...colors[variant] }}>
      {label}
    </span>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; accent?: boolean }
export function Card({ children, className, accent }: CardProps) {
  return (
    <div
      className={cn("relative p-5 border", className)}
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {accent && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--accent)" }} />}
      {children}
    </div>
  );
}

// ─── PageHeader ──────────────────────────────────────────────────────────────
export function PageHeader({ label, title, action }: { label?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {label && <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--accent)" }}>{label}</p>}
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", letterSpacing: "0.02em" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border" style={{ borderColor: "var(--border)", borderStyle: "dashed", background: "var(--bg-surface)" }}>
      <p style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-muted)", letterSpacing: "0.03em" }}>{title}</p>
      {desc && <p className="text-sm mt-1 mb-5" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>{desc}</p>}
      {action}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse", className)} style={{ background: "var(--bg-raised)" }} />;
}
