import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-button border border-outline-variant bg-surface-container-lowest",
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
