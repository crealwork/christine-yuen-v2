import { useTranslations } from "next-intl";

type Region = "richmond" | "vancouverEast" | "vancouverWest";

export default function Atlas() {
  const t = useTranslations("atlas");
  const regions: Region[] = ["richmond", "vancouverEast", "vancouverWest"];

  return (
    <section className="bg-[var(--color-accent-50)]">
      <div className="container-wide py-20 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-14 max-w-[640px]">
          {t("heading")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          {regions.map((region) => {
            const items = t.raw(`${region}.items`) as string[];
            return (
              <div key={region}>
                <h3 className="text-[20px] font-semibold text-[var(--color-ink)] mb-5 pb-3 border-b border-[var(--color-line)]">
                  {t(`${region}.label`)}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="text-[16px] text-[var(--color-graphite)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
