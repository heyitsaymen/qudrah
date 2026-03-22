import { createClient } from "@/lib/supabase/server";
import WorkoutBuilder from "@/components/workout/WorkoutBuilder";

export default async function NewWorkoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, muscle_group, equipment")
    .or(`is_public.eq.true,created_by.eq.${user.id}`)
    .order("name");

  return <WorkoutBuilder exercises={exercises ?? []} userId={user.id} />;
}
