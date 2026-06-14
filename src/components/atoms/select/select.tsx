import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  options: readonly SelectOption[];
  placeholder?: string;
};

export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-button border border-outline-variant bg-surface-container-lowest",
          "px-md py-sm pr-10 text-body-md text-on-surface",
          "transition-colors duration-150 ease-in-out",
          "focus:border-on-tertiary-container focus:outline-none focus:ring-2 focus:ring-on-tertiary-container/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant"
      >
        ▾
      </span>
    </div>
  );
}
