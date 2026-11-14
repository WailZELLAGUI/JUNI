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
  if (id === 'rosetta')
    return (
      <>
        <g style={f}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 40 - i * 15;
            const w = 50 - i * 6;
            return <path key={i} d={`M${-w} ${y + 8}Q0 ${y - 26} ${w} ${y + 8}Q0 ${y - 8} ${-w} ${y + 8}Z`} />;
          })}
          <path transform="translate(0 -56) scale(1.300)" d={HEART} />
        </g>
        <path className="s" style={{ stroke: `var(--${liquid})` }} strokeWidth="3" d="M0 52V-40" />
      </>
    );
  if (id === 'swirl')
    return <path className="s" style={{ stroke: `var(--${foam})` }} strokeWidth="9" d="M0 0c8-12 28-6 26 10s-30 28-46 8s-2-56 32-56s58 30 50 62s-46 52-78 38" />;
  if (id === 'marshmallows')
    return (
      <>
        <g className="f-white"><rect x="-34" y="-30" width="30" height="26" rx="9" transform="rotate(-14 -19 -17)" /><rect x="6" y="-8" width="30" height="26" rx="9" transform="rotate(18 21 5)" /><rect x="-30" y="16" width="30" height="26" rx="9" transform="rotate(8 -15 29)" /></g>
        <g className="f-pink"><rect x="4" y="-44" width="26" height="22" rx="8" transform="rotate(24 17 -33)" /><rect x="8" y="28" width="26" height="22" rx="8" transform="rotate(-20 21 39)" /></g>
      </>
    );
  if (id === 'drizzle')
    return <path className="s" style={{ stroke: 'var(--caramel)' }} strokeWidth="6" d="M-58 -44L52 -26L-62 -6L60 12L-54 32L44 52" />;
  if (id === 'sprinkles') {
    const colors = ['pink-deep', 'sun', 'matcha-deep', 'white', 'ube'];
    return (
      <>
        {Array.from({ length: 16 }, (_, i) => {
          const a = i * 2.4;
          const r = 18 + 15 * Math.sqrt(i);
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          return <rect key={i} style={{ fill: `var(--${colors[i % 5]})` }} x={x - 6} y={y - 2} width="12" height="4.500" rx="2.200" transform={`rotate(${i * 47} ${x} ${y})`} />;
        })}
      </>
    );
  }
  if (id === 'cocoa')
    return (
      <g style={{ fill: 'var(--cocoa)' }} opacity=".8">
        {Array.from({ length: 46 }, (_, i) => {
          const a = i * 2.4;
          const r = 10 * Math.sqrt(i + 0.500);
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={i % 3 === 0 ? 3.200 : 2.200} />;
        })}
      </g>
    );
  if (id === 'sugarheart') return <path className="f-pink-deep" transform="scale(1.800) translate(0 -2)" d={HEART} />;
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
