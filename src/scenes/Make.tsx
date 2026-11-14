import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { ArtId, Drink, Item, Step } from '../content/drinks';
import { LatteArt } from '../art/LatteArt';
import { play, startPour, stopPour } from '../game/sound';

const PRAISE = ['Perfect', 'Just right', 'Lovely', 'So good', 'Beautiful', 'Smooth'];
const HOLD_LABEL: Record<string, string> = { pour: 'Hold to pour', brew: 'Hold to brew', steam: 'Hold to steam', blend: 'Hold to blend' };
// Toppings are stacked in this order, whatever order they were picked in.
const STACK: ArtId[] = ['cream', 'berries', 'mango', 'marshmallows', 'mint', 'drizzle', 'cocoa', 'sprinkles', 'sugarheart'];
const fill = (token: string) => ({ fill: `var(--${token})` });
const GLASS_H = 190;
const FLOOR_Y = 448;
const CUP_Y = 296;
const HOLD_MS = 2000;
// Resting places for ice cubes in the glass: x, y, tilt.
const ICE: [number, number, number][] = [[146, 410, -10], [196, 406, 14], [170, 372, 6]];
const STRAWBERRY = 'M0 -12c12-7 21 3 16 14-3 8-10 12-16 14-6-2-13-6-16-14-5-11 4-21 16-14Z';

const isHold = (s: Step) => s.kind === 'pour' || s.kind === 'brew' || s.kind === 'steam' || s.kind === 'blend';

// What is in each vessel, given how far through the recipe we are.
function contents(drink: Drink, index: number, progress: number) {
  const glass = { layers: [] as { color: string; amount: number }[], ice: 0 };
  const bowl = { scoops: 0, whisked: 0 };
  const blender = { fruit: 0, item: 'strawberry' as Item, ice: 0, liquid: 0, blended: 0 };
  drink.steps.forEach((s, i) => {
    if (i > index) return;
    const f = i < index ? 1 : Math.min(1, progress);
    if (s.kind === 'scoop') {
      const n = Math.round(f * s.count);
      if (s.into === 'bowl') bowl.scoops = n;
      else if (s.into === 'blender') {
        if (s.item === 'ice') blender.ice = n;
        else {
          blender.fruit = n;
          blender.item = s.item;
        }
      } else if (s.item === 'ice') glass.ice = n;
      else glass.layers.push({ color: s.color, amount: s.amount * f });
    }
    if (s.kind === 'pour') {
      if (s.into === 'blender') blender.liquid = f;
      else glass.layers.push({ color: s.color, amount: s.amount * f });
    }
    if (s.kind === 'brew' && i < index) glass.layers.push({ color: 'coffee', amount: 0.2 });
    if (s.kind === 'whisk') bowl.whisked = f;
    if (s.kind === 'blend') blender.blended = f;
  });
  return { glass, bowl, blender };
}

function Piece({ item, x, y, r = 0 }: { item: Item; x: number; y: number; r?: number }) {
  if (item === 'mango') return <rect style={fill('mango')} x={x - 14} y={y - 14} width="28" height="28" rx="7" transform={`rotate(${r} ${x} ${y})`} />;
  if (item === 'ice') return <rect className="f-white ice" x={x - 16} y={y - 16} width="32" height="32" rx="8" transform={`rotate(${r} ${x} ${y})`} />;
  if (item === 'strawberry')
    return (
      <g transform={`translate(${x} ${y}) rotate(${r})`}>
        <path style={fill('straw')} d={STRAWBERRY} />
        <path className="f-matcha-deep" d="M-9 -12l9 4 9-4-3-6-6 3-6-3Z" />
      </g>
    );
  return null;
}

// The thing that falls in when an ingredient is added.
function Drop({ item, color, fall }: { item: Item; color: string; fall: number }) {
  const style = { ['--fall' as string]: `${fall}px` };
  if (item === 'powder')
    return (
      <g className="drop" style={{ ...style, ...fill(color) }}>
        <circle cx="195" cy="140" r="10" /><circle cx="182" cy="133" r="5" /><circle cx="208" cy="134" r="5" /><circle cx="189" cy="153" r="4" /><circle cx="203" cy="152" r="4" />
      </g>
    );
  return <g className="drop" style={style}><Piece item={item} x={195} y={140} r={12} /></g>;
}

