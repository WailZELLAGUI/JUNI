import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MiniCup } from '../art/MiniCup';
import { drinks } from '../content/drinks';
import { quickReplies } from '../content/reactions';
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
              {day.reply && <p className="replied">You replied: {day.reply}</p>}
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

const drinkOf = (day: { drink: string; drinkId?: string }) => drinks.find((d) => d.id === day.drinkId) ?? drinks.find((d) => d.name === day.drink);

export function Album({ save, onClose }: { save: Save; onClose: () => void }) {
  const days = Object.entries(save.days).sort(([a], [b]) => (a < b ? 1 : -1));
  return (
    <Sheet title="Drink album" sub={days.length === 1 ? '1 drink made for Nini' : `${days.length} drinks made for Nini`} onClose={onClose}>
      {days.length === 0 ? (
        <p className="empty">Every drink you make is kept here, with the art you gave it. Serve today's order to start the album.</p>
      ) : (
        <ul className="album">
          {days.map(([key, day]) => (
            <li key={key}>
              <MiniCup drink={drinkOf(day)} art={day.art} strokes={day.strokes} />
              <strong>{day.drink}</strong>
              <span className="small">{new Date(key + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

// Juju writes back. The reply is kept with the day's note, and the phone's own share
// sheet sends it to Nini through whichever app she likes.
export function Reply({ current, onSave, onClose }: { current?: string; onSave: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState(current ?? '');
  const [state, setState] = useState<'idle' | 'kept' | 'copied'>('idle');
  const clean = text.trim();

  const send = async () => {
    if (!clean) return;
    onSave(clean);
    try {
      if (navigator.share) {
        await navigator.share({ text: clean });
        setState('kept');
      } else {
        await navigator.clipboard.writeText(clean);
        setState('copied');
      }
    } catch {
      // She closed the share sheet, or sharing is not available here. The reply is still kept.
      setState('kept');
    }
  };

  return (
    <Sheet title="Reply to Nini" sub="Pick one, or write your own" onClose={onClose}>
      <div className="chips">
        {quickReplies.map((q) => (
          <button key={q} type="button" className={'btn soft' + (clean === q ? ' on' : '')} aria-pressed={clean === q} onClick={() => { setText(q); setState('idle'); }}>{q}</button>
        ))}
      </div>
      <label className="small" htmlFor="reply-text">Your reply</label>
      <textarea id="reply-text" rows={3} maxLength={280} value={text} onChange={(e) => { setText(e.target.value); setState('idle'); }} placeholder="Write something for Nini" />
      <button type="button" className="btn" disabled={!clean} onClick={send}>Share it with Nini</button>
      <p className="small" role="status">
        {state === 'kept' && 'Your reply is kept with today\'s note.'}
        {state === 'copied' && 'Copied. Paste it into a message to Nini. It is also kept with today\'s note.'}
        {state === 'idle' && 'This opens your messages so you can send it to him.'}
      </p>
    </Sheet>
  );
}
