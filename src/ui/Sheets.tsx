import { useEffect, useRef, type ReactNode } from 'react';
import { Sticker, stickerIds, stickers } from '../art/stickers';
import { longDate } from '../game/daily';
import type { Save } from '../game/storage';
import { CARD, rewards } from '../content/rewards';
import { Stamps } from '../scenes/Note';

const served = (save: Save) => Object.keys(save.days).length;
export const unlockedRewards = (save: Save) => rewards.slice(0, Math.floor(served(save) / CARD));

function Sheet({ title, sub, onClose, children }: { title: string; sub: string; onClose: () => void; children: ReactNode }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet-back" onClick={onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <div>
            <h2>{title}</h2>
            <p className="small">{sub}</p>
          </div>
          <button ref={close} type="button" className="btn soft" onClick={onClose}>Close</button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function LetterBox({ save, onClose }: { save: Save; onClose: () => void }) {
  const days = Object.entries(save.days).sort(([a], [b]) => (a < b ? 1 : -1));
  const sub = days.length === 1 ? '1 note from Nini' : `${days.length} notes from Nini`;
  const secret = unlockedRewards(save).filter((r) => r.kind === 'letter');
  return (
    <Sheet title="Letter box" sub={sub} onClose={onClose}>
      {secret.length > 0 && (
        <ul className="letters">
          {secret.map((r) => (
            <li key={r.name}>
              <span className="small">Secret letter, {r.name.toLowerCase()}</span>
              <p className="note-text">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
      {days.length === 0 ? (
        <p className="empty">Your letter box is waiting for its first note. Serve today's order and Nini will leave one.</p>
      ) : (
        <ul className="letters">
          {days.map(([key, day]) => (
            <li key={key}>
              <span className="small">{longDate(key)}, {day.drink.toLowerCase()}</span>
              <p className="note-text">{day.note}</p>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

export function StickerBook({ save, onClose }: { save: Save; onClose: () => void }) {
  const have = stickerIds.filter((id) => save.stickers[id]).length;
  return (
    <Sheet title="Sticker book" sub={`${have} of ${stickerIds.length} collected`} onClose={onClose}>
      <ul className="book">
        {stickerIds.map((id) => {
          const count = save.stickers[id] ?? 0;
          return (
            <li key={id} className={count ? 'got' : 'missing'}>
              {count ? <Sticker id={id} /> : <span className="slot" aria-label="Not collected yet" />}
              <span className="small">{count ? stickers[id].name : 'Soon'}{count > 1 ? `, ${count}` : ''}</span>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}

export function StampCard({ save, onClose }: { save: Save; onClose: () => void }) {
  const count = served(save);
  const filled = count % CARD || (count ? CARD : 0);
  const left = CARD - (count % CARD);
  const got = unlockedRewards(save);
  const more = got.length < rewards.length;
  return (
    <Sheet title="Stamp card" sub={`${count} ${count === 1 ? 'order' : 'orders'} served`} onClose={onClose}>
      <Stamps filled={filled} />
      <p className="empty">
        {more ? `${left} more ${left === 1 ? 'order' : 'orders'} until the next surprise from Nini.` : 'Every surprise so far is yours. Nini is planning more.'}
      </p>
      {got.length > 0 && (
        <ul className="unlocked">
          {got.map((r) => (
            <li key={r.name}>
              <span className="small">{r.kind === 'letter' ? 'Secret letter, in your letter box' : 'In the shop'}</span>
              <strong>{r.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
