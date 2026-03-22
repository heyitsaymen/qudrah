"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={handleLogout} className="flex items-center gap-2 text-sm uppercase tracking-widest transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", letterSpacing: "0.06em" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
      <LogOut size={14} /> Déconnexion
    </button>
  );
}
