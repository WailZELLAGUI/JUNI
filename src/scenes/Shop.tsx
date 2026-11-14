import { ShopArt, type NiniState } from '../art/ShopArt';
import { useEffect, useState } from 'react';
import { longDate, type Plan, type TimeOfDay } from '../game/daily';
import { play, setSound, soundOn } from '../game/sound';

const HELLO: Record<TimeOfDay, string> = {
  morning: 'Good morning, Juju',
  day: 'Good afternoon, Juju',
  evening: 'Good evening, Juju',
  night: 'Sweet night, Juju',
};

type Props = {
  plan: Plan;
  time: TimeOfDay;
  served: boolean;
  nini: NiniState;
  decor: string[];
  onSkip?: () => void;
  onStart: () => void;
  onReadNote: () => void;
  onOpen: (sheet: 'letters' | 'stickers' | 'stamps') => void;
};

export function Shop({ plan, time, served, nini, decor, onSkip, onStart, onReadNote, onOpen }: Props) {
  const [sound, setSoundState] = useState(soundOn);
  // The door bell, as Nini reaches the counter.
  useEffect(() => {
    if (served) return;
    const t = setTimeout(() => play('bell'), 1900);
    return () => clearTimeout(t);
  }, [served]);

  return (
    <div className="scene shop">
      <ShopArt time={time} nini={nini} decor={decor} />
      <h1 className="mark">JUNI</h1>
      <button
        type="button"
        className="btn soft sound"
        aria-pressed={sound}
        onClick={() => {
          setSound(!sound);
          setSoundState(!sound);
        }}
      >
        {sound ? 'Sound on' : 'Sound off'}
      </button>
      <p className="hello">{HELLO[time]}</p>
      <p className="date">{longDate(plan.key)}</p>

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
        <button type="button" className="btn soft" onClick={() => onOpen('stickers')}>Stickers</button>
        <button type="button" className="btn soft" onClick={() => onOpen('stamps')}>Stamps</button>
      </div>
    </div>
  );
}
