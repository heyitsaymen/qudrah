import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Edit, Dumbbell, Clock, ChevronLeft } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { muscleGroupLabel, equipmentLabel } from "@/lib/utils";
import DeleteWorkoutButton from "./DeleteWorkoutButton";

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: workout } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, exercises(*))")
    .eq("id", id)
    .single();

  if (!workout) notFound();

  const isOwner = workout.created_by === user.id;
  const exercises = (workout.workout_exercises as any[]).sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      <Link href="/workouts" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest mb-6 transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>
        <ChevronLeft size={12} /> Mes workouts
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--accent)" }}>
            {workout.format === "challenge" ? "Challenge" : "Routine"}
          </p>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 5vw, 52px)", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            {workout.title}
          </h1>
          {workout.description && (
            <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>{workout.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
              <Dumbbell size={12} /> {exercises.length} exercices
            </span>
            {workout.duration_estimate && (
              <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
                <Clock size={12} /> ~{workout.duration_estimate} min
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link href={`/workouts/${id}/session`} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.06em" }}>
            <Play size={14} /> Lancer
          </Link>
          {isOwner && (
            <Link href={`/workouts/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, borderColor: "var(--border)", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
              <Edit size={12} /> Modifier
            </Link>
          )}
        </div>
      </div>

      {/* Exercise list */}
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        {exercises.map((we, i) => {
          const ex = we.exercises;
          return (
            <div key={we.id} className="flex items-center gap-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "var(--text-faint)", width: "28px", textAlign: "right" }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                  {ex?.name ?? "Exercice supprimé"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {ex?.muscle_group && <Badge label={muscleGroupLabel(ex.muscle_group)} variant="faint" />}
                  {ex?.equipment && <Badge label={equipmentLabel(ex.equipment)} variant="faint" />}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs flex-shrink-0" style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "var(--text-muted)" }}>
                <span>{we.sets} × {we.reps ? `${we.reps} reps` : `${we.duration_seconds}s`}</span>
                {we.weight_kg && <span style={{ color: "var(--text-faint)" }}>{we.weight_kg} kg</span>}
                <span style={{ color: "var(--text-faint)" }}>Repos {we.rest_seconds}s</span>
              </div>
            </div>
          );
        })}
      </div>

      {isOwner && (
        <div className="mt-6">
          <DeleteWorkoutButton workoutId={id} />
        </div>
      )}
    </div>
  );
}
