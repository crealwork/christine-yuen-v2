"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function WelcomeStrip() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("navHome") },
    { href: "/#how-i-work", label: t("navHowIWork") },
    { href: "/about", label: t("navAbout") },
    { href: "/process", label: t("navProcess") },
    { href: "/value", label: t("navValue") },
    { href: "/contact", label: t("navContact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur border-b border-[var(--color-line)]">
      <div className="container-wide flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="text-[18px] font-semibold tracking-tight text-[var(--color-ink)]">
          {t("wordmark")}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[var(--color-ink)]">
          {links.map((l, i) => (
            <span key={l.href} className="flex items-center gap-6">
              <Link href={l.href} className="hover:text-[var(--color-accent-dark)] transition-colors">
                {l.label}
              </Link>
              {i < links.length - 1 && <span className="text-[var(--color-line)]">·</span>}
            </span>
          ))}
        </nav>
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--color-ink)]"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-[var(--color-line)] py-4 px-6 flex flex-col gap-4 text-[16px] text-[var(--color-ink)]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
