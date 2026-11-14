import { Sticker, stickers, HEART } from '../art/stickers';
import { CARD, type Reward } from '../content/rewards';

export function Stamps({ filled, fresh }: { filled: number; fresh?: boolean }) {
  return (
    <div className="stamps" role="img" aria-label={`${filled} of ${CARD} stamps`}>
      {Array.from({ length: CARD }, (_, i) => (
        <span key={i} className={i < filled ? (fresh && i === filled - 1 ? 'stamp on new' : 'stamp on') : 'stamp'}>
          {i < filled && <svg viewBox="-16 -16 32 32" aria-hidden="true"><path className="f-white" transform="translate(0 -2)" d={HEART} /></svg>}
        </span>
      ))}
    </div>
  );
}

type Props = { title?: string; text: string; reward?: string; stamps?: number; onClose: () => void };

// Nini's note, and on the first reading of the day, the sticker and stamp that come with it.
export function Note({ title, text, reward, stamps, onClose }: Props) {
  return (
    <div className="scene note">
      <div className="note-card">
        <span className="small">{title ?? 'A note from Nini'}</span>
        <p className="note-text">{text}</p>
        <p className="note-sign">Nini</p>
      </div>
      {reward && (
        <div className="reward">
          <Sticker id={reward} wobble />
          <p><strong>{stickers[reward]?.name}</strong> is yours. A new sticker for your book.</p>
        </div>
      )}
      {reward && stamps !== undefined && (
        <div className="stamps-line">
          <Stamps filled={stamps} fresh />
        </div>
      )}
      <button type="button" className="btn note-close" onClick={onClose}>
        {reward ? (stamps === CARD ? 'Your card is full, open the surprise' : 'Keep them') : 'Back to the shop'}
      </button>
    </div>
  );
}

// Shown when a stamp card fills up.
export function Gift({ reward, onClose }: { reward: Reward; onClose: () => void }) {
  return (
    <div className="scene note gift">
      <h1 className="gift-title">{reward.kind === 'letter' ? 'A secret letter' : 'A gift for the shop'}</h1>
      <div className="note-card">
        <span className="small">{reward.name}</span>
        <p className={reward.kind === 'letter' ? 'note-text long' : 'note-text'}>{reward.text}</p>
        <p className="note-sign">Nini</p>
      </div>
      <button type="button" className="btn note-close" onClick={onClose}>Back to the shop</button>
    </div>
  );
}
