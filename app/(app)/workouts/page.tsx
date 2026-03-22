import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Dumbbell, Clock, Lock, Globe } from "lucide-react";
import { PageHeader, EmptyState, Badge } from "@/components/ui";

export default async function WorkoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: workouts } = await supabase
    .from("workouts")
    .select("*, workout_exercises(count)")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        label="Ma bibliothèque"
        title="Mes Workouts"
        action={
          <Link
            href="/workouts/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-widest"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.06em" }}
          >
            <Plus size={14} /> Nouveau
          </Link>
        }
      />

      {!workouts || workouts.length === 0 ? (
        <EmptyState
          title="Aucun workout"
          desc="Crée ton premier programme et commence à t'entraîner."
          action={
            <Link href="/workouts/new" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm uppercase" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff" }}>
              <Plus size={13} /> Créer un workout
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workouts.map((w) => {
            const exoCount = (w.workout_exercises as { count: number }[])?.[0]?.count ?? 0;
            return (
              <Link
                key={w.id}
                href={`/workouts/${w.id}`}
                className="group p-5 border transition-colors flex flex-col gap-3"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                    {w.title}
                  </h3>
                  {w.is_public
                    ? <Globe size={14} style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: 4 }} />
                    : <Lock size={14} style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: 4 }} />
                  }
                </div>

                <div className="flex items-center gap-3">
                  <Badge label={w.format === "challenge" ? "Challenge" : "Routine"} variant={w.format === "challenge" ? "accent" : "default"} />
                  <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
                    <Dumbbell size={11} /> {exoCount} exo{exoCount !== 1 ? "s" : ""}
                  </span>
                  {w.duration_estimate && (
                    <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
                      <Clock size={11} /> ~{w.duration_estimate} min
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
