import type { NewTrip } from "../api/trips";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parses a `YYYY-MM-DD` date as a UTC day, so day counts aren't skewed by time zones or DST. */
function utcDay(date: string): number | null {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;
  return Date.UTC(year, month - 1, day);
}

/** The number of days a trip covers, counting both the start and end date. */
export function tripLengthDays(trip: Pick<NewTrip, "startDate" | "endDate">): number | null {
  const start = utcDay(trip.startDate);
  const end = utcDay(trip.endDate);
  if (start === null || end === null) return null;
  return Math.round((end - start) / MS_PER_DAY) + 1;
}

/** Days from today until the trip starts. Negative when the trip has already started. */
export function daysUntilStart(trip: Pick<NewTrip, "startDate">): number | null {
  const start = utcDay(trip.startDate);
  if (start === null) return null;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((start - today) / MS_PER_DAY);
}
