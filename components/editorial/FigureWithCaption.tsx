import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function FigureWithCaption({
  src,
  alt,
  caption,
  width = 1536,
  height = 1024,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1024px",
  className = "",
}: Props) {
  return (
    <figure className={`my-10 md:my-14 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="w-full h-auto"
      />
      <figcaption className="type-caption mt-3 max-w-[80%]">{caption}</figcaption>
    </figure>
  );
}
