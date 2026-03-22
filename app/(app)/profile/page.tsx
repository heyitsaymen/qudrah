import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader, Badge } from "@/components/ui";
import { getInitials, formatDuration } from "@/lib/utils";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Stats
  const { count: sessionsCount } = await supabase
    .from("workout_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .not("completed_at", "is", null);

  const { data: volumeData } = await supabase
    .from("workout_sessions")
    .select("total_volume_kg")
    .eq("user_id", user.id)
    .not("completed_at", "is", null);

  const totalVolume = (volumeData ?? []).reduce((acc, s) => acc + (s.total_volume_kg ?? 0), 0);

  // Badges
  const { data: allBadges } = await supabase.from("badges").select("*");
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", user.id);

  const earnedIds = new Set(earnedBadges?.map((b) => b.badge_id) ?? []);

  // My workouts
  const { data: myWorkouts } = await supabase
    .from("workouts")
    .select("id, title, format, created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const initials = getInitials(profile?.full_name ?? profile?.username);

  return (
    <div>
      <PageHeader label="Mon compte" title="Profil" />

      {/* Avatar + info */}
      <div className="flex items-center gap-5 mb-8 p-5 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "var(--accent)", letterSpacing: "0.05em" }}>
            {initials}
          </span>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            {profile?.full_name || profile?.username}
          </p>
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
            @{profile?.username}
          </p>
          {profile?.role === "coach" && (
            <span className="inline-flex mt-1 text-xs px-2 py-0.5" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "rgba(200,16,46,0.12)", color: "var(--accent)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Coach
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Séances", value: String(sessionsCount ?? 0) },
          { label: "Streak", value: `🔥 ${profile?.streak_count ?? 0}j` },
          { label: "Volume total", value: `${(totalVolume / 1000).toFixed(1)}t` },
          { label: "Points", value: `⚡ ${profile?.points ?? 0}` },
        ].map((s) => (
          <div key={s.label} className="p-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="mb-4" style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-primary)", letterSpacing: "0.03em" }}>Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(allBadges ?? []).map((badge) => {
            const isEarned = earnedIds.has(badge.id);
            return (
              <div key={badge.id} className="p-4 border text-center flex flex-col items-center gap-1" style={{ background: isEarned ? "var(--bg-raised)" : "var(--bg-surface)", borderColor: "var(--border)", opacity: isEarned ? 1 : 0.35 }}>
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-xs uppercase" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: isEarned ? "var(--text-primary)" : "var(--text-faint)", letterSpacing: "0.04em" }}>
                  {badge.name}
                </p>
                <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* My workouts */}
      {myWorkouts && myWorkouts.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4" style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-primary)", letterSpacing: "0.03em" }}>Mes programmes</h2>
          <div className="flex flex-col gap-2">
            {myWorkouts.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <p style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>{w.title}</p>
                <Badge label={w.format === "challenge" ? "Challenge" : "Routine"} variant="faint" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
        <LogoutButton />
      </div>
    </div>
  );
}
