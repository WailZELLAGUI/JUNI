import { useCallback, useEffect, useMemo, useState } from 'react';
import { CARD, rewards } from './content/rewards';
import { reactions } from './content/reactions';
import { StickerDefs } from './art/stickers';
import { bonusSticker, dateKey, moodFor, now, planFor, timeOfDay } from './game/daily';
import { clear, load, store, type Save } from './game/storage';
import { play } from './game/sound';
import { Home } from './scenes/Home';
import { Shop, type SheetId } from './scenes/Shop';
import { Make } from './scenes/Make';
import { Gift, Note } from './scenes/Note';
import { Album, LetterBox, Reply, StampCard, StickerBook, unlockedRewards } from './ui/Sheets';

type Phase = 'home' | 'shop' | 'make' | 'sip' | 'note' | 'gift';

// Adding ?reset to the link starts the shop from an empty save.
if (new URLSearchParams(location.search).has('reset')) clear();

// The preview build can jump a day forward, so surprises can be tested without waiting.
const TESTING = !!import.meta.env.VITE_PREVIEW;

export function App() {
  const [save, setSave] = useState<Save>(load);
  const [phase, setPhase] = useState<Phase>('home');
  const [sheet, setSheet] = useState<SheetId | 'reply' | null>(null);
  const [reward, setReward] = useState<string | undefined>();
  const [leaving, setLeaving] = useState(false);
  const [found, setFound] = useState<string | undefined>();
  const [skip, setSkip] = useState(0);
  const [wakes, setWakes] = useState(0);

  const today = useMemo(() => now(skip), [skip, wakes]);
  const key = dateKey(today);
  const time = timeOfDay(today);
  const mood = useMemo(() => moodFor(key), [key]);
  const record = save.days[key];
  const count = Object.keys(save.days).length;
  // The plan is fixed while the day is being played, so the note cannot shift mid-order.
  const plan = useMemo(() => planFor(key, save), [key, record === undefined]); // eslint-disable-line react-hooks/exhaustive-deps
  const decor = unlockedRewards(save).flatMap((r) => (r.kind === 'decor' ? [r.id] : []));
  const bonus = mood.lucky && !save.bonus?.[key] ? bonusSticker(key, save) : undefined;

  const commit = (next: Save) => {
    setSave(next);
    store(next);
  };

  const serve = (art: string, strokes: string[]) => {
    commit({
      ...save,
      days: { ...save.days, [key]: { title: plan.title, note: plan.note, drink: plan.drink.name, drinkId: plan.drink.id, art, strokes, sticker: plan.sticker } },
      stickers: { ...save.stickers, [plan.sticker]: (save.stickers[plan.sticker] ?? 0) + 1 },
    });
    setReward(plan.sticker);
    setLeaving(true);
    setPhase('sip');
    play('chime');
  };

  // On a lucky day, the first time Tchipo is petted he hands over a sticker.
  const pet = () => {
    if (!bonus) return;
    commit({ ...save, stickers: { ...save.stickers, [bonus]: (save.stickers[bonus] ?? 0) + 1 }, bonus: { ...save.bonus, [key]: bonus } });
    setFound(bonus);
    play('chime');
  };

  const reply = (text: string) => {
    if (record) commit({ ...save, days: { ...save.days, [key]: { ...record, reply: text } } });
  };

  const gift = reward && count % CARD === 0 ? rewards[count / CARD - 1] : undefined;
  const closeSheet = useCallback(() => setSheet(null), []);
  const picked = record?.art.split('+') ?? [];
  const line = reactions[picked.includes('drawn') ? 'drawn' : picked[0]] ?? 'This is the best one yet.';

  // If JUNI was left open overnight, start the new day as soon as Juju comes back to it.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === 'visible' && (phase === 'shop' || phase === 'home') && dateKey(now(skip)) !== key) {
        setLeaving(false);
        setReward(undefined);
        setFound(undefined);
        setWakes((n) => n + 1);
      }
    };
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    return () => {
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
    };
  }, [phase, skip, key]);

  return (
    <div className="stage" data-time={time} data-rain={mood.rain || undefined}>
      <StickerDefs />
      <div className="frame">
        {phase === 'home' && (
          <Home time={time} dateKey={key} served={!!record} onOpen={() => { play('pop'); setPhase('shop'); }} />
        )}
        {(phase === 'shop' || phase === 'sip') && (
          <Shop
            key={key + phase}
            plan={plan}
            time={time}
            mood={mood}
            served={!!record}
            nini={record ? (leaving ? 'out' : 'gone') : 'in'}
            decor={decor}
            sip={phase === 'sip' ? { line, color: plan.drink.mixed } : undefined}
            bonus={bonus}
            found={found}
            onPet={pet}
            onSkip={TESTING ? () => { setLeaving(false); setFound(undefined); setSkip((n) => n + 1); } : undefined}
            onStart={() => setPhase('make')}
            onReadNote={() => {
              if (phase !== 'sip') {
                setReward(undefined);
                setLeaving(false);
              }
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
            reply={record?.reply}
            onReply={() => setSheet('reply')}
            onClose={() => setPhase(gift ? 'gift' : 'shop')}
          />
        )}
        {phase === 'gift' && gift && <Gift reward={gift} onClose={() => setPhase('shop')} />}
      </div>
      {sheet === 'letters' && <LetterBox save={save} onClose={closeSheet} />}
      {sheet === 'stickers' && <StickerBook save={save} onClose={closeSheet} />}
      {sheet === 'stamps' && <StampCard save={save} onClose={closeSheet} />}
      {sheet === 'album' && <Album save={save} onClose={closeSheet} />}
      {sheet === 'reply' && <Reply note={record?.note ?? plan.note} current={record?.reply} onSave={reply} onClose={closeSheet} />}
    </div>
  );
}
