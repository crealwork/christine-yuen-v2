import type { ReactNode } from "react";

type Props = { children: ReactNode; attribution?: string; className?: string };

export default function PullQuote({ children, attribution, className = "" }: Props) {
  return (
    <figure className={`my-12 md:my-16 ${className}`}>
      <span className="hairline mb-6" aria-hidden />
      <blockquote className="type-pull-quote">{children}</blockquote>
      {attribution && (
        <figcaption
          className="mt-4 text-sm italic"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-accent-700)",
          }}
        >
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
