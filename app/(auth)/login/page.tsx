"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = schema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <Image src="/Logo.png" alt="Qudrah" width={28} height={28} className="object-contain" />
        <span
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "24px",
            color: "var(--accent)",
            letterSpacing: "0.05em",
          }}
        >
          QUDRAH
        </span>
      </div>

      <h1
        className="mb-1"
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "40px",
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
        }}
      >
        Connexion
      </h1>
      <p
        className="mb-8 text-sm"
        style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}
      >
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          Créer un compte
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 text-sm bg-transparent w-full outline-none transition-colors"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--text-faint)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            placeholder="ton@email.com"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-xs uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 text-sm w-full outline-none transition-colors"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--text-faint)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            placeholder="••••••••"
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-xs px-3 py-2"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--accent)",
              background: "rgba(200,16,46,0.08)",
              border: "1px solid rgba(200,16,46,0.2)",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 text-sm uppercase tracking-widest transition-opacity disabled:opacity-50"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            background: "var(--accent)",
            color: "#fff",
            letterSpacing: "0.08em",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
