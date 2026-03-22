"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="uppercase tracking-widest text-xs mb-4"
      style={{
        fontFamily: "var(--font-barlow)",
        fontWeight: 600,
        color: "var(--accent)",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div
      className="w-full"
      style={{ borderTop: "1px solid var(--border)" }}
    />
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,16,46,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Label */}
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Beta — Disponible maintenant</SectionLabel>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-6 leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(56px, 10vw, 100px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            L&apos;organisation sportive,{" "}
            <span style={{ color: "var(--accent)" }}>enfin pensée</span>{" "}
            pour vous.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "17px",
              color: "var(--text-muted)",
              lineHeight: "1.7",
            }}
          >
            Créez vos séances, planifiez vos semaines, suivez vos progrès —
            sans PDF, sans captures d&apos;écran, sans friction.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors group"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#fff",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--accent-dim)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--accent)")
              }
            >
              Commencer gratuitement
              <ArrowRight size={14} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-6 py-3 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--text-faint)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-muted)";
              }}
            >
              <Play size={13} />
              Voir comment ça marche
            </a>
          </motion.div>
        </motion.div>

        {/* App mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          <AppMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── App mockup (session player preview) ─── */
function AppMockup() {
  return (
    <div
      className="relative max-w-3xl border overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
      >
        <span
          className="text-sm"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "18px",
            color: "var(--text-primary)",
            letterSpacing: "0.05em",
          }}
        >
          PUSH DAY A
        </span>
        <div className="flex items-center gap-4">
          <span
            className="text-sm"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "18px",
              color: "var(--accent)",
              letterSpacing: "0.05em",
            }}
          >
            24:37
          </span>
          <div
            className="w-5 h-5 flex items-center justify-center border text-xs cursor-pointer"
            style={{
              borderColor: "var(--text-faint)",
              color: "var(--text-muted)",
            }}
          >
            ×
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1"
        style={{ background: "var(--bg-raised)" }}
      >
        <div
          className="h-full"
          style={{ width: "42%", background: "var(--accent)" }}
        />
      </div>

      {/* Exercise info */}
      <div className="px-6 py-6">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            color: "var(--text-faint)",
          }}
        >
          Exercice 3 / 7
        </p>
        <h2
          className="mb-1"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "36px",
            color: "var(--text-primary)",
            letterSpacing: "0.03em",
          }}
        >
          DÉVELOPPÉ COUCHÉ
        </h2>
        <p
          className="text-xs uppercase mb-6"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          Pectoraux · Barre
        </p>

        {/* Sets */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2, 3, 4].map((set, i) => (
            <div key={set} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 flex items-center justify-center text-xs"
                style={{
                  background:
                    i < 2
                      ? "var(--accent)"
                      : i === 2
                      ? "var(--bg-raised)"
                      : "var(--bg-deep)",
                  border:
                    i === 2
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  color: i < 2 ? "#fff" : i === 2 ? "var(--accent)" : "var(--text-faint)",
                  fontFamily: "var(--font-bebas)",
                  fontSize: "16px",
                }}
              >
                {i < 2 ? "✓" : set}
              </div>
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "var(--text-faint)",
                }}
              >
                {i < 2 ? "10×80" : i === 2 ? "EN COURS" : "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Input row */}
        <div
          className="flex items-center gap-4 p-4 border mb-4"
          style={{
            background: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex-1">
            <p
              className="text-xs mb-1"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Reps
            </p>
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "28px",
                color: "var(--text-primary)",
              }}
            >
              10
            </p>
          </div>
          <div
            className="w-px h-10 self-center"
            style={{ background: "var(--border)" }}
          />
          <div className="flex-1">
            <p
              className="text-xs mb-1"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Poids
            </p>
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "28px",
                color: "var(--text-primary)",
              }}
            >
              80 kg
            </p>
          </div>
          <button
            className="px-5 py-2 text-sm ml-auto"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              background: "var(--accent)",
              color: "#fff",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Set terminé →
          </button>
        </div>

        {/* Next exercise hint */}
        <p
          className="text-xs"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--text-faint)",
          }}
        >
          Prochain :{" "}
          <span style={{ color: "var(--text-muted)" }}>
            Squat barre — 4×8 — 100 kg
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─── CHAOS SECTION ─── */
function ChaosSection() {
  return (
    <section
      style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--border)" }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Le problème</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-16"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px, 6vw, 72px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            Fini le chaos.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                icon: "❌",
                label: "PDF envoyés sur WhatsApp",
                desc: "Des fichiers illisibles sur mobile, perdus dans les conversations.",
              },
              {
                icon: "❌",
                label: "Captures d'écran de programmes",
                desc: "Floues, recadrées, impossibles à annoter ou suivre.",
              },
              {
                icon: "❌",
                label: "Photos de tableaux illisibles",
                desc: "Excel bricolé, perdu dans la galerie, jamais mis à jour.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 2}
                className="p-8 border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-surface)",
                }}
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "var(--text-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {item.label}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: "var(--text-muted)",
                    lineHeight: "1.6",
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FEATURES SECTION ─── */
function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "Workout Builder",
      desc: "Créez vos programmes avec drag & drop. Exercices, sets, reps, poids, temps de repos — tout est configurable en quelques secondes.",
    },
    {
      icon: Play,
      title: "Session Player",
      desc: "Lancez votre séance en plein écran. Chrono automatique, compte à rebours de repos, log de chaque set en temps réel.",
    },
    {
      icon: Calendar,
      title: "Planification hebdo",
      desc: "Visualisez et planifiez votre semaine. Glissez vos workouts sur les jours, suivez ce qui est fait ou à faire.",
    },
    {
      icon: BarChart3,
      title: "Suivi des progrès",
      desc: "Volume par session, historique de charges, streak de régularité. Les données qui comptent, sans le superflu.",
    },
    {
      icon: Users,
      title: "Espace coachs",
      desc: "Publiez vos programmes, suivez vos clients, partagez vos séances directement dans l'app. Professionnel.",
    },
    {
      icon: Zap,
      title: "Gamification",
      desc: "Streaks, badges, points — des mécaniques concrètes qui rendent la régularité mesurable et motivante.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24"
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Fonctionnalités</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-16"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5vw, 60px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            Tout ce dont vous avez besoin,{" "}
            <span style={{ color: "var(--text-muted)" }}>rien de superflu.</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.5 + 2}
                className="p-8 border-b border-r"
                style={{
                  borderColor: "var(--border)",
                  background:
                    i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-deep)",
                }}
              >
                <f.icon
                  size={20}
                  className="mb-4"
                  style={{ color: "var(--accent)" }}
                />
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "var(--text-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: "var(--text-muted)",
                    lineHeight: "1.7",
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── APP PREVIEW SECTION ─── */
function AppPreviewSection() {
  return (
    <section
      className="py-24"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Interface</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5vw, 60px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            Une séance, une interface.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mb-16 max-w-xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              color: "var(--text-muted)",
              lineHeight: "1.7",
            }}
          >
            Lancez votre session, suivez chaque set, chaque rep, chaque seconde
            de repos. Sans perdre le fil.
          </motion.p>

          <motion.div variants={fadeUp} custom={3}>
            <AppMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── COACHES SECTION ─── */
