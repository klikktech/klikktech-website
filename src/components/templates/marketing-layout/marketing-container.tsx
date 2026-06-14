import { cn } from "@/lib/utils/cn";

type MarketingContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingContainer({
  children,
  className,
}: MarketingContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-container px-4 md:px-6 lg:px-gutter",
        className,
      )}
    >
      {children}
    </div>
  );
}
