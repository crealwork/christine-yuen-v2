import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  framing?: "wide" | "portrait" | "square";
};

const sizeMap = {
  wide: { width: 1536, height: 1024 },
  portrait: { width: 1024, height: 1536 },
  square: { width: 1024, height: 1024 },
};

export default function EditorialImage({
  framing = "wide",
  src,
  alt,
  className = "",
  ...rest
}: Props) {
  const { width, height } = sizeMap[framing];
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`w-full h-auto ${className}`}
      {...rest}
    />
  );
}
