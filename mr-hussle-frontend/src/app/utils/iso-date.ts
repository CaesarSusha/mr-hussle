// The backend stores due dates as `LocalDate` and sends them as 'yyyy-MM-dd' strings.
// The Material datepicker works with `Date` objects. These helpers convert between the two
// in *local* time: `toISOString()` / `new Date('yyyy-MM-dd')` would use UTC and could shift
// the date by one day depending on the time zone.

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
