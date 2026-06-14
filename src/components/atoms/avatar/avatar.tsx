import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  src?: string;
  alt: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
};

const sizeStyles: Record<AvatarSize, { container: string; text: string; pixels: number }> = {
  sm: { container: "size-8", text: "text-body-sm", pixels: 32 },
  md: { container: "size-10", text: "text-body-sm", pixels: 40 },
  lg: { container: "size-12", text: "text-body-md", pixels: 48 },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const styles = sizeStyles[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={styles.pixels}
        height={styles.pixels}
        className={cn(
          "rounded-full object-cover",
          styles.container,
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-label={alt}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-surface-container-high",
        "font-body font-semibold text-on-surface-variant",
        styles.container,
        styles.text,
        className,
      )}
    >
      {name ? getInitials(name) : "?"}
    </span>
  );
}
