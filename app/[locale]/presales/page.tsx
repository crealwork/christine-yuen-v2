import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { DropCap, FieldNote, FigureWithCaption } from "@/components/editorial";
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
    // TODO: replace with brand-specific presales page title and description
    title: isEn
      ? "{{PRESALES_PAGE_TITLE_EN}} | {{BRAND_NAME}}"
      : "{{PRESALES_PAGE_TITLE_KO}} | {{BRAND_NAME_KO}}",
    description: isEn
      ? "{{PRESALES_META_DESCRIPTION_EN}}"
      : "{{PRESALES_META_DESCRIPTION_KO}}",
    alternates: {
      canonical: `${BASE_URL}/${locale}/presales`,
      languages: {
        en: `${BASE_URL}/en/presales`,
        ko: `${BASE_URL}/ko/presales`,
      },
    },
    openGraph: {
      title: "{{PRESALES_OG_TITLE_EN}}",
      description: "{{PRESALES_OG_DESCRIPTION_EN}}",
      url: `${BASE_URL}/${locale}/presales`,
      type: "article",
      images: [
        {
          // TODO: replace with actual presale image (generated via scripts/prompts.json)
          url: "/images/editorial/presale-tower.jpg",
          width: 1536,
          height: 1024,
          alt: "{{PRESALES_OG_IMAGE_ALT}}",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "{{PRESALES_OG_TITLE_EN}}",
      description: "{{PRESALES_OG_DESCRIPTION_EN}}",
      images: ["/images/editorial/presale-tower.jpg"],
    },
    robots: locale === "ko" ? { index: false, follow: false } : undefined,
  };
}

// TODO: replace with actual generated images. Slugs should match entries in scripts/prompts.json.
const presaleCollage = [
  { src: "/images/editorial/presale-tower.jpg", caption: "{{PRESALE_COLLAGE_CAPTION_1}}" },
  { src: "/images/editorial/presale-detail-maquette.jpg", caption: "{{PRESALE_COLLAGE_CAPTION_2}}" },
  { src: "/images/editorial/presale-detail-scaffolding.jpg", caption: "{{PRESALE_COLLAGE_CAPTION_3}}" },
  { src: "/images/editorial/arch-break.jpg", caption: "{{PRESALE_COLLAGE_CAPTION_4}}" },
];

export default async function PresalesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const items = t.raw("presalesPage.checklist.items") as { title: string; body: string }[];
  const half = Math.ceil(items.length / 2);
  const firstHalf = items.slice(0, half);
  const secondHalf = items.slice(half);

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.body,
      },
    })),
  });

  return (
    <>
      {/* 01 — Feature Header */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-24 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <p className="eyebrow mb-6">{t("presalesPage.eyebrow")}</p>
          <h1 className="type-hero-headline mb-6">{t("presalesPage.title")}</h1>
          <p
            className="text-xl md:text-2xl italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-700)" }}
          >
            {t("presalesPage.subtitle")}
          </p>
        </div>
      </section>

      {/* 02 — Intro Essay */}
      <section className="section-pad bg-white">
        <div className="container-wide essay-column">
          <DropCap>{t("presalesPage.intro")}</DropCap>
        </div>
        <div className="container-wide max-w-5xl mt-12">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {presaleCollage.map((item) => (
              <figure key={item.src} className="m-0">
                <div className="aspect-square overflow-hidden bg-[var(--color-canvas)]">
                  <Image
                    src={item.src}
                    alt=""
                    width={1024}
                    height={1024}
                    sizes="(max-width: 768px) 50vw, 500px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="type-caption mt-2 max-w-[80%]">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — 8-point review */}
      <section className="section-pad bg-[var(--color-canvas)]">
        <div className="container-wide max-w-5xl">
          <h2 className="type-h2 mb-12">{t("presalesPage.checklist.title")}</h2>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {firstHalf.map((it, i) => (
              <FieldNote key={i} number={i + 1} title={it.title}>
                {it.body}
              </FieldNote>
            ))}
          </div>
          <div className="my-16 max-w-3xl">
            <FigureWithCaption
              src="/images/editorial/object-doorknob.jpg"
              alt=""
              caption="{{PRESALE_MIDPAGE_CAPTION}}"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {secondHalf.map((it, i) => (
              <FieldNote key={i + half} number={i + half + 1} title={it.title}>
                {it.body}
              </FieldNote>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — On Method */}
      <section className="section-pad bg-white">
        <div className="container-wide essay-column">
          <h2 className="type-h2 mb-8">{t("presalesMethod.title")}</h2>
          <p className="type-body-essay">{t("presalesMethod.body")}</p>
        </div>
      </section>

      {/* 05 — CTA */}
      <section className="section-pad bg-[var(--color-accent-50)]">
        <div className="container-wide essay-column text-center">
          <p className="type-pull-quote mb-8">{t("presalesCta.text")}</p>
          <Link href="/contact" className="btn-primary">
            {t("presalesCta.button")}
          </Link>
        </div>
      </section>

      {locale === "en" && <JsonLd schema={faqSchema} />}
    </>
  );
}
