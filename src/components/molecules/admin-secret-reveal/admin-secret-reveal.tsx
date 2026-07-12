import { CopyButton } from "@/components/molecules/copy-button";
import { cn } from "@/lib/utils/cn";

export type AdminSecretItem = {
  label: string;
  value: string;
  copyable?: boolean;
  copyLabel?: string;
};

type AdminSecretRevealProps = {
  title?: string;
  description: string;
  items: AdminSecretItem[];
  className?: string;
};

export function AdminSecretReveal({ title, description, items, className }: AdminSecretRevealProps) {
  return (
    <div
      className={cn(
        "rounded-button border border-outline-variant bg-surface-container-low px-md py-md",
        className,
      )}
    >
      {title ? <p className="text-body-sm font-medium text-on-surface mb-xs">{title}</p> : null}
      <p className="text-body-sm text-on-surface-variant mb-md">{description}</p>
      <div className="flex flex-col gap-sm">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-xs">
            <span className="text-label-md text-on-surface-variant normal-case">{item.label}</span>
            <div className="flex items-start gap-sm">
              <code className="min-w-0 flex-1 break-all font-mono text-body-sm text-on-surface">
                {item.value}
              </code>
              {item.copyable !== false ? (
                <CopyButton value={item.value} label={item.copyLabel ?? `Copy ${item.label.toLowerCase()}`} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
