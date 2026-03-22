import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SessionPlayer from "@/components/session/SessionPlayer";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
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

  const exercises = (workout.workout_exercises as any[])
    .sort((a, b) => a.order_index - b.order_index)
    .map((we) => ({
      weId: we.id,
      exerciseId: we.exercise_id,
      name: we.exercises?.name ?? "Exercice",
      muscleGroup: we.exercises?.muscle_group ?? null,
      sets: we.sets,
      reps: we.reps,
      durationSeconds: we.duration_seconds,
      weightKg: we.weight_kg,
      restSeconds: we.rest_seconds,
    }));

  return (
    <SessionPlayer
      workoutId={id}
      workoutTitle={workout.title}
      exercises={exercises}
      userId={user.id}
    />
  );
}
