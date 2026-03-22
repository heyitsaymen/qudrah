"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  fullName: z.string().min(2, "Nom trop court"),
  username: z
    .string()
    .min(3, "Pseudo trop court")
    .max(20, "Pseudo trop long")
    .regex(/^[a-z0-9_]+$/, "Uniquement lettres minuscules, chiffres et _"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  role: z.enum(["user", "coach"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "user" as "user" | "coach",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          role: form.role,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputStyle = {
    fontFamily: "var(--font-inter)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    background: "var(--bg-surface)",
  };

  const labelStyle = {
    fontFamily: "var(--font-barlow)",
    fontWeight: 600,
    color: "var(--text-muted)",
  };

  return (
    <div className="w-full max-w-sm py-12">
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
        Créer un compte
      </h1>
      <p
        className="mb-8 text-sm"
        style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}
      >
        Déjà inscrit ?{" "}
        <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Se connecter
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Role selector */}
        <div className="flex flex-col gap-1">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={labelStyle}
          >
            Je suis
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["user", "coach"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update("role", r)}
                className="py-3 text-sm uppercase tracking-widest transition-all"
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  background:
                    form.role === r ? "var(--accent)" : "var(--bg-surface)",
                  color:
                    form.role === r ? "#fff" : "var(--text-muted)",
                  border:
                    form.role === r
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                }}
              >
                {r === "user" ? "Athlète" : "Coach"}
              </button>
            ))}
          </div>
        </div>

        {/* Full name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="fullName"
            className="text-xs uppercase tracking-widest"
            style={labelStyle}
          >
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
            className="px-4 py-3 text-sm w-full outline-none"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--text-faint)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            placeholder="Aymen Benali"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-xs uppercase tracking-widest"
            style={labelStyle}
          >
            Pseudo
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={(e) => update("username", e.target.value.toLowerCase())}
            required
            className="px-4 py-3 text-sm w-full outline-none"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--text-faint)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            placeholder="aymen_fit"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-widest"
            style={labelStyle}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="px-4 py-3 text-sm w-full outline-none"
            style={inputStyle}
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
            style={labelStyle}
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            className="px-4 py-3 text-sm w-full outline-none"
            style={inputStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--text-faint)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            placeholder="••••••••"
          />
          <p
            className="text-xs mt-1"
            style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}
          >
            Minimum 6 caractères
          </p>
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
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p
          className="text-xs text-center mt-2"
          style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}
        >
          En créant un compte, tu acceptes nos conditions d&apos;utilisation.
        </p>
      </form>
    </div>
  );
}
