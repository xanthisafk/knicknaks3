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