function CoachesSection() {
  return (
    <section
      id="coaches"
      className="py-24"
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Pour les coachs</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mb-6"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "var(--text-primary)",
                letterSpacing: "0.02em",
              }}
            >
              Conçu pour les coachs qui travaillent sérieusement.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mb-8"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                color: "var(--text-muted)",
                lineHeight: "1.7",
              }}
            >
              Publiez vos programmes, suivez vos clients, partagez vos séances
              directement dans l&apos;app. Votre travail mérite mieux qu&apos;un PDF.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="space-y-4">
              {[
                "Créez et publiez des programmes en quelques minutes",
                "Vos clients accèdent à vos workouts directement dans l'app",
                "Suivez la progression de chaque athlète",
                "Profil coach distinct, identifié, professionnel",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "var(--accent)" }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm"
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "#fff",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Créer mon espace coach
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <CoachVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CoachVisual() {
  const workouts = [
    { title: "Push Day A", exercises: 6, format: "Routine", shared: 12 },
    { title: "Pull Day B", exercises: 5, format: "Routine", shared: 9 },
    { title: "Full Body Challenge", exercises: 8, format: "Challenge", shared: 24 },
  ];
  return (
    <div className="space-y-3">
      {workouts.map((w, i) => (
        <div
          key={i}
          className="p-5 border flex items-center justify-between"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <h4
              className="mb-1"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "20px",
                color: "var(--text-primary)",
                letterSpacing: "0.03em",
              }}
            >
              {w.title}
            </h4>
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {w.exercises} exercices · {w.format}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-xs mb-1"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--text-faint)",
              }}
            >
              Sauvegardé par
            </p>
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "var(--accent)",
              }}
            >
              {w.shared}
            </p>
          </div>
        </div>
      ))}
      <div
        className="p-4 border text-center"
        style={{
          borderColor: "var(--accent)",
          borderStyle: "dashed",
          background: "rgba(200,16,46,0.03)",
        }}
      >
        <p
          className="text-xs"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          + Nouveau programme
        </p>
      </div>
    </div>
  );
}

