/** Booking availability helpers — US Pacific, weekdays 9am–5pm. */

export const BOOKING_TIMEZONE = "America/Los_Angeles";
export const BOOKING_DAYS_AHEAD = 28;
export const WORK_START_HOUR = 9;
export const WORK_END_HOUR = 17;
export const SLOT_INTERVAL_MINUTES = 30;

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BOOKING_TIMEZONE,
  weekday: "short",
});

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BOOKING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BOOKING_TIMEZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function toDateKey(date: Date): string {
  return dateKeyFormatter.format(date);
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function isWeekday(date: Date): boolean {
  const weekday = weekdayFormatter.format(date);
  return weekday !== "Sat" && weekday !== "Sun";
}

export function getBookableDates(count = BOOKING_DAYS_AHEAD): Date[] {
  const dates: Date[] = [];
  const cursor = new Date();

  for (let offset = 0; dates.length < count; offset += 1) {
    const candidate = new Date(cursor);
    candidate.setDate(cursor.getDate() + offset);

    if (isWeekday(candidate)) {
      dates.push(candidate);
    }
  }

  return dates;
}

export function getMonthCells(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

export function isDateBookable(date: Date, bookableKeys: Set<string>): boolean {
  return bookableKeys.has(toDateKey(date)) && isWeekday(date);
}

export function getTimeSlotsForDate(dateKey: string): string[] {
  const slots: string[] = [];
  const base = parseDateKey(dateKey);
  const now = new Date();

  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour += 1) {
    for (const minute of [0, SLOT_INTERVAL_MINUTES]) {
      if (hour === WORK_END_HOUR - 1 && minute === SLOT_INTERVAL_MINUTES) {
        continue;
      }

      const slotDate = new Date(base);
      slotDate.setHours(hour, minute, 0, 0);

      if (slotDate <= now) {
        continue;
      }

      slots.push(timeFormatter.format(slotDate));
    }
  }

  return slots;
}

export function slotToIso(dateKey: string, timeLabel: string): string {
  const base = parseDateKey(dateKey);
  const match = timeLabel.match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (!match) {
    throw new Error("Invalid time slot format.");
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  base.setHours(hour, minute, 0, 0);
  return base.toISOString();
}

export function formatSelectedSlot(dateKey: string, timeLabel: string): string {
  const date = parseDateKey(dateKey);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return `${dateLabel} at ${timeLabel} PT`;
}
