import type { ArtId, Drink } from '../content/drinks';
import { LatteArt } from './LatteArt';

// A finished drink seen from above: used in the album and anywhere a served cup is shown.
export function MiniCup({ drink, art, strokes }: { drink?: Drink; art: string; strokes?: string[] }) {
  const mixed = drink?.mixed ?? 'coffee-milk';
  const foam = drink?.foam ?? 'milk';
  const last = drink?.steps[drink.steps.length - 1];
  const ink = last && last.kind === 'choose' && last.multi ? 'caramel' : foam;
  const ids = art.split('+').filter((id) => id && id !== 'drawn') as ArtId[];
  return (
    <svg className="minicup" viewBox="-150 -150 300 300" role="img" aria-label={drink?.name ?? 'A drink'}>
      <circle className="f-white" r="148" /><circle className="f-cream" r="134" /><circle className="f-white" r="122" />
      <circle style={{ fill: `var(--${mixed})` }} r="110" />
      <circle className="s" style={{ stroke: `var(--${foam})` }} strokeWidth="7" opacity=".45" r="106" />
      {ids.map((id) => <g key={id}><LatteArt id={id} foam={foam} liquid={mixed} /></g>)}
      {(strokes ?? []).map((pts, i) => <polyline key={i} className="s" style={{ stroke: `var(--${ink})` }} strokeWidth="9" points={pts.includes(' ') ? pts : `${pts} ${pts}`} />)}
    </svg>
  );
}
