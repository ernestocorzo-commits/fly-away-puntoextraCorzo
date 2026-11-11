const keyFor = (email: string) => `bookings:${email}`;

export function getBookingIds(email: string): number[] {
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? '[]');
  } catch {
    return [];
  }
}

export function addBookingId(email: string, id: number): void {
  const ids = getBookingIds(email);
  if (!ids.includes(id)) {
    localStorage.setItem(keyFor(email), JSON.stringify([...ids, id]));
  }
}