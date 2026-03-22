import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Dumbbell, Clock, User, Bookmark } from "lucide-react";
import { PageHeader, Badge, EmptyState } from "@/components/ui";
import { muscleGroupLabel } from "@/lib/utils";
import SaveWorkoutButton from "./SaveWorkoutButton";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; format?: string }>;
}) {
  const { q, format } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let query = supabase
    .from("workouts")
    .select("*, profiles(username, role), workout_exercises(count)")
    .eq("is_public", true)
    .neq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (format && format !== "all") query = query.eq("format", format);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: workouts } = await query.limit(50);

  const { data: saved } = await supabase
    .from("saved_workouts")
    .select("workout_id")
    .eq("user_id", user.id);

  const savedIds = new Set(saved?.map((s) => s.workout_id) ?? []);

  return (
    <div>
      <PageHeader label="Communauté" title="Explorer" />

      {/* Filters */}
      <form className="flex items-center gap-3 mb-6">
        <input name="q" defaultValue={q} placeholder="Chercher un workout…" className="flex-1 px-4 py-2.5 text-sm outline-none max-w-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-primary)", background: "var(--bg-surface)", border: "1px solid var(--border)" }} />
        <div className="flex gap-2">
          {["all", "routine", "challenge"].map((f) => (
            <button key={f} name="format" value={f} type="submit" className="px-3 py-2 text-xs uppercase tracking-widest transition-all" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: (!format && f === "all") || format === f ? "var(--accent)" : "var(--bg-surface)", color: (!format && f === "all") || format === f ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)", letterSpacing: "0.05em" }}>
              {f === "all" ? "Tous" : f === "routine" ? "Routine" : "Challenge"}
            </button>
          ))}
        </div>
      </form>

      {!workouts || workouts.length === 0 ? (
        <EmptyState title="Aucun workout public" desc="Les coachs n'ont pas encore publié de programmes." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workouts.map((w) => {
            const exoCount = (w.workout_exercises as { count: number }[])?.[0]?.count ?? 0;
            const coach = w.profiles as { username: string; role: string } | null;
            const isSaved = savedIds.has(w.id);

            return (
              <div key={w.id} className="p-5 border flex flex-col gap-3" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                      {w.title}
                    </h3>
                    {w.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>{w.description}</p>
                    )}
                  </div>
                  <SaveWorkoutButton workoutId={w.id} userId={user.id} initialSaved={isSaved} />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge label={w.format === "challenge" ? "Challenge" : "Routine"} variant={w.format === "challenge" ? "accent" : "default"} />
                  <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
                    <Dumbbell size={11} /> {exoCount} exo{exoCount !== 1 ? "s" : ""}
                  </span>
                  {w.duration_estimate && (
                    <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
                      <Clock size={11} /> ~{w.duration_estimate} min
                    </span>
                  )}
                  {coach && (
                    <span className="flex items-center gap-1 text-xs ml-auto" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
                      <User size={11} /> {coach.username}
                    </span>
                  )}
                </div>

                <Link href={`/workouts/${w.id}`} className="text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", letterSpacing: "0.06em" }}>
                  Voir le programme →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
