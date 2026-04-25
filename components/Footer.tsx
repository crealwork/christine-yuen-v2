import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-ink)] text-white">
      <div
        aria-hidden
        className="h-32 md:h-48 w-full bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url(/images/editorial/ambient-footer.jpg)" }}
      />
      <div className="container-wide py-16 md:py-20">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-16">
          {/* Brand */}
          <div>
            {/* TODO: replace with brand name.
                Fraunces renders cleanly at any size — no SVG logo needed. */}
            <span
              className="text-2xl md:text-3xl font-normal leading-none"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              {t("hero.eyebrow")}
            </span>
            <p className="mt-6 text-sm text-white/70 max-w-xs leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 space-y-1 text-sm text-white/80">
              {/* TODO: replace REALTOR_FULL_NAME below — pulled from messages footer.compliance key,
                  or hardcode if preferred */}
              <div>
                {t("footer.compliance").split("·")[0].trim()} · REALTOR<sup>®</sup>
              </div>
              <div>
                {/* TODO: replace href and display phone with realtor cell */}
                <a
                  href="tel:+10000000000"
                  className="hover:text-[var(--color-accent)]"
                >
                  {/* TODO: realtor phone — keep in sync with contactPage.direct in messages */}
                  000-000-0000
                </a>
              </div>
              <div>
                {/* TODO: replace with realtor Instagram handle, or remove if not applicable */}
                <a
                  href="https://www.instagram.com/yourhandle/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--color-accent)]"
                >
                  @yourhandle
                </a>
              </div>
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <div className="eyebrow text-white/50 mb-4">{t("nav.home")}</div>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/presales" className="text-white/80 hover:text-[var(--color-accent)]">
                {t("nav.presales")}
              </Link>
              <Link href="/value" className="text-white/80 hover:text-[var(--color-accent)]">
                {t("nav.value")}
              </Link>
              <Link href="/about" className="text-white/80 hover:text-[var(--color-accent)]">
                {t("nav.about")}
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-[var(--color-accent)]">
                {t("nav.contact")}
              </Link>
            </nav>
          </div>

          {/* Brokerage */}
          <div>
            <div className="eyebrow text-white/50 mb-4">{t("footer.proudlyWith")}</div>
            {/* TODO: add brokerage logo at public/logo/brokerage-logo.png, then switch to:
                <Image
                  src="/logo/brokerage-logo.png"
                  alt="{{BROKERAGE}}"
                  width={180}
                  height={55}
                  className="h-10 w-auto"
                />
            */}
            <div className="text-white/80 text-sm font-medium mb-2">
              {t("contactPage.office.name")}
            </div>
            <address className="not-italic text-sm text-white/70 leading-relaxed">
              {t("contactPage.office.address")}
              <br />
              {/* TODO: replace href and display phone with brokerage phone */}
              <a
                href="tel:+10000000000"
                className="hover:text-[var(--color-accent)]"
              >
                000-000-0000
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {year} {t("footer.compliance")}. {t("footer.rights")}
          </div>
          {/* TODO: replace with actual production domain */}
          <div className="tracking-wider uppercase">example.ca</div>
        </div>
      </div>
    </footer>
  );
}
