"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { muscleGroupLabel, calcPoints, calcNewStreak } from "@/lib/utils";
import type { SetData } from "@/lib/types/database.types";
import RestTimer from "./RestTimer";
import SessionSummary from "./SessionSummary";

interface ExerciseConfig {
  weId: string;
  exerciseId: string;
  name: string;
  muscleGroup: string | null;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  weightKg: number | null;
  restSeconds: number;
}

interface Props {
  workoutId: string;
  workoutTitle: string;
  exercises: ExerciseConfig[];
  userId: string;
}

type Phase = "active" | "resting" | "done";

export default function SessionPlayer({ workoutId, workoutTitle, exercises, userId }: Props) {
  const router = useRouter();

  // State
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("active");
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<{ exerciseId: string; sets: SetData[] }[]>(
    exercises.map((e) => ({ exerciseId: e.exerciseId, sets: [] }))
  );
  const [currentReps, setCurrentReps] = useState<number>(exercises[0]?.reps ?? 10);
  const [currentWeight, setCurrentWeight] = useState<number>(exercises[0]?.weightKg ?? 0);
  const [sessionDone, setSessionDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const startedAt = useRef(new Date().toISOString());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEx = exercises[exIdx];
  const nextEx = exercises[exIdx + 1] ?? null;

  // Global timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Sync inputs when exercise changes
  useEffect(() => {
    setCurrentReps(currentEx?.reps ?? 10);
    setCurrentWeight(currentEx?.weightKg ?? 0);
  }, [exIdx, currentEx]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const completedSetsForCurrentEx = logs[exIdx]?.sets.length ?? 0;

  function completeSet() {
    const set: SetData = {
      set: setIdx + 1,
      reps: currentReps,
      weight_kg: currentWeight,
      done: true,
    };

    setLogs((prev) => prev.map((l, i) =>
      i === exIdx ? { ...l, sets: [...l.sets, set] } : l
    ));

    const isLastSet = setIdx + 1 >= currentEx.sets;
    const isLastEx = exIdx + 1 >= exercises.length;

    if (isLastSet && isLastEx) {
      setPhase("done");
      setSessionDone(true);
      return;
    }

    setPhase("resting");
  }

  function afterRest() {
    const isLastSet = setIdx + 1 >= currentEx.sets;
    if (isLastSet) {
      setExIdx((i) => i + 1);
      setSetIdx(0);
    } else {
      setSetIdx((i) => i + 1);
    }
    setPhase("active");
  }

  function skipRest() { afterRest(); }

  async function saveSession() {
    setSaving(true);
    const supabase = createClient();

    const totalSets = logs.reduce((acc, l) => acc + l.sets.length, 0);
    const totalVolume = logs.reduce((acc, l) =>
      acc + l.sets.reduce((a, s) => a + (s.weight_kg ?? 0) * (s.reps ?? 0), 0), 0
    );
    const pts = calcPoints(elapsed, totalSets);

    // Insert session
    const { data: session } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: userId,
        workout_id: workoutId,
        started_at: startedAt.current,
        completed_at: new Date().toISOString(),
        duration_seconds: elapsed,
        total_volume_kg: totalVolume,
      })
      .select("id")
      .single();

    if (session) {
      // Insert logs
      const logRows = logs
        .filter((l) => l.sets.length > 0)
        .map((l, i) => ({
          session_id: session.id,
          exercise_id: l.exerciseId,
          order_index: i,
          sets_data: l.sets,
        }));
      if (logRows.length) await supabase.from("session_logs").insert(logRows);
    }

    // Update profile (streak + points)
    const { data: profile } = await supabase
      .from("profiles")
      .select("points, streak_count, last_workout_date")
      .eq("id", userId)
      .single();

    if (profile) {
      const newStreak = calcNewStreak(profile.last_workout_date, profile.streak_count);
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("profiles").update({
        points: profile.points + pts,
        streak_count: newStreak,
        last_workout_date: today,
      }).eq("id", userId);

      // Badge check: sessions count
      const { count } = await supabase
        .from("workout_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count !== null) {
        const { data: badges } = await supabase.from("badges").select("*");
        const { data: earned } = await supabase.from("user_badges").select("badge_id").eq("user_id", userId);
        const earnedIds = new Set(earned?.map((b) => b.badge_id) ?? []);

        for (const badge of badges ?? []) {
          if (earnedIds.has(badge.id)) continue;
          let unlock = false;
          if (badge.condition_type === "sessions_count" && count >= (badge.condition_value ?? 0)) unlock = true;
          if (badge.condition_type === "streak" && newStreak >= (badge.condition_value ?? 0)) unlock = true;
          if (badge.condition_type === "volume" && totalVolume >= (badge.condition_value ?? 0)) unlock = true;
          if (unlock) {
            await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id });
          }
        }
      }
    }

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  }

  if (sessionDone) {
    const totalSets = logs.reduce((acc, l) => acc + l.sets.length, 0);
    const totalVolume = logs.reduce((acc, l) =>
      acc + l.sets.reduce((a, s) => a + (s.weight_kg ?? 0) * (s.reps ?? 0), 0), 0
    );
    return (
      <SessionSummary
        workoutTitle={workoutTitle}
        durationSeconds={elapsed}
        totalSets={totalSets}
        totalVolumeKg={totalVolume}
        pointsEarned={calcPoints(elapsed, totalSets)}
        logs={logs}
        exercises={exercises}
        onSave={saveSession}
        saving={saving}
      />
    );
  }

  const progress = ((exIdx * currentEx.sets + setIdx) / (exercises.length * currentEx.sets)) * 100;

  return (
    <div className="fixed inset-0 flex flex-col z-50" style={{ background: "var(--bg-deep)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "var(--text-primary)", letterSpacing: "0.04em" }}>
          {workoutTitle}
        </span>
        <div className="flex items-center gap-5">
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--accent)", letterSpacing: "0.04em" }}>
            {formatTime(elapsed)}
          </span>
          <button onClick={() => { if (confirm("Abandonner la séance ?")) router.push("/dashboard"); }} style={{ color: "var(--text-muted)" }} aria-label="Quitter">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 flex-shrink-0" style={{ background: "var(--bg-raised)" }}>
        <div className="h-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, background: "var(--accent)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
        {/* Exercise info */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)" }}>
            Exercice {exIdx + 1} / {exercises.length}
          </p>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 7vw, 44px)", color: "var(--text-primary)", letterSpacing: "0.02em", lineHeight: 1 }}>
            {currentEx.name}
          </h2>
          {currentEx.muscleGroup && (
            <p className="text-xs mt-1 uppercase" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>
              {muscleGroupLabel(currentEx.muscleGroup)}
            </p>
          )}
        </div>

        {/* Sets progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: currentEx.sets }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 flex items-center justify-center text-sm" style={{
                background: i < completedSetsForCurrentEx ? "var(--accent)" : i === setIdx ? "var(--bg-raised)" : "var(--bg-deep)",
                border: i === setIdx ? "1px solid var(--accent)" : "1px solid var(--border)",
                color: i < completedSetsForCurrentEx ? "#fff" : i === setIdx ? "var(--accent)" : "var(--text-faint)",
                fontFamily: "var(--font-bebas)", fontSize: "18px",
              }}>
                {i < completedSetsForCurrentEx ? "✓" : i + 1}
              </div>
              <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)", fontSize: "10px" }}>
                {i < completedSetsForCurrentEx ? `${logs[exIdx].sets[i].reps}×${logs[exIdx].sets[i].weight_kg || "bw"}` : i === setIdx ? "En cours" : "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Rest timer or active set */}
        {phase === "resting" ? (
          <RestTimer seconds={currentEx.restSeconds} onComplete={afterRest} onSkip={skipRest} />
        ) : (
          <>
            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Reps</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentReps((r) => Math.max(1, r - 1))} className="w-8 h-8 flex items-center justify-center border text-lg" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-bebas)" }}>−</button>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", color: "var(--text-primary)", minWidth: 40, textAlign: "center" }}>{currentReps}</span>
                  <button onClick={() => setCurrentReps((r) => r + 1)} className="w-8 h-8 flex items-center justify-center border text-lg" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-bebas)" }}>+</button>
                </div>
              </div>
              <div className="p-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Poids (kg)</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentWeight((w) => Math.max(0, +(w - 2.5).toFixed(1)))} className="w-8 h-8 flex items-center justify-center border text-lg" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-bebas)" }}>−</button>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "var(--text-primary)", minWidth: 44, textAlign: "center" }}>{currentWeight}</span>
                  <button onClick={() => setCurrentWeight((w) => +(w + 2.5).toFixed(1))} className="w-8 h-8 flex items-center justify-center border text-lg" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-bebas)" }}>+</button>
                </div>
              </div>
            </div>

            {/* Complete set CTA */}
            <button onClick={completeSet} className="w-full py-4 text-base uppercase tracking-widest flex items-center justify-center gap-3" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.08em" }}>
              Set terminé <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Next exercise hint */}
        {nextEx && phase !== "resting" && (
          <p className="text-xs text-center" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
            Prochain : <span style={{ color: "var(--text-muted)" }}>{nextEx.name} — {nextEx.sets}×{nextEx.reps ?? `${nextEx.durationSeconds}s`}{nextEx.weightKg ? ` — ${nextEx.weightKg} kg` : ""}</span>
          </p>
        )}
      </div>
    </div>
  );
}
