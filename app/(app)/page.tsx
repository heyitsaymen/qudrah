import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CalendarCheck, Dumbbell, Plus } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  // Get today's calendar entry
  const { data: todayEntry } = await supabase
    .from("calendar_entries")
    .select("*, workouts(id, title, duration_estimate, workout_exercises(count))")
    .eq("user_id", user.id)
    .eq("scheduled_date", today)
    .single();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, streak_count, points")
    .eq("id", user.id)
    .single();

  // Get last 3 workouts
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("id, title, duration_estimate, workout_exercises(count)")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const workout = todayEntry?.workouts as
    | { id: string; title: string; duration_estimate: number | null; workout_exercises: { count: number }[] }
    | null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(36px, 5vw, 52px)",
            color: "var(--text-primary)",
            letterSpacing: "0.02em",
          }}
        >
          Bonjour, {profile?.username ?? "Athlète"}.
        </h1>

        {/* Streak + points */}
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "var(--accent)",
              }}
            >
              {profile?.streak_count ?? 0}
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--text-muted)",
              }}
            >
              jours
            </span>
          </div>
          <div
            className="w-px h-5"
            style={{ background: "var(--border)" }}
          />
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "var(--text-primary)",
              }}
            >
              {profile?.points ?? 0}
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--text-muted)",
              }}
            >
              pts
            </span>
          </div>
        </div>
      </div>

      {/* Today's workout or empty state */}
      {workout ? (
        <div
          className="p-6 border relative overflow-hidden"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Red accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "var(--accent)" }}
          />
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            Séance du jour
          </p>
          <h2
            className="mb-1"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "32px",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            {workout.title}
          </h2>
          <p
            className="text-xs mb-6"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--text-muted)",
            }}
          >
            {workout.workout_exercises?.[0]?.count ?? 0} exercices
            {workout.duration_estimate
              ? ` · ~${workout.duration_estimate} min`
              : ""}
          </p>

          {todayEntry?.is_completed ? (
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} style={{ color: "var(--accent)" }} />
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Séance complétée
              </span>
            </div>
          ) : (
            <Link
              href={`/workouts/${workout.id}/session`}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#fff",
                letterSpacing: "0.08em",
              }}
            >
              <Dumbbell size={14} />
              Lancer la séance
            </Link>
          )}
        </div>
      ) : (
        <div
          className="p-6 border text-center"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            borderStyle: "dashed",
          }}
        >
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "var(--text-muted)",
              letterSpacing: "0.03em",
            }}
          >
            Aucune séance planifiée aujourd&apos;hui
          </p>
          <p
            className="text-sm mb-5"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--text-faint)",
            }}
          >
            Planifie ta semaine ou lance une séance directement.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/calendar"
              className="px-4 py-2 text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
              }}
            >
              Planifier
            </Link>
            <Link
              href="/workouts"
              className="px-4 py-2 text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#fff",
                letterSpacing: "0.06em",
              }}
            >
              Mes workouts
            </Link>
          </div>
        </div>
      )}

      {/* Recent workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "24px",
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
            }}
          >
            Mes workouts récents
          </h2>
          <Link
            href="/workouts/new"
            className="flex items-center gap-1 text-xs uppercase tracking-widest transition-colors"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.05em",
            }}
          >
            <Plus size={12} />
            Nouveau
          </Link>
        </div>

        {recentWorkouts && recentWorkouts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentWorkouts.map((w) => {
              const exoCount = (w.workout_exercises as { count: number }[])?.[0]?.count ?? 0;
              return (
                <Link
                  key={w.id}
                  href={`/workouts/${w.id}`}
                  className="flex items-center justify-between p-4 border transition-colors group"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-bebas)",
                        fontSize: "20px",
                        color: "var(--text-primary)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {w.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-inter)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {exoCount} exercice{exoCount !== 1 ? "s" : ""}
                      {w.duration_estimate ? ` · ~${w.duration_estimate} min` : ""}
                    </p>
                  </div>
                  <span
                    className="text-xs transition-colors"
                    style={{
                      fontFamily: "var(--font-barlow)",
                      fontWeight: 600,
                      color: "var(--text-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Voir →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="p-5 border text-center"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm mb-3"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--text-muted)",
              }}
            >
              Tu n&apos;as pas encore de workout.
            </p>
            <Link
              href="/workouts/new"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#fff",
                letterSpacing: "0.06em",
              }}
            >
              <Plus size={12} />
              Créer mon premier workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
