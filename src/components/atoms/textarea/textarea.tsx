import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-button border border-outline-variant bg-surface-container-lowest",
        "px-md py-sm text-body-md text-on-surface placeholder:text-on-surface-variant",
        "transition-colors duration-150 ease-in-out",
        "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
