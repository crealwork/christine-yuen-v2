"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

const SHOW_KOREAN = false;

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" },
];

export default function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  if (!SHOW_KOREAN) return null;

  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase">
      {locales.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: l.code })}
            aria-current={locale === l.code ? "true" : undefined}
            className={`px-1 py-1 transition-colors ${
              locale === l.code
                ? "text-[var(--color-ink)] border-b border-[var(--color-ink)]"
                : "text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
            }`}
          >
            {l.label}
          </button>
          {i < locales.length - 1 && (
            <span className="text-[var(--color-line)]">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
