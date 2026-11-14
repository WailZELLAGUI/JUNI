import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { ArtId, Drink } from '../content/drinks';
import { LatteArt } from '../art/LatteArt';
import { play, startPour, stopPour } from '../game/sound';

const PRAISE = ['Perfect', 'Just right', 'Lovely', 'So good', 'Beautiful'];
const fill = (token: string) => ({ fill: `var(--${token})` });
const GLASS_H = 190;
const FLOOR_Y = 448;
const CUP_Y = 296;
// Resting places for ice cubes in the glass: x, y, tilt.
const ICE: [number, number, number][] = [[146, 410, -10], [196, 406, 14], [170, 372, 6]];

export function Make({ drink, onServe }: { drink: Drink; onServe: (art: ArtId) => void }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [taps, setTaps] = useState(0);
  const [art, setArt] = useState<ArtId | null>(null);
  const [whisk, setWhisk] = useState({ x: 195, y: CUP_Y, on: false });
  const last = useRef<{ x: number; y: number } | null>(null);

  const step = drink.steps[index];
  const complete = progress >= 1;
  const topView = step.kind === 'stir' || step.kind === 'choose';

  // A finished step rests for a moment, then the next one arrives by itself.
  useEffect(() => {
    if (!complete || step.kind === 'choose') return;
    setHolding(false);
    play('ding');
    const t = setTimeout(() => {
      setIndex((i) => i + 1);
      setProgress(0);
    }, 850);
    return () => clearTimeout(t);
  }, [complete, step.kind]);

  useEffect(() => {
    if (!holding) return;
    startPour();
    let raf = 0;
    let before = performance.now();
    const tick = (t: number) => {
      const dt = t - before;
      before = t;
      setProgress((p) => Math.min(1, p + dt / 2300));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopPour();
    };
  }, [holding]);

  // Liquid layers, bottom to top: finished steps in full, the current one so far.
  const layers: { color: string; amount: number }[] = [];
  let cubes = 0;
  drink.steps.forEach((s, i) => {
    if (i > index || (s.kind !== 'tap' && s.kind !== 'hold')) return;
    if (s.kind === 'tap' && s.ice) {
      cubes = i < index ? s.count : Math.round(Math.min(1, progress) * s.count);
      return;
    }
    layers.push({ color: s.color, amount: s.amount * (i < index ? 1 : Math.min(1, progress)) });
  });
  const total = layers.reduce((sum, l) => sum + l.amount, 0);
  const surface = FLOOR_Y - total * GLASS_H;
  const pour = [...drink.steps].reverse().find((s) => s.kind === 'hold');
  const powder = drink.steps.find((s) => s.kind === 'tap' && !s.ice);
  const pourColor = pour && pour.kind === 'hold' ? pour.color : drink.foam;
  const powderColor = powder && powder.kind === 'tap' ? powder.color : drink.mixed;
  const mix = step.kind === 'choose' ? 1 : Math.min(1, progress);

  const tap = () => {
    if (step.kind !== 'tap' || complete) return;
    setTaps((n) => n + 1);
    play('plop');
    setProgress((p) => Math.min(1, p + 1 / step.count + 0.001));
  };

  const stirMove = (e: RPointerEvent<SVGGElement>) => {
    if (step.kind !== 'stir' || complete || !last.current) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const box = svg.getBoundingClientRect();
    const scale = 390 / box.width;
    const x = (e.clientX - box.left) * scale;
    const y = (e.clientY - box.top) * scale;
    const moved = Math.hypot(x - last.current.x, y - last.current.y);
    last.current = { x, y };
    const dx = x - 195;
    const dy = y - CUP_Y;
    const reach = Math.min(1, 92 / Math.max(1, Math.hypot(dx, dy)));
    setWhisk({ x: 195 + dx * reach, y: CUP_Y + dy * reach, on: true });
    setProgress((p) => Math.min(1, p + moved / 1250));
  };
  const stirStart = (e: RPointerEvent<SVGGElement>) => {
    if (step.kind !== 'stir') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const scale = 390 / box.width;
    last.current = { x: (e.clientX - box.left) * scale, y: (e.clientY - box.top) * scale };
  };
  const stirEnd = () => {
    last.current = null;
    setWhisk((w) => ({ ...w, on: false }));
  };

  let y = FLOOR_Y;

  return (
    <div className="scene make">
      <svg className="art" viewBox="0 0 390 720" aria-hidden={step.kind !== 'stir'}>
        <defs><clipPath id="glass"><path d="M126 258h138l-16 190h-106Z" /></clipPath><clipPath id="cup"><circle cx="195" cy="330" r="108" /></clipPath></defs>
        <rect className="f-wall" x="-300" y="-500" width="990" height="1300" />
        <rect className="f-wall-deep" x="-300" y="380" width="990" height="100" />
        <rect className="f-wood-pale" x="-300" y="478" width="990" height="900" />
        <rect className="f-wood" x="-300" y="482" width="990" height="8" opacity=".55" />
        <rect className="f-cream" x="-300" y="456" width="990" height="28" />

        {!topView && (
          <g className="view" key="side">
            <path className="f-white" opacity=".4" d="M118 250h154l-18 204a8 8 0 0 1-8 7h-102a8 8 0 0 1-8-7Z" />
            <g clipPath="url(#glass)">
              {layers.map((l, i) => {
                const h = l.amount * GLASS_H;
                y -= h;
                return <rect key={i} style={fill(l.color)} x="120" y={y} width="150" height={h + 0.600} />;
              })}
              {ICE.slice(0, cubes).map(([x, cy, r], i) => (
                <rect key={i} className="f-white ice" x={x} y={Math.min(cy, Math.max(262, surface - 8 + i * 10))} width="34" height="34" rx="8" transform={`rotate(${r} ${x + 17} ${cy})`} />
              ))}
              {total > 0.02 && <ellipse className="f-white" opacity=".35" cx="195" cy={surface + 1} rx="72" ry="3" />}
            </g>
            <path className="s s-white" strokeWidth="5" d="M118 250h154l-18 204a8 8 0 0 1-8 7h-102a8 8 0 0 1-8-7Z" />
            <path className="s s-white" strokeWidth="5" opacity=".7" d="M142 280l10 130" />
            {step.kind === 'tap' && taps > 0 && (
              <circle key={taps} className="drop" style={{ ...fill(step.color), ['--fall' as string]: `${(step.ice ? 400 : surface) - 140}px` }} cx="195" cy="140" r="13" />
            )}
            {step.kind === 'hold' && (
              <>
                {holding && !complete && <rect className="stream" style={fill(step.color)} x="228" y="151" width="9" height={Math.max(0, surface - 151)} rx="4" />}
                <g transform="translate(275 150) rotate(-35)">
                  <path className="s s-white" strokeWidth="8" d="M24 -14q20 0 20 14t-20 14" />
                  <rect className="f-white" x="-24" y="-28" width="48" height="58" rx="10" />
                  <path className="f-white" d="M-22 -28l-14 4 14 12Z" />
                  <rect style={fill(step.color)} x="-17" y="-21" width="34" height="9" rx="4" />
                </g>
              </>
            )}
          </g>
        )}

        {topView && (
          <g className="view" key="top">
            <rect className="f-wood-pale" x="-300" y="-500" width="990" height="1900" />
            <g transform={`translate(0 ${CUP_Y - 330})`}>
            <ellipse className="f-wood" opacity=".3" cx="195" cy="352" rx="150" ry="140" />
            <circle className="f-white" cx="195" cy="330" r="148" />
            <circle className="f-cream" cx="195" cy="330" r="134" />
            <circle className="f-white" cx="195" cy="330" r="122" />
            <g clipPath="url(#cup)">
              <circle style={fill(pourColor)} cx="195" cy="330" r="110" />
              <g style={{ ...fill(powderColor), opacity: 1 - mix * 0.9 }}>
                <circle cx="160" cy="300" r="34" /><circle cx="236" cy="352" r="42" /><circle cx="176" cy="386" r="24" />
              </g>
              <circle style={{ ...fill(drink.mixed), opacity: mix }} cx="195" cy="330" r="110" />
              {cubes > 0 && (
                <g className="f-white ice">
                  <rect x="128" y="262" width="46" height="46" rx="11" transform="rotate(-14 151 285)" /><rect x="212" y="282" width="46" height="46" rx="11" transform="rotate(18 235 305)" /><rect x="158" y="352" width="46" height="46" rx="11" transform="rotate(8 181 375)" />
                </g>
              )}
              <g style={{ transform: `rotate(${progress * 620}deg)`, transformOrigin: '195px 330px', opacity: step.kind === 'stir' ? 0.55 : 0 }}>
                <path className="s" style={{ stroke: `var(--${drink.foam})` }} strokeWidth="9" d="M195 330c20-30 60-10 50 25s-70 45-95 5s5-100 60-95" />
              </g>
            </g>
            </g>
            {step.kind === 'choose' && art && (
              <g className="pop" key={art} transform={`translate(195 ${CUP_Y})`}><LatteArt id={art} foam={drink.foam} liquid={drink.mixed} /></g>
            )}
            {step.kind === 'stir' && (
              <g
                className="stir-zone"
                role="button"
                tabIndex={0}
                aria-label="Whisk the drink. Drag in circles, or press Enter."
                onPointerDown={stirStart}
                onPointerMove={stirMove}
                onPointerUp={stirEnd}
                onPointerCancel={stirEnd}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setProgress((p) => Math.min(1, p + 0.15));
                }}
              >
                <circle className="ring" cx="195" cy={CUP_Y} r="150" fill="transparent" />
                <g transform={`translate(${whisk.x} ${whisk.y})`} className={whisk.on ? 'whisk on' : 'whisk'}>
                  <circle className="f-wood" r="17" /><circle className="f-wood-pale" r="9" />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>

      <div className="make-top">
        <p className="small">For Nini</p>
        <h1 className="make-name">{drink.name}</h1>
        <div className="pips" aria-label={`Step ${index + 1} of ${drink.steps.length}`}>
          {drink.steps.map((_, i) => (
            <span key={i} className={i < index || (i === index && complete) ? 'pip done' : i === index ? 'pip now' : 'pip'} />
          ))}
        </div>
      </div>

      {complete && step.kind !== 'choose' && <p className="praise" key={index}>{PRAISE[index % PRAISE.length]}</p>}

      <div className="make-say" key={'say' + index}>
        <h2>{step.title}</h2>
        <p>{step.hint}</p>
      </div>

      <div className="make-ctl" key={'ctl' + index}>
        {step.kind === 'tap' && (
          <button type="button" className="btn big" onClick={tap} disabled={complete}>
            {step.button}
            <span className="count">{Math.min(step.count, Math.round(progress * step.count))} of {step.count}</span>
          </button>
        )}
        {step.kind === 'hold' && (
          <button
            type="button"
            className={'btn big' + (holding ? ' held' : '')}
            disabled={complete}
            onPointerDown={() => setHolding(true)}
            onPointerUp={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            onPointerCancel={() => setHolding(false)}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setHolding(true)}
            onKeyUp={() => setHolding(false)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {step.button}
          </button>
        )}
        {step.kind === 'choose' && (
          <>
            <div className="arts">
              {step.options.map((id) => (
                <button key={id} type="button" className={'art-pick' + (art === id ? ' on' : '')} aria-label={`${id} latte art`} aria-pressed={art === id} onClick={() => { setArt(id); play('pop'); }}>
                  <svg viewBox="-60 -60 120 120" aria-hidden="true">
                    <circle style={fill(drink.mixed)} r="54" />
                    <g transform="scale(.72)"><LatteArt id={id} foam={drink.foam} liquid={drink.mixed} /></g>
                  </svg>
                </button>
              ))}
            </div>
            <button type="button" className="btn" disabled={!art} onClick={() => art && onServe(art)}>Serve it to Nini</button>
          </>
        )}
      </div>
    </div>
  );
}
