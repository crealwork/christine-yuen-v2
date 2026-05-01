import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CurrentlyRepresenting() {
  const t = useTranslations("currently");

  return (
    <section className="bg-[var(--color-accent-50)]">
      <div className="container-wide py-20 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-8 max-w-[640px]">
          {t("heading")}
        </h2>
        <div className="bg-white border border-[var(--color-line)] rounded-[12px] p-10 md:p-14 max-w-[860px]">
          <p className="text-[18px] leading-[1.65] text-[var(--color-graphite)] mb-6">
            {t("emptyState")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-ink)] transition-colors"
          >
            {t("ctaSearch")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
