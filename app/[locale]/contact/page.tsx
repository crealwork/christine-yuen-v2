import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import ContactForm from "@/components/ContactForm";

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
    // TODO: replace with brand-specific contact page title and description
    title: isEn
      ? "Contact {{REALTOR_FIRST_NAME}} — {{SERVICE_AREA}} realtor | {{BRAND_NAME}}"
      : "{{CONTACT_PAGE_TITLE_KO}}",
    description: isEn
      ? "Reach {{REALTOR_FULL_NAME}}, REALTOR® — {{SERVICE_AREA_LIST}}. Call {{REALTOR_PHONE}} or send a message. Most replies within a few hours."
      : "{{CONTACT_META_DESCRIPTION_KO}}",
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        en: `${BASE_URL}/en/contact`,
        ko: `${BASE_URL}/ko/contact`,
      },
    },
    openGraph: {
      // TODO: replace with brand-specific OG title and description
      title: "Contact {{REALTOR_FIRST_NAME}} — {{SERVICE_AREA}} realtor | {{BRAND_NAME}}",
      description: "{{CONTACT_OG_DESCRIPTION_EN}}",
      url: `${BASE_URL}/${locale}/contact`,
      type: "website",
      images: [
        {
          // TODO: replace with actual ambient image (generated via scripts/prompts.json)
          url: "/images/editorial/ambient-footer.jpg",
          width: 1536,
          height: 1024,
          alt: "{{CONTACT_OG_IMAGE_ALT}}",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact {{REALTOR_FIRST_NAME}} — {{SERVICE_AREA}} realtor | {{BRAND_NAME}}",
      description: "{{CONTACT_OG_DESCRIPTION_EN}}",
      images: ["/images/editorial/ambient-footer.jpg"],
    },
    robots: locale === "ko" ? { index: false, follow: false } : undefined,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <p className="eyebrow mb-6">{t("contactPage.eyebrow")}</p>
          <h1 className="type-hero-headline mb-6">{t("contactPage.title")}</h1>
          <p
            className="text-xl italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-graphite)" }}
          >
            {t("contactPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-white">
        <div className="container-wide max-w-6xl">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20">
            <ContactForm />
            <aside className="space-y-12">
              <div>
                <h2 className="eyebrow mb-4">{t("contactPage.direct.title")}</h2>
                <dl className="space-y-3 text-base">
                  <div>
                    <dt className="text-sm text-[var(--color-graphite)]">
                      {t("contactPage.direct.phone")}
                    </dt>
                    <dd>
                      {/* TODO: replace with realtor's cell phone */}
                      <a
                        href="tel:{{REALTOR_PHONE_E164}}"
                        className="text-lg hover:text-[var(--color-accent-700)]"
                      >
                        {{REALTOR_PHONE}}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-[var(--color-graphite)]">
                      {t("contactPage.direct.instagram")}
                    </dt>
                    <dd>
                      {/* TODO: replace with realtor's Instagram handle */}
                      <a
                        href="https://www.instagram.com/{{INSTAGRAM_HANDLE}}/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg hover:text-[var(--color-accent-700)]"
                      >
                        @{{INSTAGRAM_HANDLE}}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h2 className="eyebrow mb-4">{t("contactPage.office.title")}</h2>
                <div className="text-base space-y-1">
                  <div className="font-medium">{t("contactPage.office.name")}</div>
                  <address className="not-italic text-[var(--color-graphite)]">
                    {t("contactPage.office.address")}
                  </address>
                  <div className="pt-2">
                    <span className="text-sm text-[var(--color-graphite)]">
                      {t("contactPage.office.phone")}:{" "}
                    </span>
                    {/* TODO: replace with brokerage phone */}
                    <a
                      href="tel:{{BROKERAGE_PHONE_E164}}"
                      className="hover:text-[var(--color-accent-700)]"
                    >
                      {{BROKERAGE_PHONE}}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
