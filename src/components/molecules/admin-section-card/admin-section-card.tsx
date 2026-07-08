import { cn } from "@/lib/utils/cn";

type AdminSectionCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminSectionCard({ title, description, children, className }: AdminSectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-outline-variant bg-surface-container-lowest p-lg",
        className,
      )}
    >
      {title ? <h2 className="text-body-lg font-semibold text-on-surface">{title}</h2> : null}
      {description ? (
        <p className={cn("text-body-sm text-on-surface-variant", title ? "mt-xs" : undefined)}>
          {description}
        </p>
      ) : null}
      <div className={title || description ? "mt-md" : undefined}>{children}</div>
    </section>
  );
}
