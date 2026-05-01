"use client";

import { useTranslations } from "next-intl";

export default function ContactStrip() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="bg-[var(--color-canvas)]">
      <div className="container-wide py-20 md:py-28">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-display italic text-[44px] md:text-[56px] leading-[1.1] tracking-tight text-[var(--color-ink)] mb-6">
            {t("heading")}
          </h2>
          <p className="text-[17px] leading-[1.65] text-[var(--color-graphite)] mb-10">
            {t("body")}
          </p>
          <form className="text-left grid gap-4 mb-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder={t("fieldName")}
              required
              className="bg-white border border-[var(--color-line)] rounded-[8px] px-5 py-4 text-[16px] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="email"
              placeholder={t("fieldEmail")}
              required
              className="bg-white border border-[var(--color-line)] rounded-[8px] px-5 py-4 text-[16px] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <textarea
              placeholder={t("fieldMessage")}
              required
              rows={4}
              className="bg-white border border-[var(--color-line)] rounded-[8px] px-5 py-4 text-[16px] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-[var(--color-accent)] text-white font-medium text-[15px] rounded-full hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              {t("submit")}
            </button>
          </form>
          <p className="text-[12px] text-[var(--color-graphite)] mb-8">{t("privacy")}</p>
          <div className="text-[14px] text-[var(--color-graphite)] flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span>{t("altPhone")}</span>
            <span className="text-[var(--color-line)]">·</span>
            <a href={`mailto:${t("altEmail")}`} className="hover:text-[var(--color-accent-dark)]">
              {t("altEmail")}
            </a>
            <span className="text-[var(--color-line)]">·</span>
            <a
              href={`https://instagram.com/${t("altIg").replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent-dark)]"
            >
              {t("altIg")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
