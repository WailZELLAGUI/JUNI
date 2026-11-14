import { useCallback, useMemo, useState } from 'react';
import type { ArtId } from './content/drinks';
import { CARD, rewards } from './content/rewards';
import { StickerDefs } from './art/stickers';
import { dateKey, now, planFor, timeOfDay } from './game/daily';
import { clear, load, store, type Save } from './game/storage';
import { play } from './game/sound';
import { Shop } from './scenes/Shop';
import { Make } from './scenes/Make';
import { Gift, Note } from './scenes/Note';
import { LetterBox, StampCard, StickerBook, unlockedRewards } from './ui/Sheets';

type Phase = 'shop' | 'make' | 'note' | 'gift';
type SheetId = 'letters' | 'stickers' | 'stamps';

// Adding ?reset to the link starts the shop from an empty save.
if (new URLSearchParams(location.search).has('reset')) clear();

// The preview build can jump a day forward, so surprises can be tested without waiting.
const TESTING = !!import.meta.env.VITE_PREVIEW;

export function App() {
  const [save, setSave] = useState<Save>(load);
  const [phase, setPhase] = useState<Phase>('shop');
  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [reward, setReward] = useState<string | undefined>();
  const [leaving, setLeaving] = useState(false);
  const [skip, setSkip] = useState(0);

  const today = useMemo(() => now(skip), [skip]);
  const key = dateKey(today);
  const time = timeOfDay(today);
  const record = save.days[key];
  const count = Object.keys(save.days).length;
  // The plan is fixed while the day is being played, so the note cannot shift mid-order.
  const plan = useMemo(() => planFor(key, save), [key, record === undefined]); // eslint-disable-line react-hooks/exhaustive-deps
  const decor = unlockedRewards(save).flatMap((r) => (r.kind === 'decor' ? [r.id] : []));

  const serve = (art: ArtId) => {
    const next: Save = {
      ...save,
      days: { ...save.days, [key]: { title: plan.title, note: plan.note, drink: plan.drink.name, art, sticker: plan.sticker } },
      stickers: { ...save.stickers, [plan.sticker]: (save.stickers[plan.sticker] ?? 0) + 1 },
    };
    setSave(next);
    store(next);
    setReward(plan.sticker);
    setLeaving(true);
    setPhase('note');
    play('chime');
  };

  const gift = reward && count % CARD === 0 ? rewards[count / CARD - 1] : undefined;
  const closeSheet = useCallback(() => setSheet(null), []);

  return (
    <div className="stage" data-time={time}>
      <StickerDefs />
      <div className="frame">
        {phase === 'shop' && (
          <Shop
            key={key}
            plan={plan}
            time={time}
            served={!!record}
            nini={record ? (leaving ? 'out' : 'gone') : 'in'}
            decor={decor}
            onSkip={TESTING ? () => { setLeaving(false); setSkip((n) => n + 1); } : undefined}
            onStart={() => setPhase('make')}
            onReadNote={() => {
              setReward(undefined);
              setLeaving(false);
              setPhase('note');
            }}
            onOpen={setSheet}
          />
        )}
        {phase === 'make' && <Make drink={plan.drink} onServe={serve} />}
        {phase === 'note' && (
          <Note
            title={record?.title ?? plan.title}
            text={record?.note ?? plan.note}
            reward={reward}
            stamps={count % CARD || CARD}
            onClose={() => setPhase(gift ? 'gift' : 'shop')}
          />
        )}
        {phase === 'gift' && gift && <Gift reward={gift} onClose={() => setPhase('shop')} />}
      </div>
      {sheet === 'letters' && <LetterBox save={save} onClose={closeSheet} />}
      {sheet === 'stickers' && <StickerBook save={save} onClose={closeSheet} />}
      {sheet === 'stamps' && <StampCard save={save} onClose={closeSheet} />}
    </div>
  );
}