// A pitcher, matcha bowl or blender jar tipping in from the top right.
function Pourer({ from, color }: { from: 'pitcher' | 'bowl' | 'blender'; color: string }) {
  return (
    <g transform="translate(275 150) rotate(-35)">
      {from === 'bowl' ? (
        <>
          <path className="f-white" d="M-36 -22h72a36 34 0 0 1-72 0Z" />
          <ellipse style={fill(color)} cx="0" cy="-22" rx="36" ry="7" />
        </>
      ) : from === 'blender' ? (
        <>
          <path className="f-white" opacity=".85" d="M-26 -34h52l-6 66h-40Z" />
          <path style={fill(color)} d="M-23 -10h46l-4 40h-38Z" />
          <path className="f-white" d="M-26 -34l-12 4 13 12Z" />
        </>
      ) : (
        <>
          <path className="s s-white" strokeWidth="8" d="M24 -14q20 0 20 14t-20 14" />
          <rect className="f-white" x="-24" y="-28" width="48" height="58" rx="10" />
          <path className="f-white" d="M-22 -28l-14 4 14 12Z" />
          <rect style={fill(color)} x="-17" y="-21" width="34" height="9" rx="4" />
        </>
      )}
    </g>
  );
}

export function Make({ drink, onServe }: { drink: Drink; onServe: (art: string) => void }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [taps, setTaps] = useState(0);
  const [picks, setPicks] = useState<ArtId[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<string[]>([]);
  const [tool, setTool] = useState({ x: 195, y: CUP_Y });
  const last = useRef<{ x: number; y: number } | null>(null);

  const step = drink.steps[index];
  const complete = progress >= 1;
  const { glass, bowl, blender } = contents(drink, index, progress);

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
      setProgress((p) => Math.min(1, p + dt / HOLD_MS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopPour();
    };
  }, [holding]);

  const view =
    step.kind === 'brew' ? 'machine'
    : step.kind === 'steam' ? 'steam'
    : step.kind === 'blend' ? 'blender'
    : step.kind === 'whisk' ? 'bowl'
    : step.kind === 'scoop' || step.kind === 'pour' ? step.into
    : 'cup';

  const total = glass.layers.reduce((sum, l) => sum + l.amount, 0);
  const surface = FLOOR_Y - total * GLASS_H;
  const blenderTop = 420 - Math.max(blender.liquid * 150, blender.fruit || blender.ice ? 70 : 0);
  const firstLayer = glass.layers.find((l) => l.color !== 'milk')?.color ?? drink.mixed;
  const stirred = drink.steps.some((s) => s.kind === 'stir');
  const mix = step.kind === 'stir' ? Math.min(1, progress) : 1;
  const iced = glass.ice > 0;
  const inky = step.kind === 'choose' && step.multi ? 'caramel' : drink.foam;

  const tap = () => {
    if (step.kind !== 'scoop' || complete) return;
    setTaps((n) => n + 1);
    play('plop');
    setProgress((p) => Math.min(1, p + 1 / step.count + 0.001));
  };

  // Pointer work on the cup or bowl: stirring, whisking and drawing all share it.
  const point = (e: RPointerEvent<SVGGElement>) => {
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const scale = 390 / box.width;
    return { x: (e.clientX - box.left) * scale, y: (e.clientY - box.top) * scale };
  };
  const reach = (p: { x: number; y: number }, limit: number) => {
    const dx = p.x - 195;
    const dy = p.y - CUP_Y;
    const k = Math.min(1, limit / Math.max(1, Math.hypot(dx, dy)));
    return { x: 195 + dx * k, y: CUP_Y + dy * k };
  };
  const down = (e: RPointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    last.current = p;
    if (drawing) {
      const q = reach(p, 100);
      setStrokes((s) => [...s, `${(q.x - 195).toFixed(0)},${(q.y - CUP_Y).toFixed(0)}`]);
    }
  };
  const move = (e: RPointerEvent<SVGGElement>) => {
    if (!last.current) return;
    const p = point(e);
    const moved = Math.hypot(p.x - last.current.x, p.y - last.current.y);
    if (drawing) {
      if (moved < 3) return;
      last.current = p;
      const q = reach(p, 100);
      setStrokes((s) => [...s.slice(0, -1), `${s[s.length - 1]} ${(q.x - 195).toFixed(0)},${(q.y - CUP_Y).toFixed(0)}`]);
      return;
    }
    last.current = p;
    if (complete) return;
    setTool(reach(p, 92));
    setProgress((v) => Math.min(1, v + moved / 1250));
  };
  const up = () => {
    last.current = null;
  };
  const nudge = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !drawing) setProgress((p) => Math.min(1, p + 0.15));
  };

  const pick = (id: ArtId) => {
    if (step.kind !== 'choose') return;
    play('pop');
    setPicks((p) => (step.multi ? (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]) : p.includes(id) ? [] : [id]));
  };
  const toggleDraw = () => {
    play('pop');
    if (drawing) setStrokes([]);
    setDrawing(!drawing);
  };

  let y = FLOOR_Y;
  const pourStep = step.kind === 'pour' ? step : null;

  return (
    <div className="scene make">
      <svg className="art" viewBox="0 0 390 720" aria-hidden={view !== 'cup' && view !== 'bowl'}>
        <defs>
          <clipPath id="glass"><path d="M126 258h138l-16 190h-106Z" /></clipPath>
          <clipPath id="cup"><circle cx="195" cy="330" r="108" /></clipPath>
          <clipPath id="jar"><path d="M134 196h122l-14 224h-94Z" /></clipPath>
          <clipPath id="shot"><path d="M152 372h86l-8 78h-70Z" /></clipPath>
        </defs>
        <rect className="f-wall" x="-300" y="-500" width="990" height="1300" />
        <rect className="f-wall-deep" x="-300" y="380" width="990" height="100" />
        <rect className="f-wood-pale" x="-300" y="478" width="990" height="900" />
        <rect className="f-wood" x="-300" y="482" width="990" height="8" opacity=".55" />
        <rect className="f-cream" x="-300" y="456" width="990" height="28" />

        {view === 'glass' && (
          <g className="view" key="glass">
            <path className="f-white" opacity=".4" d="M118 250h154l-18 204a8 8 0 0 1-8 7h-102a8 8 0 0 1-8-7Z" />
            <g clipPath="url(#glass)">
              {glass.layers.map((l, i) => {
                const h = l.amount * GLASS_H;
                y -= h;
                return <rect key={i} style={fill(l.color)} x="120" y={y} width="150" height={h + 0.600} />;
              })}
              {ICE.slice(0, glass.ice).map(([x, cy, r], i) => (
                <Piece key={i} item="ice" x={x + 17} y={Math.min(cy, Math.max(280, surface + 10 + i * 10)) + 17} r={r} />
              ))}
              {total > 0.02 && <ellipse className="f-white" opacity=".35" cx="195" cy={surface + 1} rx="72" ry="3" />}
            </g>
            <path className="s s-white" strokeWidth="5" d="M118 250h154l-18 204a8 8 0 0 1-8 7h-102a8 8 0 0 1-8-7Z" />
            <path className="s s-white" strokeWidth="5" opacity=".7" d="M142 280l10 130" />
            {step.kind === 'scoop' && taps > 0 && <Drop key={taps} item={step.item} color={step.color} fall={(step.item === 'ice' ? 400 : surface) - 140} />}
            {pourStep && (
              <>
                {holding && !complete && <rect style={fill(pourStep.color)} x="228" y="151" width="9" height={Math.max(0, surface - 151)} rx="4" />}
                <Pourer from={pourStep.from} color={pourStep.color} />
              </>
            )}
          </g>
        )}

        {view === 'blender' && (
          <g className="view" key="blender">
            <g className={holding && step.kind === 'blend' ? 'shake' : undefined}>
              <path className="f-white" opacity=".4" d="M130 190h130l-15 232h-100Z" />
              <g clipPath="url(#jar)">
                <rect style={fill('milk')} x="120" y={420 - blender.liquid * 150} width="150" height={blender.liquid * 150 + 1} />
                <g opacity={1 - blender.blended}>
                  {[[168, 396, -12], [216, 398, 16], [192, 366, 4]].slice(0, blender.fruit).map(([x, cy, r], i) => <Piece key={i} item={blender.item} x={x} y={cy} r={r} />)}
                  {[[162, 338, 10], [222, 342, -14]].slice(0, blender.ice).map(([x, cy, r], i) => <Piece key={i} item="ice" x={x} y={cy} r={r} />)}
                </g>
                <rect style={{ ...fill(drink.mixed), opacity: blender.blended }} x="120" y={blenderTop - 14} width="150" height="260" />
                {step.kind === 'blend' && holding && <path className="s s-white swirl" strokeWidth="5" opacity=".6" d="M160 300q35 30 70 0M156 350q39 30 78 0M162 395q33 22 66 0" />}
              </g>
              <path className="s s-white" strokeWidth="5" d="M130 190h130l-15 232h-100Z" />
              <path className="s s-white" strokeWidth="3" opacity=".7" d="M240 250h-14M237 300h-14M234 350h-14" />
              {step.kind === 'blend' && <><rect className="f-cream" x="122" y="172" width="146" height="22" rx="9" /><rect className="f-pink-deep" x="180" y="158" width="30" height="16" rx="6" /></>}
            </g>
            <path className="f-pink-deep" d="M138 422h114l10 36h-134Z" />
            <circle className="f-cream" cx="195" cy="441" r="9" />
            {step.kind === 'scoop' && taps > 0 && <Drop key={taps} item={step.item} color={step.color} fall={230} />}
            {pourStep && (
              <>
                {holding && !complete && <rect style={fill(pourStep.color)} x="228" y="151" width="9" height={Math.max(0, 420 - blender.liquid * 150 - 151)} rx="4" />}
                <Pourer from="pitcher" color={pourStep.color} />
              </>
            )}
          </g>
        )}

        {view === 'machine' && (
          <g className="view" key="machine">
            <rect className="f-pink-deep" x="56" y="112" width="278" height="30" rx="14" />
            <rect className="f-pink" x="40" y="122" width="310" height="186" rx="28" />
            <rect className="f-cream" x="70" y="150" width="250" height="70" rx="20" />
            <circle className="f-pink-deep" cx="112" cy="185" r="15" /><circle className="f-matcha" cx="160" cy="185" r="15" />
            <circle className="f-white" cx="270" cy="185" r="26" />
            <path className="s s-ink" strokeWidth="4" d="M270 185v-18" transform={`rotate(${-70 + progress * 140} 270 185)`} />
            <rect className="f-ink" x="148" y="300" width="94" height="26" rx="9" /><rect className="f-ink" x="238" y="306" width="74" height="13" rx="6" />
            <rect className="f-ink" x="176" y="324" width="11" height="12" /><rect className="f-ink" x="203" y="324" width="11" height="12" />
            {holding && !complete && (
              <g style={fill('coffee')}><rect x="180" y="336" width="3.500" height={Math.max(0, 448 - progress * 56 - 336)} /><rect x="207" y="336" width="3.500" height={Math.max(0, 448 - progress * 56 - 336)} /></g>
            )}
            <path className="f-white" opacity=".45" d="M146 366h98l-9 90h-80Z" />
            <g clipPath="url(#shot)">
              <rect style={fill('coffee')} x="140" y={450 - progress * 56} width="110" height="80" />
              <rect style={fill('coffee-milk')} x="140" y={450 - progress * 56} width="110" height={Math.min(9, progress * 30)} />
            </g>
            <path className="s s-white" strokeWidth="5" d="M146 366h98l-9 90h-80Z" />
            <path className="s s-white steam" strokeWidth="4" opacity={complete ? 1 : 0} d="M182 356q-7-10 0-20t0-20" />
          </g>
        )}

        {view === 'steam' && (
          <g className="view" key="steam">
            <path className="s s-ink" strokeWidth="9" d="M286 128v38q0 22-20 34l-52 32v82" />
            <rect className="f-ink" x="270" y="114" width="32" height="20" rx="8" />
            {holding && !complete && (
              <g className="f-white"><circle className="puff" cx="176" cy="282" r="13" /><circle className="puff two" cx="204" cy="276" r="17" /><circle className="puff three" cx="230" cy="284" r="11" /></g>
            )}
            <path className="s s-steel" strokeWidth="12" d="M258 332q36 4 32 46t-36 42" />
            <path className="f-steel" d="M136 300h124l-7 150a10 10 0 0 1-10 9h-90a10 10 0 0 1-10-9Z" />
            <path className="f-steel" d="M138 300l-20-9 22 34Z" />
            <ellipse className="f-ink" opacity=".3" cx="198" cy="300" rx="62" ry="12" />
            <ellipse style={fill('milk')} cx="198" cy={308 - progress * 7} rx={56 + progress * 4} ry="10" />
            <g className="f-white">
              {[[172, 0], [214, 2], [192, -3], [228, -1], [182, 3], [204, -2]].slice(0, Math.round(progress * 6)).map(([x, dy], i) => (
                <circle key={i} cx={x} cy={306 - progress * 7 + dy} r={4 + (i % 3)} />
              ))}
            </g>
            <path className="s s-white" strokeWidth="4" opacity=".5" d="M158 330l6 100" />
            <rect className="f-white" x="312" y="230" width="24" height="218" rx="12" />
            <rect className="f-matcha" x="306" y="244" width="36" height="34" rx="8" opacity=".55" />
            <rect className="f-pink-deep" x="319" y={436 - progress * 186} width="10" height={progress * 186 + 4} rx="5" />
            <circle className="f-pink-deep" cx="324" cy="440" r="15" />
          </g>
        )}

        {(view === 'cup' || view === 'bowl') && (
          <g className="view" key={view}>
            <rect className="f-wood-pale" x="-300" y="-500" width="990" height="1900" />
            <g transform={`translate(0 ${CUP_Y - 330})`}>
              <ellipse className="f-wood" opacity=".3" cx="195" cy="352" rx="150" ry="140" />
              {view === 'cup' ? (
                <><circle className="f-white" cx="195" cy="330" r="148" /><circle className="f-cream" cx="195" cy="330" r="134" /><circle className="f-white" cx="195" cy="330" r="122" /></>
              ) : (
                <><circle className="f-pink" cx="195" cy="330" r="140" /><circle className="f-cream" cx="195" cy="330" r="124" /></>
              )}
              <g clipPath="url(#cup)">
                {view === 'cup' ? (
                  <>
                    <circle style={fill(stirred ? 'milk' : drink.mixed)} cx="195" cy="330" r="110" />
                    {stirred && (
                      <>
                        <g style={{ ...fill(firstLayer), opacity: 1 - mix }}><circle cx="160" cy="300" r="34" /><circle cx="236" cy="352" r="42" /><circle cx="176" cy="386" r="24" /></g>
                        <circle style={{ ...fill(drink.mixed), opacity: mix }} cx="195" cy="330" r="110" />
                      </>
                    )}
                    {iced && (
                      <g className="f-white ice">
                        <rect x="112" y="268" width="44" height="44" rx="11" transform="rotate(-14 134 290)" /><rect x="236" y="300" width="44" height="44" rx="11" transform="rotate(18 258 322)" /><rect x="150" y="380" width="44" height="44" rx="11" transform="rotate(8 172 402)" />
                      </g>
                    )}
                    <circle className="s" style={{ stroke: `var(--${drink.foam})` }} strokeWidth="7" opacity=".45" cx="195" cy="330" r="106" />
                    <ellipse className="f-white" opacity=".16" cx="160" cy="282" rx="40" ry="22" transform="rotate(-35 160 282)" />
                  </>
                ) : (
                  <>
                    <circle className="f-matcha-pale" cx="195" cy="330" r="110" opacity={step.kind === 'whisk' ? 1 : 0} />
                    <g className="f-matcha-deep" opacity={1 - bowl.whisked}>
                      {[[170, 312, 34], [224, 342, 30], [188, 362, 22]].slice(0, step.kind === 'whisk' ? 3 : bowl.scoops + (bowl.scoops ? 1 : 0)).map(([x, cy, r], i) => <circle className="pop" key={i} cx={x} cy={cy} r={r} />)}
                    </g>
                    <circle className="f-matcha" cx="195" cy="330" r="110" opacity={bowl.whisked} />
                    <g className="f-matcha-pale" opacity=".8">
                      {Array.from({ length: Math.round(bowl.whisked * 18) }, (_, i) => {
                        const a = i * 2.4;
                        const r = 20 * Math.sqrt(i + 1);
                        return <circle key={i} cx={195 + Math.cos(a) * r} cy={330 + Math.sin(a) * r} r={3 + (i % 4)} />;
                      })}
                    </g>
                  </>
                )}
                {step.kind === 'stir' && (
                  <g style={{ transform: `rotate(${progress * 620}deg)`, transformOrigin: '195px 330px', opacity: 0.55 }}>
                    <path className="s" style={{ stroke: `var(--${drink.foam})` }} strokeWidth="9" d="M195 330c20-30 60-10 50 25s-70 45-95 5s5-100 60-95" />
                  </g>
                )}
              </g>
            </g>
            {step.kind === 'choose' && (
              <g transform={`translate(195 ${CUP_Y})`}>
                {(step.multi ? STACK.filter((id) => picks.includes(id)) : picks).map((id) => (
                  <g className="pop" key={id}><LatteArt id={id} foam={drink.foam} liquid={drink.mixed} /></g>
                ))}
                {strokes.map((pts, i) => <polyline key={i} className="s" style={{ stroke: `var(--${inky})` }} strokeWidth="9" points={pts.includes(' ') ? pts : `${pts} ${pts}`} />)}
              </g>
            )}
            {(step.kind === 'stir' || step.kind === 'whisk' || (step.kind === 'choose' && drawing)) && (
              <g
                className="stir-zone"
                role="button"
                tabIndex={0}
                aria-label={drawing ? 'Draw on the drink with your finger.' : 'Drag around the cup, or press Enter.'}
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
                onKeyDown={nudge}
              >
                <circle className="ring" cx="195" cy={CUP_Y} r="150" fill="transparent" />
                {step.kind === 'stir' && <g transform={`translate(${tool.x} ${tool.y})`}><circle className="f-wood" r="17" /><circle className="f-wood-pale" r="9" /></g>}
                {step.kind === 'whisk' && (
                  <g transform={`translate(${tool.x} ${tool.y})`}>
                    <g className="f-cream-deep">{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.628) * 22} cy={Math.sin(i * 0.628) * 22} r="6" />)}</g>
                    <circle className="f-wood" r="15" /><circle className="f-wood-pale" r="7" />
                  </g>
                )}
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
        <p>{step.kind === 'choose' && drawing ? 'Draw on the drink with your finger.' : step.hint}</p>
      </div>

      <div className="make-ctl" key={'ctl' + index}>
        {step.kind === 'scoop' && (
          <button type="button" className="btn big" onClick={tap} disabled={complete}>
            {step.button}
            <span className="count">{Math.min(step.count, Math.round(progress * step.count))} of {step.count}</span>
          </button>
        )}
        {isHold(step) && (
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
            {HOLD_LABEL[step.kind]}
          </button>
        )}
        {step.kind === 'choose' && (
          <>
            <div className="arts">
              {step.options.map((id) => (
                <button key={id} type="button" className={'art-pick' + (picks.includes(id) ? ' on' : '')} aria-label={id} aria-pressed={picks.includes(id)} onClick={() => pick(id)}>
                  <svg viewBox="-60 -60 120 120" aria-hidden="true">
                    <circle style={fill(drink.mixed)} r="54" />
                    <g transform="scale(.62)"><LatteArt id={id} foam={drink.foam} liquid={drink.mixed} /></g>
                  </svg>
                </button>
              ))}
              <button type="button" className={'art-pick' + (drawing ? ' on' : '')} aria-label={drawing ? 'Clear my drawing' : 'Draw my own'} aria-pressed={drawing} onClick={toggleDraw}>
                <svg viewBox="-60 -60 120 120" aria-hidden="true">
                  <circle className="f-cream" r="54" />
                  <path className="s s-ink" strokeWidth="6" d="M-30 14c8-26 20-26 22-6s12 20 18-4s14-18 20 2" />
                </svg>
              </button>
            </div>
            <button type="button" className="btn" disabled={!picks.length && !strokes.length} onClick={() => onServe([...picks, ...(strokes.length ? ['drawn'] : [])].join('+'))}>
              Serve it to Nini
            </button>
          </>
        )}
      </div>
    </div>
  );
}
