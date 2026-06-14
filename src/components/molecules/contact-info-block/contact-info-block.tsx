import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/icon";

type ContactInfoBlockProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  className?: string;
};

export function ContactInfoBlock({
  icon,
  label,
  value,
  href,
  className,
}: ContactInfoBlockProps) {
  const content = (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-button bg-primary text-on-primary">
        <Icon icon={icon} size="sm" aria-hidden={false} aria-label={label} />
      </span>
      <span className="text-body-md text-on-surface">{value}</span>
    </>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-md rounded-card border border-outline-variant bg-surface-container-low p-md",
        className,
      )}
    >
      {href ? (
        <a
          href={href}
          className="flex items-center gap-md transition-opacity hover:opacity-80"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
