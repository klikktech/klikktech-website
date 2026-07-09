import { cn } from "@/lib/utils/cn";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function AdminPageHeader({ title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <header className={cn("mb-lg flex flex-wrap items-end justify-between gap-md", className)}>
      <div className="min-w-0">
        <h1 className="text-headline-md text-on-surface">{title}</h1>
        {description ? (
          <p className="mt-xs text-body-sm text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-sm">{actions}</div> : null}
    </header>
  );
}
