import type { ArtId } from '../content/drinks';
import { HEART } from './stickers';

// Latte art, drawn around 0,0. `foam` and `liquid` are colour token names.
export function LatteArt({ id, foam, liquid }: { id: ArtId; foam: string; liquid: string }) {
  const f = { fill: `var(--${foam})` };
  const l = { fill: `var(--${liquid})` };
  if (id === 'cream')
    return (
      <>
        <g className="f-white"><circle cx="-22" cy="12" r="22" /><circle cx="22" cy="12" r="22" /><circle cx="0" cy="26" r="22" /><circle cx="0" cy="-8" r="26" /></g>
        <g className="f-cream"><circle cx="0" cy="2" r="18" /></g>
        <circle className="f-white" cx="0" cy="-4" r="11" />
      </>
    );
  if (id === 'berries')
    return (
      <>
        <g className="f-pink-deep"><circle cx="-18" cy="10" r="20" /><circle cx="20" cy="12" r="18" /><circle cx="2" cy="-18" r="19" /></g>
        <g className="f-white"><circle cx="-22" cy="6" r="2" /><circle cx="-12" cy="16" r="2" /><circle cx="22" cy="8" r="2" /><circle cx="0" cy="-22" r="2" /><circle cx="8" cy="-12" r="2" /></g>
        <path className="f-matcha-deep" d="M-8 -34l10 6 10-6-3-9-7 5-7-5Z" />
      </>
    );
  if (id === 'mango')
    return (
      <g style={{ fill: 'var(--mango)' }}>
        <rect x="-32" y="-4" width="26" height="26" rx="6" transform="rotate(-12 -19 9)" />
        <rect x="6" y="2" width="26" height="26" rx="6" transform="rotate(14 19 15)" />
        <rect x="-12" y="-34" width="26" height="26" rx="6" transform="rotate(6 1 -21)" />
      </g>
    );
  if (id === 'mint')
    return (
      <>
        <ellipse className="f-matcha-deep" cx="-14" cy="0" rx="14" ry="30" transform="rotate(-32 -14 0)" />
        <ellipse className="f-matcha" cx="14" cy="0" rx="14" ry="30" transform="rotate(32 14 0)" />
        <path className="s s-white" strokeWidth="2.500" opacity=".6" d="M-24 -18l20 36M24 -18l-20 36" />
      </>
    );
  if (id === 'heart') return <path style={f} transform="scale(3.300) translate(0 -2)" d={HEART} />;
  if (id === 'tulip')
    return (
      <g style={{ ...f, stroke: `var(--${liquid})`, strokeWidth: 1.6 }}>
        <path transform="translate(0 20) scale(2.600)" d={HEART} />
        <path transform="translate(0 -8) scale(2)" d={HEART} />
        <path transform="translate(0 -32) scale(1.400)" d={HEART} />
      </g>
    );
  if (id === 'bear')
    return (
      <>
        <g style={f}><circle cx="-26" cy="-26" r="13" /><circle cx="26" cy="-26" r="13" /><circle cy="4" r="36" /></g>
        <g style={l}><circle cx="-13" cy="-3" r="4" /><circle cx="13" cy="-3" r="4" /><ellipse cx="0" cy="12" rx="6" ry="4.500" /></g>
      </>
    );
  return (
    <>
      <g style={f}><circle cx="0" cy="-26" r="17" /><circle cx="25" cy="-8" r="17" /><circle cx="15" cy="21" r="17" /><circle cx="-15" cy="21" r="17" /><circle cx="-25" cy="-8" r="17" /></g>
      <circle style={l} r="10" />
    </>
  );
}
