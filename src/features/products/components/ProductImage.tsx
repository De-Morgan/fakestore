import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const FALLBACK = "/placeholder.svg";

type ProductImageProps = Omit<ComponentProps<"img">, "src"> & {
  src: string;
  size: number;
};

// Square product photo. Fixed width/height + aspect-square reserve its space before it loads (CLS ≈ 0).
export function ProductImage({
  size,
  className,
  onError,
  ...props
}: ProductImageProps) {
  return (
    <img
      width={size}
      height={size}
      decoding="async"
      {...props}
      className={cn("aspect-square w-full object-contain", className)}
      // FakeStore images occasionally 404. Show a neutral placeholder, not a broken-image icon.
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.endsWith(FALLBACK)) img.src = FALLBACK;
        onError?.(e);
      }}
    />
  );
}
