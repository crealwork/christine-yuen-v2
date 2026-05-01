import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HospitalityFooter() {
  const tFoot = useTranslations("footer");
  const tContact = useTranslations("contact");
  const tHeader = useTranslations("header");

  const links: Array<[string, string]> = [
    ["/", tHeader("navHome")],
    ["/#how-i-work", tHeader("navHowIWork")],
    ["/about", tHeader("navAbout")],
    ["/process", tHeader("navProcess")],
    ["/value", tHeader("navValue")],
    ["/contact", tHeader("navContact")],
  ];

  return (
    <footer className="mt-24 bg-[var(--color-canvas)] border-t border-[var(--color-line)]">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[14px] text-[var(--color-graphite)]">
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-ink)] mb-4">Contact</h4>
            <p className="text-[var(--color-ink)] font-medium mb-1">Christine Yuen, REALTOR®</p>
            <p className="mb-1">{tContact("altPhone")}</p>
            <p className="mb-1">
              <a href={`mailto:${tContact("altEmail")}`} className="hover:text-[var(--color-accent-dark)]">
                {tContact("altEmail")}
              </a>
            </p>
            <p>
              <a
                href={`https://instagram.com/${tContact("altIg").replace("@", "")}`}
                className="hover:text-[var(--color-accent-dark)]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tContact("altIg")}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-ink)] mb-4">Brokerage</h4>
            <p className="mb-1">Grand Central Realty</p>
            <p className="mb-1">Personal Real Estate Corporation</p>
            <p className="mb-1">BCFSA RE611159</p>
            <p>230-3700 North Fraser Way, Burnaby, BC V5J 5H4</p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-ink)] mb-4">Sitemap</h4>
            <ul className="space-y-1">
              {links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[var(--color-accent-dark)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--color-line)] flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px] text-[var(--color-graphite)]">
          <p>{tFoot("copyright")}</p>
          <p className="max-w-2xl text-[11px]">{tFoot("trademark")}</p>
        </div>
      </div>
    </footer>
  );
}
