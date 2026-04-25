import type { ReactNode } from "react";

type Props = {
  number: number;
  title: string;
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export default function FieldNote({ number, title, children, imageSrc, imageAlt, className = "" }: Props) {
  const padded = String(number).padStart(2, "0");
  return (
    <article className={`p-8 md:p-10 bg-white border border-[var(--color-line)] hover:bg-[var(--color-accent-50)] transition-colors ${className}`}>
      <p className="type-num text-lg mb-3">No. {padded}</p>
      <h3 className="type-h3 mb-3">{title}</h3>
      <div className="text-[var(--color-charcoal)] leading-relaxed">{children}</div>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt ?? ""}
          className="mt-6 w-full h-auto"
          loading="lazy"
        />
      )}
    </article>
  );
}
