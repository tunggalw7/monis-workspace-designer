"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** Image that shows a skeleton until it has loaded, then fades in. Fills its positioned parent. */
export function FadeImage({ alt, className = "", onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span aria-hidden className="skeleton absolute inset-0 rounded-[inherit]" />}
      <Image
        {...props}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </>
  );
}
