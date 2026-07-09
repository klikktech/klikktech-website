import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type AdminFormFeedbackProps = {
  variant: "success" | "error";
  message: string;
  className?: string;
};

export function AdminFormFeedback({ variant, message, className }: AdminFormFeedbackProps) {
  const isSuccess = variant === "success";

  return (
    <p
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "flex items-start gap-sm rounded-button px-md py-sm text-body-sm",
        isSuccess
          ? "border border-success/20 bg-success-container text-on-success-container"
          : "border border-error/20 bg-error-container text-on-error-container",
        className,
      )}
    >
      <Icon
        icon={isSuccess ? CheckCircle2 : AlertCircle}
        size="sm"
        className="mt-0.5 shrink-0"
        aria-hidden
      />
      <span>{message}</span>
    </p>
  );
}
