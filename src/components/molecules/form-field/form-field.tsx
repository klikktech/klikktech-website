import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ id, label, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-sm", className)}>
      <label htmlFor={id} className="text-label-md text-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}
