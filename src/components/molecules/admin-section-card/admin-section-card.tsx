import { cn } from "@/lib/utils/cn";

type AdminSectionCardVariant = "default" | "danger";

type AdminSectionCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: AdminSectionCardVariant;
};

export function AdminSectionCard({
  title,
  description,
  children,
  className,
  id,
  variant = "default",
}: AdminSectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-card border bg-surface-container-lowest p-lg",
        variant === "default" && "border-outline-variant",
        variant === "danger" && "border-error/40 bg-error-container/10",
        className,
      )}
    >
      {title ? (
        <h2
          className={cn(
            "text-body-lg font-semibold",
            variant === "danger" ? "text-error" : "text-on-surface",
          )}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className={cn("text-body-sm text-on-surface-variant", title ? "mt-xs" : undefined)}>
          {description}
        </p>
      ) : null}
      <div className={title || description ? "mt-md" : undefined}>{children}</div>
    </section>
  );
}
