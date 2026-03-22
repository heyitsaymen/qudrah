"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  fullName: z.string().min(2, "Nom trop court"),
  username: z
    .string()
    .min(3, "Pseudo trop court")
    .max(20, "Pseudo trop long")
    .regex(/^[a-z0-9_]+$/, "Lettres minuscules, chiffres et _ uniquement"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Erreur de validation");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username.toLowerCase(),
          full_name: form.fullName,
          role: "user",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  const inputStyle = {
    fontFamily: "var(--font-inter)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    background: "var(--bg-surface)",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow)",
    fontWeight: 600,
    color: "var(--text-muted)",
  };

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 text-5xl">📬</div>
        <h1
          className="mb-3"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", color: "var(--text-primary)", letterSpacing: "0.02em" }}
        >
          Vérifie ta boîte mail
        </h1>
        <p
          className="mb-6 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}
        >
          Un lien de confirmation a été envoyé à{" "}
          <span style={{ color: "var(--text-primary)" }}>{form.email}</span>.
          <br />
          Clique dessus pour activer ton compte.
        </p>
        <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
          Pas reçu ?{" "}
          <button
            onClick={() => setDone(false)}
            style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
          >
            Réessayer
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm py-12">
      <div className="flex items-center gap-2 mb-10">
        <Image src="/Logo.png" alt="Qudrah" width={28} height={28} className="object-contain" />
        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "var(--accent)", letterSpacing: "0.05em" }}>
          QUDRAH
        </span>
      </div>

      <h1 className="mb-1" style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
        Créer un compte
      </h1>
      <p className="mb-8 text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
        Déjà inscrit ?{" "}
        <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Se connecter
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-xs uppercase tracking-widest" style={labelStyle}>Nom complet</label>
          <input
            id="fullName" type="text" autoComplete="name"
            value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required
            className="px-4 py-3 text-sm w-full outline-none" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            placeholder="Aymen Benali"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-xs uppercase tracking-widest" style={labelStyle}>Pseudo</label>
          <input
            id="username" type="text" autoComplete="username"
            value={form.username} onChange={(e) => update("username", e.target.value.toLowerCase())} required
            className="px-4 py-3 text-sm w-full outline-none" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            placeholder="aymen_fit"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs uppercase tracking-widest" style={labelStyle}>Email</label>
          <input
            id="email" type="email" autoComplete="email"
            value={form.email} onChange={(e) => update("email", e.target.value)} required
            className="px-4 py-3 text-sm w-full outline-none" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            placeholder="ton@email.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-xs uppercase tracking-widest" style={labelStyle}>Mot de passe</label>
          <input
            id="password" type="password" autoComplete="new-password"
            value={form.password} onChange={(e) => update("password", e.target.value)} required
            className="px-4 py-3 text-sm w-full outline-none" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            placeholder="••••••••"
          />
          <p className="text-xs mt-1" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
            Minimum 6 caractères
          </p>
        </div>

        {error && (
          <p className="text-xs px-3 py-2" style={{ fontFamily: "var(--font-inter)", color: "var(--accent)", background: "rgba(200,16,46,0.08)", border: "1px solid rgba(200,16,46,0.2)" }}>
            {error}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="mt-2 py-3 text-sm uppercase tracking-widest transition-opacity disabled:opacity-50"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.08em", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-xs text-center mt-2" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
          En créant un compte, tu acceptes nos conditions d&apos;utilisation.
        </p>
      </form>
    </div>
  );
}
