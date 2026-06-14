import { cn } from "@/lib/utils/cn";

type DividerProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function Divider({
  className,
  orientation = "horizontal",
}: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn(
        "border-0 bg-outline-variant",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
