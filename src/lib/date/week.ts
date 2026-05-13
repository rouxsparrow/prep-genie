import { addDays, formatISO, startOfWeek } from "date-fns";

export function toWeekStartDateISO(date: Date): string {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return formatISO(monday, { representation: "date" });
}

export function weekDatesFromStart(weekStartDateISO: string): string[] {
  const start = new Date(`${weekStartDateISO}T00:00:00Z`);
  return Array.from({ length: 7 }, (_, i) =>
    formatISO(addDays(start, i), { representation: "date" }),
  );
}

