"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-lg",
        "backdrop:bg-inverse-surface/40",
        "open:flex open:items-center open:justify-center",
      )}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        className={cn(
          "relative w-full max-w-sm rounded-card border border-outline-variant bg-surface-container-lowest p-lg shadow-overlay",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className={cn(
            "absolute right-md top-md inline-flex size-8 items-center justify-center rounded-button",
            "text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container",
          )}
        >
          <Icon icon={X} size="sm" aria-hidden />
        </button>

        <h2 id="modal-title" className="pr-10 text-headline-md text-on-surface">
          {title}
        </h2>
        {description ? (
          <p id="modal-description" className="mt-sm text-body-md text-on-surface-variant">
            {description}
          </p>
        ) : null}

        <div className="mt-lg">{children}</div>
      </div>
    </dialog>
  );
}
