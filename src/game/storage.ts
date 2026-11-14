// Everything JUNI remembers lives in this one object, saved on the device.

export type DayRecord = { title?: string; note: string; drink: string; art: string; sticker: string };
export type Save = { v: 1; days: Record<string, DayRecord>; stickers: Record<string, number> };

const KEY = 'juni.save.v1';
const empty = (): Save => ({ v: 1, days: {}, stickers: {} });

export function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw);
    if (data && data.v === 1 && data.days && data.stickers) return data as Save;
  } catch {
    // Storage can be blocked or cleared. The shop still opens, just with a fresh book.
  }
  return empty();
}

export function store(save: Save): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Nothing to do: the day still plays, it just will not be remembered.
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Same as above.
  }
}
