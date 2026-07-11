"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import {
  getBookableDates,
  getMonthCells,
  getTimeSlotsForDate,
  isDateBookable,
  toDateKey,
} from "@/lib/booking/availability";
import { cn } from "@/lib/utils/cn";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type BookingCalendarProps = {
  selectedDateKey: string | null;
  selectedTime: string | null;
  onSelectDate: (dateKey: string) => void;
  onSelectTime: (time: string | null) => void;
  className?: string;
};

export function BookingCalendar({
  selectedDateKey,
  selectedTime,
  onSelectDate,
  onSelectTime,
  className,
}: BookingCalendarProps) {
  const bookableKeys = useMemo(
    () => new Set(getBookableDates().map(toDateKey)),
    [],
  );

  const initialMonth = useMemo(() => {
    const firstBookable = getBookableDates(1)[0] ?? new Date();
    return { year: firstBookable.getFullYear(), month: firstBookable.getMonth() };
  }, []);

  const [viewYear, setViewYear] = useState(initialMonth.year);
  const [viewMonth, setViewMonth] = useState(initialMonth.month);

  const monthCells = useMemo(
    () => getMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth, 1));

  const timeSlots = selectedDateKey ? getTimeSlotsForDate(selectedDateKey) : [];

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
      return;
    }
    setViewMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
      return;
    }
    setViewMonth((m) => m + 1);
  };

  return (
    <div className={cn("flex flex-col gap-lg", className)}>
      <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="flex items-center justify-between gap-md">
          <button
            type="button"
            aria-label="Previous month"
            onClick={goToPrevMonth}
            className="inline-flex size-9 items-center justify-center rounded-button border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <Icon icon={ChevronLeft} size="sm" />
          </button>
          <p className="font-display text-headline-md text-on-surface">{monthLabel}</p>
          <button
            type="button"
            aria-label="Next month"
            onClick={goToNextMonth}
            className="inline-flex size-9 items-center justify-center rounded-button border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <Icon icon={ChevronRight} size="sm" />
          </button>
        </div>

        <div className="mt-lg grid grid-cols-7 gap-xs text-center">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="py-xs text-label-md text-on-surface-variant normal-case"
            >
              {label}
            </span>
          ))}

          {monthCells.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} />;
            }

            const dateKey = toDateKey(date);
            const isBookable = isDateBookable(date, bookableKeys);
            const isSelected = selectedDateKey === dateKey;

            return (
              <button
                key={dateKey}
                type="button"
                disabled={!isBookable}
                onClick={() => {
                  onSelectDate(dateKey);
                  onSelectTime(null);
                }}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-button text-body-sm transition-colors",
                  isSelected && "bg-primary text-on-primary",
                  !isSelected &&
                    isBookable &&
                    "text-on-surface hover:bg-secondary-container",
                  !isBookable && "cursor-not-allowed text-on-surface-variant/40",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDateKey ? (
        <div className="flex flex-col gap-md">
          <p className="text-label-md text-on-surface-variant normal-case">
            Available times (Pacific)
          </p>
          {timeSlots.length > 0 ? (
            <div className="flex flex-wrap gap-sm">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={cn(
                    "inline-flex min-w-[5.5rem] items-center justify-center rounded-button border px-md py-sm text-body-sm transition-colors",
                    selectedTime === slot
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-on-tertiary-container",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-on-surface-variant">
              No remaining slots for this date. Please choose another day.
            </p>
          )}
        </div>
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          Select a weekday to see available call times.
        </p>
      )}
    </div>
  );
}
