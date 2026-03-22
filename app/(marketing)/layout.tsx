"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(6,6,6,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image src="/Logo.png" alt="Qudrah" width={32} height={32} className="object-contain" />
          <span
            className="text-2xl leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "var(--accent)",
              letterSpacing: "0.05em",
            }}
          >
            QUDRAH
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Coachs", href: "#coaches" },
            { label: "Tarifs", href: "#pricing" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm transition-colors"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm transition-colors"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm transition-colors"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 600,
              background: "var(--accent)",
              color: "var(--text-primary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            Commencer
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--text-muted)" }}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "Coachs", href: "#coaches" },
            { label: "Tarifs", href: "#pricing" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
              }}
            >
              {item.label}
            </a>
          ))}
          <div
            className="border-t pt-4 flex flex-col gap-3"
            style={{ borderColor: "var(--border)" }}
          >
            <Link
              href="/login"
              className="text-sm"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm text-center"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                background: "var(--accent)",
                color: "var(--text-primary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
              }}
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function MarketingFooter() {
  return (
    <footer
      className="border-t"
      style={{
        background: "var(--bg-deep)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Qudrah" width={24} height={24} className="object-contain" />
          <span
            className="text-xl"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "var(--accent)",
              letterSpacing: "0.05em",
            }}
          >
            QUDRAH
          </span>
        </div>
        <div className="flex items-center gap-6">
          {["Mentions légales", "Confidentialité", "CGU"].map((label) => (
            <a
              key={label}
              href="#"
              className="text-xs transition-colors"
              style={{
                color: "var(--text-faint)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <p
          className="text-xs"
          style={{ color: "var(--text-faint)", fontFamily: "var(--font-inter)" }}
        >
          &copy; {new Date().getFullYear()} Qudrah. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
