import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import AppBottomNav from "@/components/layout/AppBottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  // Note: this layout covers /dashboard, /workouts, /calendar, /explore, /profile

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, streak_count, role")
    .eq("id", user.id)
    .single();

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* Desktop sidebar */}
      <AppSidebar
        username={profile?.username ?? ""}
        streak={profile?.streak_count ?? 0}
        role={profile?.role ?? "user"}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0 md:ml-60">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <AppBottomNav />
    </div>
  );
}
