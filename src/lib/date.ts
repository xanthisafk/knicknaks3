export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function countLeapDays(birthDate: Date, toDate: Date): number {
  let count = 0;
  for (let y = birthDate.getFullYear(); y <= toDate.getFullYear(); y++) {
    if (isLeapYear(y)) {
      const leapDay = new Date(y, 1, 29);
      if (leapDay >= birthDate && leapDay <= toDate) count++;
    }
  }
  return count;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseDateLocal(str: string): Date {
  // Parse YYYY-MM-DD as local date to avoid timezone offset issues
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(str: string): string {
  if (!str) return "";
  const d = parseDateLocal(str);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}