/* ─── GAMIFICATION SECTION ─── */
function GamificationSection() {
  const badges = [
    { icon: "🏁", name: "Premier Pas", desc: "1 séance", earned: true },
    { icon: "🔥", name: "Semaine de Feu", desc: "7 jours de streak", earned: true },
    { icon: "💪", name: "Régulier", desc: "30 séances", earned: false },
    { icon: "⚡", name: "Centurion", desc: "100 séances", earned: false },
    { icon: "🏋️", name: "Tonnage", desc: "10 000 kg", earned: false },
  ];

  return (
    <section
      className="py-24"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Gamification</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5vw, 60px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            La régularité se construit, pas se souhaite.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mb-12 max-w-xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              color: "var(--text-muted)",
              lineHeight: "1.7",
            }}
          >
            Chaque séance complétée alimente votre streak. Les badges
            débloquent des jalons concrets. Les points traduisent votre
            régularité en chiffres mesurables.
          </motion.p>

          {/* Streak counter */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex items-center gap-4 mb-12 p-6 border inline-flex"
            style={{
              background: "var(--bg-raised)",
              borderColor: "var(--border)",
            }}
          >
            <Target size={24} style={{ color: "var(--accent)" }} />
            <div>
              <p
                className="text-xs uppercase"
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                Streak actuel
              </p>
              <p
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "36px",
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                🔥 14 jours
              </p>
            </div>
          </motion.div>

          {/* Badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.5 + 4}
                className="p-5 border text-center"
                style={{
                  background: b.earned ? "var(--bg-raised)" : "var(--bg-deep)",
                  borderColor: b.earned ? "var(--border)" : "var(--bg-raised)",
                  opacity: b.earned ? 1 : 0.4,
                }}
              >
                <span className="text-3xl block mb-2">{b.icon}</span>
                <p
                  className="text-xs font-semibold mb-1"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontWeight: 600,
                    color: b.earned ? "var(--text-primary)" : "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {b.name}
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: "var(--text-faint)",
                  }}
                >
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA FINAL ─── */
function FinalCTA() {
  return (
    <section
      className="py-32 text-center"
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="mb-4"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(48px, 8vw, 80px)",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            Rejoignez Qudrah.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mb-10"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              color: "var(--text-muted)",
            }}
          >
            Gratuit pour commencer. Disponible maintenant.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#fff",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Commencer gratuitement
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PAGE ─── */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Divider />
      <ChaosSection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <AppPreviewSection />
      <Divider />
      <CoachesSection />
      <Divider />
      <GamificationSection />
      <Divider />
      <FinalCTA />
    </>
  );
}
