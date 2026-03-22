"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Calendar, Compass, User } from "lucide-react";

const navItems = [
  { href: "/dashboard",  icon: Home,     label: "Home"      },
  { href: "/workouts",   icon: Dumbbell, label: "Workouts"  },
  { href: "/calendar",   icon: Calendar, label: "Calendrier"},
  { href: "/explore",    icon: Compass,  label: "Explorer"  },
  { href: "/profile",    icon: User,     label: "Profil"    },
];

interface Props {
  username: string;
  streak: number;
  role: string;
}

export default function AppSidebar({ username, streak, role }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 border-r z-40"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-5 h-14 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Image src="/Logo.png" alt="Qudrah" width={24} height={24} className="object-contain" />
        <span
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "var(--accent)",
            letterSpacing: "0.05em",
          }}
        >
          QUDRAH
        </span>
        {role === "coach" && (
          <span
            className="ml-auto text-xs px-2 py-0.5"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              background: "rgba(200,16,46,0.15)",
              color: "var(--accent)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Coach
          </span>
        )}
      </div>

      {/* User info */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {username}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--text-muted)",
          }}
        >
          🔥 {streak} jour{streak !== 1 ? "s" : ""} de streak
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: active ? "var(--bg-raised)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                borderLeft: active
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs uppercase tracking-widest transition-colors w-full text-left"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--text-faint)",
            }}
          >
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
