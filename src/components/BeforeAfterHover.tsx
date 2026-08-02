"use client";
import Image from "next/image";

interface Props {
  before: string;
  after: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function BeforeAfterHover({ before, after, alt, className = "", sizes = "25vw" }: Props) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Image
        src={after}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-500 group-hover:opacity-0 group-hover:scale-105 transition-transform duration-700"
        sizes={sizes}
      />
      <Image
        src={before}
        alt={`${alt} before`}
        fill
        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        sizes={sizes}
      />
    </div>
  );
}
