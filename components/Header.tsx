"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import LangToggle from "./LangToggle";

const navItems = [
  { key: "home", href: "/" },
  { key: "presales", href: "/presales" },
  { key: "value", href: "/value" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-[var(--color-line)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-20">
        <Link
          href="/"
          // TODO: replace aria-label with brand name
          aria-label={t("hero.eyebrow")}
          className="flex items-center gap-3"
        >
          {/* Brand name rendered as Fraunces text — crisp at any size, no SVG needed */}
          <span
            className="text-xl md:text-2xl font-normal text-[var(--color-ink)] leading-none"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
          >
            {t("hero.eyebrow")}
          </span>
          <span
            aria-hidden
            className="hidden md:inline type-masthead text-[var(--color-graphite)] border-l border-[var(--color-line)] pl-3 ml-1"
          >
            {/* Masthead tagline — pulled from messages.masthead.tagline */}
            {t("masthead.tagline")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-[var(--color-ink)]"
                    : "text-[var(--color-charcoal)] hover:text-[var(--color-accent-700)]"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <LangToggle />
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block w-5 h-px bg-[var(--color-ink)] transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-[var(--color-ink)] transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-[var(--color-ink)] transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-white border-t border-[var(--color-line)]">
          <div className="container-wide py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-lg font-medium text-[var(--color-ink)] py-2"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--color-line)]">
              <LangToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
