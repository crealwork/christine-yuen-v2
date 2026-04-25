import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import {
  DropCap,
  PullQuote,
  FieldNote,
  TableOfContents,
  EditorialImage,
} from "@/components/editorial";

// TODO: replace with actual production domain (set NEXT_PUBLIC_SITE_URL env var)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ca";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    // TODO: replace with brand-specific title and description
    title: isEn
      ? "{{BRAND_NAME}} — {{TAGLINE}} | {{REALTOR_NAME}}, REALTOR®"
      : "{{BRAND_NAME_KO}} — {{TAGLINE_KO}} | {{REALTOR_NAME_KO}}, 리얼터®",
    description: isEn
      ? "{{REALTOR_NAME}}, REALTOR® with {{BROKERAGE}}. {{META_DESCRIPTION_EN}}"
      : "{{REALTOR_NAME_KO}}, {{BROKERAGE_KO}} 리얼터®. {{META_DESCRIPTION_KO}}",
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        ko: `${BASE_URL}/ko`,
      },
    },
    openGraph: {
      // TODO: replace with brand-specific OG title and description
      title: "{{BRAND_NAME}} — {{TAGLINE}}",
      description: "{{OG_DESCRIPTION_EN}}",
      url: `${BASE_URL}/${locale}`,
      type: "website",
      images: [
        {
          // TODO: replace with actual hero image (generated via scripts/prompts.json)
          url: "/images/editorial/hero-light.jpg",
          width: 1536,
          height: 1024,
          alt: "{{HERO_IMAGE_ALT}}",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "{{BRAND_NAME}} — {{TAGLINE}}",
      description: "{{OG_DESCRIPTION_EN}}",
      images: ["/images/editorial/hero-light.jpg"],
    },
    robots: locale === "ko" ? { index: false, follow: false } : undefined,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const areas = t.raw("territory.areas") as string[];
  const tocEntries = t.raw("homeContents.entries") as { num: number; label: string; href: string }[];
  const fieldNoteKeys = ["presale", "resale", "investment", "firstHome"] as const;

  return (
    <>
      {/* 01 — Masthead + Hero */}
      <section className="relative min-h-[68vh] flex items-end pt-32 pb-16 md:pb-24 overflow-hidden bg-[var(--color-canvas)]">
        <div className="absolute inset-0">
          <EditorialImage
            src="/images/editorial/hero-light.jpg"
            alt=""
            framing="wide"
            priority
            sizes="100vw"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-white/60" />
        </div>
        <div className="container-wide relative z-10">
          <p className="eyebrow mb-6">{t("hero.eyebrow")}</p>
          <h1 className="type-hero-headline max-w-3xl whitespace-pre-line">{t("hero.headline")}</h1>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/presales" className="btn-ghost">
              {t("hero.ctaPrimary")}
            </Link>
            <Link href="/contact" className="btn-primary">
              {t("hero.ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* 02 — Contents */}
      <section className="section-pad bg-white border-t border-[var(--color-line)]">
        <div className="container-wide max-w-3xl">
          <TableOfContents entries={tocEntries} heading={t("homeContents.heading")} />
        </div>
      </section>

      {/* 03 — Editor's Note */}
      <section id="editor-note" className="section-pad bg-[var(--color-canvas)]">
        <div className="container-wide grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 max-w-5xl items-start">
          <div className="essay-column">
            <p className="eyebrow mb-6">{t("editorNote.eyebrow")}</p>
            <DropCap>{t("editorNote.body")}</DropCap>
            <p
              className="mt-6 italic"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-700)" }}
            >
              {t("editorNote.signoff")}
            </p>
          </div>
          <div className="hidden md:block w-32 h-32 lg:w-40 lg:h-40 shrink-0">
            {/* TODO: replace alt text with realtor name */}
            <Image
              src="/images/editorial/realtor-portrait-bw.jpg"
              alt="{{REALTOR_FULL_NAME}}"
              width={160}
              height={160}
              className="w-full h-full object-cover rounded-full grayscale"
            />
          </div>
        </div>
      </section>

      {/* 04 — Field Notes */}
      <section id="field-notes" className="section-pad bg-white">
        <div className="container-wide">
          <h2 className="type-h2 mb-12">{t("fieldNotes.title")}</h2>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {fieldNoteKeys.map((key, i) => (
              <FieldNote
                key={key}
                number={i + 1}
                title={t(`fieldNotes.${key}.title`)}
              >
                {t(`fieldNotes.${key}.body`)}
              </FieldNote>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Territory */}
      <section id="territory" className="section-pad bg-[var(--color-canvas)]">
        <div className="container-wide grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20">
          <div>
            <p className="eyebrow mb-6">{t("territory.eyebrow")}</p>
            <h2 className="type-h2 mb-6">{t("territory.title")}</h2>
            <p className="type-body-essay max-w-md">{t("territory.body")}</p>
          </div>
          {/* TODO: replace neighborhood images with brand-specific images generated via scripts/prompts.json */}
          <div className="grid grid-cols-2 gap-3">
            <Image
              src="/images/editorial/neighborhood-1.jpg"
              alt="{{AREA_1}}"
              width={400}
              height={400}
              className="w-full h-auto"
            />
            <Image
              src="/images/editorial/neighborhood-2.jpg"
              alt="{{AREA_2}}"
              width={400}
              height={400}
              className="w-full h-auto"
            />
            <Image
              src="/images/editorial/neighborhood-3.jpg"
              alt="{{AREA_3}}"
              width={400}
              height={400}
              className="w-full h-auto"
            />
            <Image
              src="/images/editorial/neighborhood-4.jpg"
              alt="{{AREA_4}}"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="container-wide mt-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-graphite)]">
            {areas.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Pull Quote */}
      <section id="pull-quote" className="section-pad bg-[var(--color-accent-50)]">
        <div className="container-wide essay-column text-center">
          <PullQuote attribution={t("pullQuote.attribution")}>
            {t("pullQuote.text")}
          </PullQuote>
        </div>
      </section>

      {/* 07 — Subscribe */}
      <section id="subscribe" className="section-pad bg-[var(--color-ink)] text-white">
        <div className="container-wide max-w-2xl text-center">
          <p className="eyebrow mb-6" style={{ color: "var(--color-accent)" }}>
            {t("subscribe.eyebrow")}
          </p>
          <h2 className="type-h2 mb-6" style={{ color: "#ffffff" }}>{t("subscribe.title")}</h2>
          <p className="type-body-essay mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>{t("subscribe.body")}</p>
          <Link href="/contact" className="btn-primary">
            {t("subscribe.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
