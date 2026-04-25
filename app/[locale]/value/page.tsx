import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import EstimatorForm from "@/components/EstimatorForm";

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
    // TODO: replace with brand-specific value page title and description
    title: isEn
      ? "Home Value Estimator — {{SERVICE_AREA}} | {{BRAND_NAME}}"
      : "홈 가치 추정기 — {{SERVICE_AREA_KO}} | {{BRAND_NAME_KO}}",
    description: isEn
      ? "Free 2-minute home value estimate based on {{SERVICE_AREA}} comparables. Personal review from {{REALTOR_FULL_NAME}}, REALTOR®, within 24 hours."
      : "{{VALUE_META_DESCRIPTION_KO}}",
    alternates: {
      canonical: `${BASE_URL}/${locale}/value`,
      languages: {
        en: `${BASE_URL}/en/value`,
        ko: `${BASE_URL}/ko/value`,
      },
    },
    openGraph: {
      // TODO: replace with brand-specific OG title and description
      title: "Home Value Estimator — {{SERVICE_AREA}} | {{BRAND_NAME}}",
      description: "Free 2-minute estimate based on {{SERVICE_AREA}} comparables. Personal review from {{REALTOR_FULL_NAME}}, REALTOR®, within 24 hours.",
      url: `${BASE_URL}/${locale}/value`,
      type: "website",
      images: [
        {
          url: "/images/editorial/arch-break.jpg",
          width: 1536,
          height: 1024,
          alt: "{{VALUE_OG_IMAGE_ALT}}",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Home Value Estimator — {{SERVICE_AREA}} | {{BRAND_NAME}}",
      description: "Free 2-minute estimate based on {{SERVICE_AREA}} comparables. Personal review from {{REALTOR_FULL_NAME}}, REALTOR®, within 24 hours.",
      images: ["/images/editorial/arch-break.jpg"],
    },
    robots: locale === "ko" ? { index: false, follow: false } : undefined,
  };
}

export default async function ValuePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <p className="eyebrow mb-6">Home value</p>
          <h1 className="type-hero-headline mb-6">What's your home worth?</h1>
          <p
            className="text-xl italic max-w-2xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-graphite)" }}
          >
            {/* TODO: replace with brand-specific subtitle referencing the realtor's name and market */}
            {"A two-minute estimate based on {{SERVICE_AREA}} comparables, plus a personal review from {{REALTOR_FIRST_NAME}} within 24 hours."}
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-white">
        <div className="container-wide max-w-3xl">
          <EstimatorForm />
        </div>
      </section>
    </>
  );
}
