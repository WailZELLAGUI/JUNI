import { notes, specials } from '../content/messages';
import { drinks, type Drink } from '../content/drinks';
import { stickerIds } from '../art/stickers';
import type { Save } from './storage';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type Plan = { key: string; drink: Drink; order: string; title?: string; note: string; sticker: string };

const pad = (n: number) => String(n).padStart(2, '0');

// Adding ?day=2026-12-23 to the link previews any date.
export function now(skipDays = 0): Date {
  if (skipDays) {
    const d = now();
    d.setDate(d.getDate() + skipDays);
    return d;
  }
  const forced = new URLSearchParams(location.search).get('day');
  if (forced && /^\d{4}-\d{2}-\d{2}$/.test(forced)) return new Date(forced + 'T08:00:00');
  return new Date();
}

export const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function timeOfDay(d: Date): TimeOfDay {
  const h = d.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

export function longDate(key: string): string {
  return new Date(key + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], seed: number): T[] {
  const out = items.slice();
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// The same date always gives the same order. Notes and stickers skip anything
// Juju already has, so nothing repeats until the whole set has been seen.
export function planFor(key: string, save: Save): Plan {
  const n = dayNumber(key);
  const special = specials[key.slice(5)];
  // The menu runs in one fixed shuffled order, so the same drink never comes twice in a row.
  const drink = shuffled(drinks, 97)[n % drinks.length];
  const order = special?.order ?? drink.orders[Math.floor(n / drinks.length) % drink.orders.length];

  const seen = new Set(Object.entries(save.days).filter(([k]) => k !== key).map(([, d]) => d.note));
  const pool = shuffled(Object.values(notes).flat(), 2311);
  const start = n % pool.length;
  let note = pool[start];
  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[(start + i) % pool.length];
    if (!seen.has(candidate)) {
      note = candidate;
      break;
    }
  }

  const order2 = shuffled(stickerIds, 611);
  const sticker = order2.find((id) => !save.stickers[id]) ?? order2[n % order2.length];

  return { key, drink, order, title: special?.title, note: special?.text ?? note, sticker };
}
