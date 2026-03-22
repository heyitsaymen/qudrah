"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Props { workoutId: string; userId: string; initialSaved: boolean; }

export default function SaveWorkoutButton({ workoutId, userId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    if (saved) {
      await supabase.from("saved_workouts").delete().eq("user_id", userId).eq("workout_id", workoutId);
    } else {
      await supabase.from("saved_workouts").insert({ user_id: userId, workout_id: workoutId });
    }
    setSaved(!saved);
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading} className="flex-shrink-0 p-1.5 transition-colors disabled:opacity-40" style={{ color: saved ? "var(--accent)" : "var(--text-faint)" }} aria-label={saved ? "Retirer" : "Sauvegarder"}>
      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}
