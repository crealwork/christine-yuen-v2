import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function WelcomeHero() {
  const t = useTranslations("hero");

  return (
    <section className="bg-[var(--color-canvas)] overflow-hidden">
      <div className="container-wide pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-center">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-6">
              {t("eyebrow")}
            </p>
            <h1 className="font-display text-[56px] md:text-[80px] leading-[1.05] tracking-tight text-[var(--color-ink)] mb-3">
              {t("greeting")}
            </h1>
            <p className="text-[20px] md:text-[22px] font-medium text-[var(--color-ink)] mb-6">
              {t("subheadline")}
            </p>
            <p className="text-[17px] leading-[1.65] text-[var(--color-graphite)] max-w-[460px] mb-10">
              {t("body")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[var(--color-accent)] text-white font-medium text-[15px] rounded-full hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/process"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-[var(--color-ink)] text-[var(--color-ink)] font-medium text-[15px] rounded-full hover:bg-[var(--color-ink)] hover:text-white transition-colors"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
          <figure className="m-0 relative">
            <div
              className="relative aspect-[4/5] w-full max-w-[520px] mx-auto rounded-[12px] overflow-hidden bg-[var(--color-accent-50)]"
              style={{ boxShadow: "0 24px 48px rgba(42, 37, 33, 0.08)" }}
            >
              <Image
                src="/images/portrait/christine-portrait-cream.jpg"
                alt={t("portraitAlt")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
