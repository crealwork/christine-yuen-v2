import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutSnippet() {
  const t = useTranslations("aboutSnippet");

  return (
    <section className="bg-[var(--color-canvas)]">
      <div className="container-wide py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
          <figure className="m-0">
            <div className="relative aspect-[4/5] w-full max-w-[360px] rounded-[24px] overflow-hidden">
              <Image
                src="/images/portrait/christine-tight.png"
                alt="Christine Yuen"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          </figure>
          <div>
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
              {t("eyebrow")}
            </p>
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-8 max-w-[680px]">
              {t("heading")}
            </h2>
            <p className="text-[17px] leading-[1.7] text-[var(--color-graphite)] mb-5 max-w-[640px]">
              {t("paragraph1")}
            </p>
            <p className="text-[17px] leading-[1.7] text-[var(--color-graphite)] mb-10 max-w-[640px]">
              {t("paragraph2")}
            </p>
            <blockquote className="font-display italic text-[28px] md:text-[32px] leading-[1.3] text-[var(--color-ink)] mb-10 max-w-[680px] border-l-2 border-[var(--color-accent)] pl-6">
              {t("pullQuote")}
            </blockquote>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-ink)] transition-colors"
            >
              {t("moreLink")} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
