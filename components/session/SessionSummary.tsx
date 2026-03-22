"use client";

import { formatDuration } from "@/lib/utils";
import type { SetData } from "@/lib/types/database.types";

interface ExerciseConfig {
  exerciseId: string; name: string; sets: number;
  reps: number | null; weightKg: number | null;
}

interface Props {
  workoutTitle: string;
  durationSeconds: number;
  totalSets: number;
  totalVolumeKg: number;
  pointsEarned: number;
  logs: { exerciseId: string; sets: SetData[] }[];
  exercises: ExerciseConfig[];
  onSave: () => void;
  saving: boolean;
}

export default function SessionSummary({ workoutTitle, durationSeconds, totalSets, totalVolumeKg, pointsEarned, logs, exercises, onSave, saving }: Props) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto z-50" style={{ background: "var(--bg-deep)" }}>
      <div className="max-w-lg mx-auto w-full px-5 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--accent)" }}>
            Séance terminée
          </p>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 7vw, 52px)", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            {workoutTitle}
          </h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Durée", value: formatDuration(durationSeconds) },
            { label: "Sets", value: String(totalSets) },
            { label: "Volume", value: `${totalVolumeKg.toFixed(0)} kg` },
            { label: "Points", value: `+${pointsEarned}` },
          ].map((s) => (
            <div key={s.label} className="p-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-bebas)", fontSize: "30px", color: s.label === "Points" ? "var(--accent)" : "var(--text-primary)", letterSpacing: "0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Exercise log */}
        <div>
          <h2 className="mb-3" style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "var(--text-primary)", letterSpacing: "0.03em" }}>
            Détail des exercices
          </h2>
          <div className="flex flex-col gap-2">
            {logs.filter((l) => l.sets.length > 0).map((l) => {
              const ex = exercises.find((e) => e.exerciseId === l.exerciseId);
              return (
                <div key={l.exerciseId} className="p-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <p className="mb-2" style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                    {ex?.name ?? "—"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {l.sets.map((s) => (
                      <span key={s.set} className="text-xs px-2 py-1" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)", background: "var(--bg-raised)", border: "1px solid var(--border)" }}>
                        {s.reps} reps {s.weight_kg ? `× ${s.weight_kg} kg` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save CTA */}
        <button onClick={onSave} disabled={saving} className="w-full py-4 text-base uppercase tracking-widest transition-opacity disabled:opacity-50" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.08em" }}>
          {saving ? "Sauvegarde…" : "Terminer et sauvegarder"}
        </button>
      </div>
    </div>
  );
}
