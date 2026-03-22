"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Calendar, Compass, User } from "lucide-react";

const navItems = [
  { href: "/",         icon: Home,     label: "Home"     },
  { href: "/workouts", icon: Dumbbell, label: "Workouts" },
  { href: "/calendar", icon: Calendar, label: "Calendrier"},
  { href: "/explore",  icon: Compass,  label: "Explorer" },
  { href: "/profile",  icon: User,     label: "Profil"   },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden flex border-t z-40"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
            style={{
              color: active ? "var(--accent)" : "var(--text-faint)",
            }}
            aria-label={label}
          >
            <Icon size={20} />
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                letterSpacing: "0.03em",
                fontSize: "10px",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
