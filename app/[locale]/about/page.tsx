import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { DropCap, PullQuote, FigureWithCaption } from "@/components/editorial";
import { JsonLd } from "@/components/JsonLd";

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
      ? "About {{REALTOR_FULL_NAME}} — REALTOR® with {{BROKERAGE}} | {{BRAND_NAME}}"
      : "{{REALTOR_FULL_NAME_KO}} 소개 — {{BROKERAGE_KO}} 리얼터® | {{BRAND_NAME_KO}}",
    description: isEn
      ? "{{ABOUT_META_DESCRIPTION_EN}}"
      : "{{ABOUT_META_DESCRIPTION_KO}}",
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        ko: `${BASE_URL}/ko/about`,
      },
    },
    openGraph: {
      title: "About {{REALTOR_FULL_NAME}} — REALTOR® with {{BROKERAGE}}",
      description: "{{ABOUT_OG_DESCRIPTION_EN}}",
      url: `${BASE_URL}/${locale}/about`,
      type: "profile",
      images: [
        {
          // TODO: replace with actual portrait image (generated via scripts/prompts.json)
          url: "/images/editorial/realtor-portrait-bw.jpg",
          width: 1024,
          height: 1536,
          alt: "{{REALTOR_FULL_NAME}}, REALTOR® — portrait photograph",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About {{REALTOR_FULL_NAME}} — REALTOR® with {{BROKERAGE}}",
      description: "{{ABOUT_OG_DESCRIPTION_EN}}",
      images: ["/images/editorial/realtor-portrait-bw.jpg"],
    },
    robots: locale === "ko" ? { index: false, follow: false } : undefined,
  };
}

// TODO: customize Person JSON-LD with actual realtor details before launch.
const personSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  // TODO: replace with realtor full name
  name: "{{REALTOR_FULL_NAME}}",
  jobTitle: "REALTOR®, Real Estate Consultant",
  worksFor: {
    "@type": "Organization",
    // TODO: replace with brokerage name
    name: "{{BROKERAGE}}",
  },
  // TODO: replace or remove alumniOf if not applicable
  alumniOf: [
    { "@type": "Organization", name: "{{PREVIOUS_ORG_1}}" },
  ],
  // TODO: update knowsLanguage — e.g. ["en"] or ["en", "ko"]
  knowsLanguage: ["en"],
  url: `${BASE_URL}/en/about`,
  image: `${BASE_URL}/images/editorial/realtor-portrait-bw.jpg`,
  // TODO: replace with realtor's Instagram URL or remove sameAs
  sameAs: ["https://www.instagram.com/{{INSTAGRAM_HANDLE}}/"],
});

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* 01 — Portrait Hero */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-24 bg-[var(--color-canvas)]">
        <div className="container-wide grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-center">
          {/* TODO: replace alt text with realtor name */}
          <Image
            src="/images/editorial/realtor-portrait-bw.jpg"
            alt="{{REALTOR_FULL_NAME}}"
            width={1024}
            height={1536}
            priority
            className="w-full h-auto grayscale"
          />
          <div>
            <p className="eyebrow mb-6">{t("about.eyebrow")}</p>
            <h1 className="type-hero-headline mb-4">{t("about.title")}</h1>
            <p
              className="text-xl italic mb-6"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-700)" }}
            >
              {t("about.subtitle")}
            </p>
            <p className="type-body-essay max-w-sm">{t("about.bio")}</p>
          </div>
        </div>
      </section>

      {/* 02 — Essay */}
      <section className="section-pad bg-white">
        <div className="container-wide essay-column">
          <DropCap>{t("about.essayParagraph1")}</DropCap>
          <FigureWithCaption
            src="/images/editorial/arch-break.jpg"
            alt=""
            caption={t("about.essayCaption")}
          />
          <p className="type-body-essay editorial-paragraph">
            {t("about.essayParagraph2")}
          </p>
          <PullQuote attribution={t("aboutPullQuote.attribution")}>
            {t("aboutPullQuote.text")}
          </PullQuote>
        </div>
      </section>

      {/* 03 — Background */}
      <section className="section-pad bg-[var(--color-canvas)] border-t border-[var(--color-line)]">
        <div className="container-wide essay-column">
          <h2 className="type-h2 mb-10">{t("background.title")}</h2>
          <dl className="space-y-6">
            <BackgroundRow label="Brokerage" value={t("background.items.brokerage")} />
            <BackgroundRow label="Previous" value={t("background.items.previous")} />
            <BackgroundRow label="Languages" value={t("background.items.languages")} />
            <BackgroundRow label="Service Area" value={t("background.items.area")} />
          </dl>
        </div>
      </section>

      {/* 04 — Contact bridge */}
      <section className="section-pad bg-white">
        <div className="container-wide essay-column text-center">
          <p className="type-pull-quote mb-8">{t("aboutBridge.body")}</p>
          <Link href="/contact" className="btn-primary">
            {t("aboutBridge.cta")}
          </Link>
        </div>
      </section>

      {locale === "en" && <JsonLd schema={personSchema} />}
    </>
  );
}

function BackgroundRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-6 items-baseline border-b border-[var(--color-line)] pb-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-lg">{value}</dd>
    </div>
  );
}
