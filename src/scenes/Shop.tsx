import { useEffect, useState } from 'react';
import { ShopArt, type NiniState } from '../art/ShopArt';
import { Sticker, stickers } from '../art/stickers';
import { longDate, type Mood, type Plan, type TimeOfDay } from '../game/daily';
import { play, setSound, soundLevel, type Level } from '../game/sound';

const HELLO: Record<TimeOfDay, string> = {
  morning: 'Good morning, Juju',
  day: 'Good afternoon, Juju',
  evening: 'Good evening, Juju',
  night: 'Sweet night, Juju',
};
const SOUND = ['Sound off', 'Sound on', 'Sound and music'];

export type SheetId = 'letters' | 'stickers' | 'stamps' | 'album';

type Props = {
  plan: Plan;
  time: TimeOfDay;
  mood: Mood;
  served: boolean;
  nini: NiniState;
  decor: string[];
  // Set while Nini is tasting the drink Juju just served.
  sip?: { line: string; color: string };
  // Tchipo's find for today, if he has one and it has not been collected.
  bonus?: string;
  found?: string;
  onPet: () => void;
  onSkip?: () => void;
  onStart: () => void;
  onReadNote: () => void;
  onOpen: (sheet: SheetId) => void;
};

export function Shop({ plan, time, mood, served, nini, decor, sip, bonus, found, onPet, onSkip, onStart, onReadNote, onOpen }: Props) {
  const [sound, setSoundState] = useState<Level>(soundLevel);
  // The door bell, as Nini reaches the counter.
  useEffect(() => {
    if (served || sip) return;
    const t = setTimeout(() => play('bell'), 1900);
    return () => clearTimeout(t);
  }, [served, sip]);

  return (
    <div className="scene shop">
      <ShopArt time={time} nini={sip ? 'here' : nini} decor={decor} mood={mood} sparkle={!!bonus} cup={sip?.color} onPet={onPet} />
      <h1 className="mark">JUNI</h1>
      <button
        type="button"
        className="btn soft sound"
        onClick={() => {
          const next = ((sound + 1) % 3) as Level;
          setSound(next);
          setSoundState(next);
        }}
      >
        {SOUND[sound]}
      </button>
      <p className="hello">{HELLO[time]}</p>
      <p className="date">{longDate(plan.key)}</p>

      {found && (
        <div className="found" key={found} role="status">
          <Sticker id={found} />
          <p><strong>Tchipo found something.</strong> {stickers[found]?.name} is in your sticker book.</p>
        </div>
      )}

      {sip ? (
        <>
          <p className="bubble">{sip.line}</p>
          <div className="slip sip">
            <span className="small">Nini is taking his first sip</span>
            <button type="button" className="btn" onClick={onReadNote}>Read his note</button>
          </div>
        </>
      ) : (
        <>
          <div className={served ? 'slip' : 'slip late'} key={served ? 'served' : 'order'}>
            {served ? (
              <>
                <span className="small">Today's order is served</span>
                <span className="what">Nini left happy. Come back tomorrow for a new order.</span>
                <button type="button" className="btn" onClick={onReadNote}>Read today's note</button>
              </>
            ) : (
              <>
                <span className="small">An order from Nini</span>
                <span className="what">{plan.order}</span>
                <button type="button" className="btn" onClick={onStart}>Start making it</button>
              </>
            )}
          </div>

          {onSkip && served && (
            <div className="test"><button type="button" className="btn soft" onClick={onSkip}>Test only: jump to tomorrow</button></div>
          )}

          <div className="shelf-nav">
            <button type="button" className="btn soft" onClick={() => onOpen('letters')}>Letters</button>
            <button type="button" className="btn soft" onClick={() => onOpen('album')}>Album</button>
            <button type="button" className="btn soft" onClick={() => onOpen('stickers')}>Stickers</button>
            <button type="button" className="btn soft" onClick={() => onOpen('stamps')}>Stamps</button>
          </div>
        </>
      )}
    </div>
  );
}
