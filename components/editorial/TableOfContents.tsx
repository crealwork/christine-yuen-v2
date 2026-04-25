type Entry = { num: number; label: string; href: string };

type Props = {
  entries: Entry[];
  heading?: string;
  className?: string;
};

export default function TableOfContents({ entries, heading = "Contents", className = "" }: Props) {
  return (
    <nav className={`${className}`} aria-label={heading}>
      <p className="eyebrow mb-6">{heading}</p>
      <ol className="space-y-3">
        {entries.map((e) => (
          <li key={e.num} className="flex items-baseline gap-6 group">
            <span className="type-num text-lg shrink-0 w-8">
              {String(e.num).padStart(2, "0")}
            </span>
            <a
              href={e.href}
              className="text-lg md:text-xl text-[var(--color-ink)] group-hover:text-[var(--color-accent-700)] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
