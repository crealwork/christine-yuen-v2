type Props = { children: string; className?: string };

export default function DropCap({ children, className = "" }: Props) {
  if (!children || children.length === 0) {
    return <p className={`type-body-essay ${className}`}></p>;
  }
  const first = children.charAt(0);
  const rest = children.slice(1);
  return (
    <p className={`type-body-essay ${className}`}>
      <span
        className="drop-cap float-left text-[4em] leading-[0.85] font-normal italic mr-3 mt-1 mb-[-0.1em]"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-accent-700)",
          fontVariationSettings: '"opsz" 144',
        }}
      >
        {first}
      </span>
      {rest}
    </p>
  );
}
