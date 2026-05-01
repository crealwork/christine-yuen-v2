import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="bg-[var(--color-canvas)]">
      <div className="container-wide py-20 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-12 max-w-[640px]">
          {t("heading")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="bg-[var(--color-accent-50)] border border-[var(--color-line)] rounded-[12px] p-8"
            >
              <p className="font-display italic text-[18px] leading-[1.5] text-[var(--color-ink)] mb-6">
                {t("emptyState")}
              </p>
              <p className="text-[13px] text-[var(--color-graphite)]">— Coming soon</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
