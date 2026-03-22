import { createClient } from "@/lib/supabase/server";
import WeekCalendar from "@/components/calendar/WeekCalendar";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get next 14 days of calendar entries
  const today = new Date();
  const in14 = new Date(today);
  in14.setDate(today.getDate() + 13);

  const { data: entries } = await supabase
    .from("calendar_entries")
    .select("*, workouts(id, title, duration_estimate)")
    .eq("user_id", user.id)
    .gte("scheduled_date", today.toISOString().split("T")[0])
    .lte("scheduled_date", in14.toISOString().split("T")[0])
    .order("scheduled_date");

  const { data: workouts } = await supabase
    .from("workouts")
    .select("id, title")
    .eq("created_by", user.id)
    .order("title");

  return (
    <WeekCalendar
      userId={user.id}
      entries={entries ?? []}
      workouts={workouts ?? []}
    />
  );
}
