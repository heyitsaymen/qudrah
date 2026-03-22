"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export default function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Supprimer ce workout ?")) return;
    const supabase = createClient();
    await supabase.from("workouts").delete().eq("id", workoutId);
    router.push("/workouts");
    router.refresh();
  }
  return (
    <button onClick={handleDelete} className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)" }}>
      <Trash2 size={12} /> Supprimer ce workout
    </button>
  );
}
