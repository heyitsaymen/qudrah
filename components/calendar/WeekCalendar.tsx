"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Play, Plus, X, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui";

interface Entry {
  id: string;
  scheduled_date: string;
  is_completed: boolean;
  workouts: { id: string; title: string; duration_estimate: number | null } | null;
}

interface Props {
  userId: string;
  entries: Entry[];
  workouts: { id: string; title: string }[];
}

const DAY_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function getNext14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function WeekCalendar({ userId, entries, workouts }: Props) {
  const router = useRouter();
  const [localEntries, setLocalEntries] = useState<Entry[]>(entries);
  const [pickingDate, setPickingDate] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const days = getNext14Days();
  const today = new Date().toISOString().split("T")[0];

  function entriesForDate(dateStr: string) {
    return localEntries.filter((e) => e.scheduled_date === dateStr);
  }

  async function addEntry(workoutId: string) {
    if (!pickingDate) return;
    setAdding(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("calendar_entries")
      .insert({ user_id: userId, workout_id: workoutId, scheduled_date: pickingDate })
      .select("*, workouts(id, title, duration_estimate)")
      .single();

    if (data) {
      setLocalEntries((prev) => [...prev, data as Entry]);
    }
    setPickingDate(null);
    setAdding(false);
    router.refresh();
  }

  async function removeEntry(id: string) {
    setRemoving(id);
    const supabase = createClient();
    await supabase.from("calendar_entries").delete().eq("id", id);
    setLocalEntries((prev) => prev.filter((e) => e.id !== id));
    setRemoving(null);
    router.refresh();
  }

  return (
    <div>
      <PageHeader label="Planning" title="Calendrier" />

      <div className="flex flex-col gap-2">
        {days.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const isToday = dateStr === today;
          const dayEntries = entriesForDate(dateStr);

          return (
            <div key={dateStr} className="border" style={{ background: "var(--bg-surface)", borderColor: isToday ? "var(--accent)" : "var(--border)" }}>
              {/* Day header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: isToday ? "rgba(200,16,46,0.05)" : "transparent" }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: isToday ? "var(--accent)" : "var(--text-primary)", letterSpacing: "0.03em" }}>
                    {DAY_FR[day.getDay()]} {day.getDate()} {MONTH_FR[day.getMonth()]}
                  </span>
                  {isToday && (
                    <span className="text-xs px-2 py-0.5 uppercase" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.05em" }}>
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>
                <button onClick={() => setPickingDate(dateStr === pickingDate ? null : dateStr)} className="flex items-center gap-1 text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                  <Plus size={12} /> Ajouter
                </button>
              </div>

              {/* Workout picker for this day */}
              {pickingDate === dateStr && (
                <div className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}>
                  {workouts.length === 0 ? (
                    <p className="px-4 py-3 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>
                      Aucun workout — <Link href="/workouts/new" style={{ color: "var(--accent)" }}>crée-en un</Link>
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      {workouts.map((w) => (
                        <button key={w.id} disabled={adding} onClick={() => addEntry(w.id)} className="w-full flex items-center px-4 py-2.5 text-left border-b transition-colors disabled:opacity-50" style={{ borderColor: "var(--border)", background: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>{w.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Entries */}
              {dayEntries.length > 0 && (
                <div className="px-4 py-2 flex flex-col gap-2">
                  {dayEntries.map((entry) => {
                    const w = entry.workouts;
                    return (
                      <div key={entry.id} className="flex items-center gap-3 py-1">
                        {entry.is_completed
                          ? <CheckCircle2 size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
                          : <div className="w-3.5 h-3.5 border flex-shrink-0" style={{ borderColor: "var(--text-faint)" }} />
                        }
                        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "17px", color: entry.is_completed ? "var(--text-muted)" : "var(--text-primary)", letterSpacing: "0.02em", textDecoration: entry.is_completed ? "line-through" : "none" }}>
                          {w?.title ?? "Workout supprimé"}
                        </span>
                        {w && !entry.is_completed && isToday && (
                          <Link href={`/workouts/${w.id}/session`} className="ml-auto flex items-center gap-1 text-xs uppercase px-3 py-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.05em" }}>
                            <Play size={11} /> Lancer
                          </Link>
                        )}
                        {!entry.is_completed && (
                          <button onClick={() => removeEntry(entry.id)} disabled={removing === entry.id} className="ml-auto flex-shrink-0 transition-colors disabled:opacity-50" style={{ color: "var(--text-faint)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {dayEntries.length === 0 && pickingDate !== dateStr && (
                <div className="px-4 py-2">
                  <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>Repos</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
