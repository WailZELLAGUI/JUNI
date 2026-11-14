import { longDate, type TimeOfDay } from '../game/daily';

const HELLO: Record<TimeOfDay, string> = {
  morning: 'Good morning, Juju',
  day: 'Good afternoon, Juju',
  evening: 'Good evening, Juju',
  night: 'Sweet night, Juju',
};

// The front of the shop: the first thing Juju sees before she steps inside.
export function Home({ time, dateKey, served, onOpen }: { time: TimeOfDay; dateKey: string; served: boolean; onOpen: () => void }) {
  return (
    <div className="scene home">
      <svg className="art" viewBox="0 0 390 720" aria-hidden="true">
        <rect className="f-sky" x="-300" y="-500" width="990" height="1300" />
        {time === 'night' ? (
          <>
            <circle className="f-cream" cx="322" cy="70" r="24" /><circle className="f-sky" cx="333" cy="62" r="22" />
            <g className="f-cream"><circle cx="40" cy="40" r="2" /><circle cx="110" cy="96" r="1.600" /><circle cx="250" cy="34" r="2" /><circle cx="366" cy="130" r="1.600" /></g>
          </>
        ) : (
          <circle className="f-sun" cx="322" cy={time === 'evening' ? 120 : 70} r="30" />
        )}
        <g className="f-white" opacity=".7"><ellipse cx="70" cy="128" rx="34" ry="12" /><ellipse cx="92" cy="118" rx="22" ry="13" /></g>

        <rect className="f-cream" x="24" y="176" width="342" height="430" />
        <rect className="f-wood" x="12" y="162" width="366" height="20" rx="6" />
        <rect className="f-matcha-deep" x="105" y="196" width="180" height="56" rx="14" />

        <rect className="f-sky" x="44" y="318" width="170" height="204" rx="10" />
        <rect className="f-sun" opacity=".35" x="44" y="318" width="170" height="204" rx="10" />
        <path className="s s-matcha-deep" strokeWidth="3" d="M84 318v30M80 348q-8 16-3 34M90 348q8 18 2 40" />
        <g className="f-matcha"><circle cx="76" cy="366" r="6" /><circle cx="77" cy="384" r="6" /><circle cx="94" cy="372" r="6" /><circle cx="92" cy="390" r="6" /></g>
        <rect className="f-wood" x="120" y="408" width="84" height="7" rx="3" />
        <rect className="f-pink" x="128" y="384" width="22" height="24" rx="5" /><rect className="f-white" x="158" y="386" width="20" height="22" rx="5" /><rect className="f-matcha" x="184" y="382" width="16" height="26" rx="4" />
        <g transform="translate(-52 150)">
          <path className="s s-dog tail" strokeWidth="5" d="M142 344q-12-2-12-16" />
          <rect className="f-dog" x="138" y="334" width="62" height="22" rx="11" />
          <rect className="f-dog" x="146" y="350" width="7" height="9" rx="3" /><rect className="f-dog" x="186" y="350" width="7" height="9" rx="3" />
          <circle className="f-dog" cx="202" cy="330" r="11" /><ellipse className="f-dog" cx="213" cy="334" rx="9" ry="6" />
          <circle className="f-ink" cx="221" cy="332" r="2.400" /><ellipse className="f-ink" cx="197" cy="334" rx="5" ry="10" transform="rotate(12 197 334)" /><circle className="f-ink" cx="205" cy="327" r="1.700" />
        </g>
        <rect className="s s-wood" strokeWidth="8" x="44" y="318" width="170" height="204" rx="10" />
        <rect className="f-wood" x="34" y="518" width="190" height="14" rx="6" />

        <path className="f-matcha-deep" d="M244 606V352a48 48 0 0 1 96 0V606Z" />
        <path className="f-sky" d="M258 470V354a34 34 0 0 1 68 0V470Z" />
        <path className="f-sun" opacity=".35" d="M258 470V354a34 34 0 0 1 68 0V470Z" />
        <path className="s s-wood" strokeWidth="1.500" d="M280 386l12-14 12 14" />
        <rect className="f-cream" x="270" y="386" width="44" height="28" rx="6" />
        <path className="f-pink-deep" transform="translate(292 399) scale(.6)" d="M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z" />
        <circle className="f-sun" cx="258" cy="500" r="6" />

        <g>
          <g className="f-pink"><rect x="24" y="262" width="57" height="34" /><circle cx="52.500" cy="296" r="28.500" /><rect x="138" y="262" width="57" height="34" /><circle cx="166.500" cy="296" r="28.500" /><rect x="252" y="262" width="57" height="34" /><circle cx="280.500" cy="296" r="28.500" /></g>
          <g className="f-white"><rect x="81" y="262" width="57" height="34" /><circle cx="109.500" cy="296" r="28.500" /><rect x="195" y="262" width="57" height="34" /><circle cx="223.500" cy="296" r="28.500" /><rect x="309" y="262" width="57" height="34" /><circle cx="337.500" cy="296" r="28.500" /></g>
          <rect className="f-pink-deep" x="18" y="254" width="354" height="12" rx="5" />
        </g>

        <rect className="f-wood-pale" x="-300" y="600" width="990" height="800" />
        <rect className="f-wood" opacity=".5" x="-300" y="600" width="990" height="7" />
        <rect className="f-cream-deep" x="234" y="596" width="116" height="14" rx="4" />
        <g className="sway-soft">
          <g className="f-matcha"><circle cx="34" cy="560" r="20" /><circle cx="52" cy="572" r="16" /><circle cx="20" cy="574" r="15" /></g>
        </g>
        <path className="f-pink-deep" d="M12 584h48l-6 30h-36Z" />
        <g className="f-matcha-deep"><circle cx="362" cy="556" r="18" /><circle cx="376" cy="572" r="15" /><circle cx="348" cy="572" r="14" /></g>
        <path className="f-pink-deep" d="M338 584h48l-6 30h-36Z" />
      </svg>

      <p className="hello">{HELLO[time]}</p>
      <p className="date">{longDate(dateKey)}</p>
      <h1 className="sign">JUNI</h1>
      <div className="home-go">
        <button type="button" className="btn big" onClick={onOpen}>{served ? 'Step back inside' : 'Open the shop'}</button>
        <p className="small">{served ? 'Today\'s order is served. Tchipo is keeping watch.' : 'Someone is already waiting outside.'}</p>
      </div>
    </div>
  );
}
