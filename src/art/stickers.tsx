import type { ReactNode } from 'react';

// The collectible stickers. Each is drawn around 0,0 inside a 100 x 100 square.
export const HEART = 'M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z';

const face = (
  <>
    <circle className="f-ink" cx="-9" cy="-3" r="2.600" />
    <circle className="f-ink" cx="9" cy="-3" r="2.600" />
    <path className="s s-ink" strokeWidth="2.600" d="M-8 6q8 7 16 0" />
    <circle className="f-pink" cx="-17" cy="5" r="4.500" />
    <circle className="f-pink" cx="17" cy="5" r="4.500" />
  </>
);

export const stickers: Record<string, { name: string; art: ReactNode }> = {
  heart: { name: 'Big heart', art: <path className="f-pink-deep" transform="scale(2.400) translate(0 -2)" d={HEART} /> },
  sun: { name: 'Morning sun', art: <><circle className="f-sun" r="31" />{face}</> },
  matcha: {
    name: 'Iced matcha',
    art: (
      <>
        <rect className="f-pink-deep" x="6" y="-46" width="7" height="34" rx="3" transform="rotate(12 9 -30)" />
        <path className="f-white" d="M-25 -28h50l-6 62h-38Z" />
        <path className="f-matcha-pale" d="M-23.500 -12h47l-1.500 14h-44Z" />
        <path className="f-matcha" d="M-22 0h44l-3.200 32h-37.600Z" />
        <ellipse className="f-cream" cx="0" cy="-28" rx="25" ry="5.500" />
        <path className="f-white" transform="translate(0 13) scale(.8)" d={HEART} />
      </>
    ),
  },
  croissant: {
    name: 'Croissant',
    art: (
      <>
        <g className="f-bake"><ellipse cx="-21" cy="6" rx="14" ry="11" /><ellipse cx="21" cy="6" rx="14" ry="11" /><ellipse cx="0" cy="0" rx="18" ry="15" /></g>
        <path className="s s-wood" strokeWidth="2.600" d="M-8 -11q-4 11 0 22M8 -11q4 11 0 22" />
      </>
    ),
  },
  strawberry: {
    name: 'Strawberry',
    art: (
      <g transform="scale(1.700) translate(-186 -479)">
        <path className="f-pink-deep" d="M186 462c14-8 25 4 19 17-4 9-12 14-19 17-7-3-15-8-19-17-6-13 5-25 19-17Z" />
        <path className="f-matcha-deep" d="M175 461l11 5 11-5-4-7-7 4-7-4Z" />
        <g className="f-white"><circle cx="178" cy="474" r="1.500" /><circle cx="188" cy="479" r="1.500" /><circle cx="195" cy="471" r="1.500" /><circle cx="184" cy="487" r="1.500" /></g>
      </g>
    ),
  },
  dog: {
    name: 'Tchipo',
    art: (
      <g transform="translate(-4 2)">
        <path className="s s-dog" strokeWidth="6" d="M-30 -2q-10-4-9-16" />
        <rect className="f-dog" x="-34" y="-8" width="56" height="24" rx="12" />
        <rect className="f-dog" x="-27" y="10" width="8" height="12" rx="4" /><rect className="f-dog" x="8" y="10" width="8" height="12" rx="4" />
        <circle className="f-dog" cx="24" cy="-12" r="13" />
        <ellipse className="f-dog" cx="37" cy="-7" rx="10" ry="7" />
        <circle className="f-ink" cx="45" cy="-9" r="3" />
        <ellipse className="f-ink" cx="18" cy="-7" rx="6" ry="12" transform="rotate(14 18 -7)" />
        <circle className="f-ink" cx="28" cy="-15" r="2" />
      </g>
    ),
  },
  mug: {
    name: 'Pink mug',
    art: (
      <>
        <path className="s s-pink" strokeWidth="7" d="M16 -8q17 0 17 12t-17 12" />
        <rect className="f-pink" x="-26" y="-20" width="44" height="44" rx="10" />
        <path className="f-white" transform="translate(-4 2)" d={HEART} />
      </>
    ),
  },
  plant: {
    name: 'Little plant',
    art: (
      <>
        <ellipse className="f-matcha-deep" cx="-10" cy="-10" rx="8" ry="19" transform="rotate(-24 -10 -10)" />
        <ellipse className="f-matcha" cx="10" cy="-10" rx="8" ry="19" transform="rotate(24 10 -10)" />
        <ellipse className="f-matcha" cx="0" cy="-17" rx="7" ry="20" />
        <rect className="f-pink-deep" x="-17" y="6" width="34" height="28" rx="6" />
      </>
    ),
  },
  cloud: {
    name: 'Sleepy cloud',
    art: (
      <>
        <g className="f-cream-deep"><ellipse cx="0" cy="8" rx="35" ry="17" /><circle cx="-12" cy="-5" r="16" /><circle cx="11" cy="-9" r="20" /></g>
        <g transform="translate(0 8)">{face}</g>
      </>
    ),
  },
  star: {
    name: 'Lucky star',
    art: (
      <>
        <polygon className="f-sun st-sun" strokeWidth="7" strokeLinejoin="round" points="0,-30 8.500,-11.500 29,-9.500 13.500,4.500 18,24.500 0,14.500 -18,24.500 -13.500,4.500 -29,-9.500 -8.500,-11.500" />
        <g transform="scale(.7)">{face}</g>
      </>
    ),
  },
  cookie: {
    name: 'Cookie',
    art: (
      <>
        <circle className="f-bake" r="30" />
        <g className="f-ink"><circle cx="-12" cy="-10" r="4" /><circle cx="9" cy="-14" r="3.500" /><circle cx="14" cy="6" r="4" /><circle cx="-6" cy="12" r="3.500" /><circle cx="2" cy="-1" r="3" /></g>
      </>
    ),
  },
  flower: {
    name: 'Pink flower',
    art: (
      <>
        <g className="f-pink"><circle cx="0" cy="-18" r="14" /><circle cx="17" cy="-6" r="14" /><circle cx="11" cy="15" r="14" /><circle cx="-11" cy="15" r="14" /><circle cx="-17" cy="-6" r="14" /></g>
        <circle className="f-sun" r="10" />
      </>
    ),
  },
  moon: { name: 'Goodnight moon', art: <path className="f-sun" transform="translate(-6 0)" d="M10 -30a30 30 0 1 0 22 42a25 25 0 0 1-22-42Z" /> },
  bear: {
    name: 'Latte bear',
    art: (
      <>
        <g className="f-wood"><circle cx="-21" cy="-19" r="11" /><circle cx="21" cy="-19" r="11" /><circle cy="3" r="29" /></g>
        <ellipse className="f-cream" cx="0" cy="11" rx="12" ry="9" />
        <g className="f-ink"><circle cx="-11" cy="-2" r="2.800" /><circle cx="11" cy="-2" r="2.800" /><circle cx="0" cy="8" r="3.200" /></g>
      </>
    ),
  },
  donut: {
    name: 'Donut',
    art: (
      <>
        <path className="f-bake" fillRule="evenodd" d="M0 -32a32 32 0 1 0 0 64a32 32 0 1 0 0-64ZM0 -9a9 9 0 1 1 0 18a9 9 0 1 1 0-18Z" />
        <path className="f-pink" fillRule="evenodd" d="M0 -27a27 27 0 1 0 0 54a27 27 0 1 0 0-54ZM0 -11a11 11 0 1 1 0 22a11 11 0 1 1 0-22Z" />
        <g className="f-white"><rect x="-17" y="-14" width="7" height="3" rx="1.500" transform="rotate(30 -14 -12)" /><rect x="10" y="-18" width="7" height="3" rx="1.500" transform="rotate(-40 13 -16)" /><rect x="14" y="8" width="7" height="3" rx="1.500" transform="rotate(60 17 9)" /><rect x="-16" y="12" width="7" height="3" rx="1.500" transform="rotate(-20 -13 13)" /></g>
      </>
    ),
  },
  letter: {
    name: 'Love letter',
    art: (
      <>
        <rect className="f-pink" x="-31" y="-21" width="62" height="44" rx="7" />
        <path className="s s-white" strokeWidth="3" d="M-28 -17l28 20 28-20" />
        <path className="f-pink-deep" transform="translate(0 6) scale(.8)" d={HEART} />
      </>
    ),
  },
};

export const stickerIds = Object.keys(stickers);

export function Sticker({ id, wobble }: { id: string; wobble?: boolean }) {
  const s = stickers[id];
  return (
    <svg className={'sticker' + (wobble ? ' wob' : '')} viewBox="-50 -50 100 100" role="img" aria-label={s ? s.name : 'Sticker'}>
      <g filter="url(#stk)">{s?.art}</g>
    </svg>
  );
}

// One shared filter gives every sticker its white edge and soft shadow.
export function StickerDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="stk" x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d" />
          <feFlood className="fl-white" result="c" />
          <feComposite in="c" in2="d" operator="in" result="o" />
          <feDropShadow in="o" dx="0" dy="3" stdDeviation="2.500" className="fl-shadow" floodOpacity=".3" result="sh" />
          <feMerge><feMergeNode in="sh" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}
