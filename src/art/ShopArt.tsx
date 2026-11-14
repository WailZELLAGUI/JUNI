import { useState } from 'react';
import type { Mood, TimeOfDay } from '../game/daily';
import { play } from '../game/sound';

const WINDOW = 'M40 360V195a85 85 0 0 1 170 0V360Z';

// The shop interior. Wall and counter bleed far past the 390 x 720 frame so
// taller and wider screens simply show more of the room.
export type NiniState = 'in' | 'here' | 'out' | 'gone';

type Props = { time: TimeOfDay; nini: NiniState; decor: string[]; mood: Mood; sparkle?: boolean; cup?: string; onPet?: () => void };

export function ShopArt({ time, nini, decor, mood, sparkle, cup, onPet }: Props) {
  const [pets, setPets] = useState(0);
  const asleep = time === 'night' && pets === 0;
  const pet = () => {
    setPets((n) => n + 1);
    play('woof');
    onPet?.();
  };
  const sunY = { morning: 205, day: 165, evening: 300, night: 190 }[time];
  return (
    <svg className="art" viewBox="0 0 390 720">
      <defs><clipPath id="win"><path d={WINDOW} /></clipPath></defs>
      <rect className="f-wall" x="-300" y="-500" width="990" height="1300" />
      <rect className="f-wall-deep" x="-300" y="400" width="990" height="80" />

      <path className="f-sky" d={WINDOW} />
      <g clipPath="url(#win)">
        {time === 'night' ? (
          <>
            <circle className="f-cream" cx="150" cy={sunY} r="26" />
            <circle className="f-sky" cx="162" cy={sunY - 8} r="24" />
            <g className="f-cream"><circle cx="70" cy="180" r="2" /><circle cx="100" cy="230" r="1.600" /><circle cx="185" cy="270" r="2" /><circle cx="75" cy="290" r="1.600" /></g>
          </>
        ) : (
          <circle className="f-sun" cx="150" cy={sunY} r="34" />
        )}
        {mood.rain && (
          <g className="rain s s-white" strokeWidth="2" opacity=".75">
            {Array.from({ length: 42 }, (_, i) => {
              const x = 46 + (i % 6) * 30 + (Math.floor(i / 6) % 2) * 15;
              const y = -100 + Math.floor(i / 6) * 80;
              return <path key={i} d={`M${x} ${y}l-5 16`} />;
            })}
          </g>
        )}
        {mood.snow && (
          <g className="snow f-white">
            {Array.from({ length: 35 }, (_, i) => <circle key={i} cx={50 + (i % 7) * 24} cy={-90 + Math.floor(i / 7) * 110 + (((i % 7) * 37) % 90)} r={2 + ((i % 7) % 3)} />)}
          </g>
        )}
        <ellipse className="f-matcha" cx="90" cy="372" rx="110" ry="50" />
        <ellipse className="f-matcha-deep" cx="215" cy="382" rx="90" ry="42" />
      </g>
      <path className="s s-cream" strokeWidth="9" d={WINDOW} />
      <path className="s s-cream" strokeWidth="5" d="M125 112V360M40 250H210" />
      <g className="tchipo" role="button" tabIndex={0} aria-label="Pet Tchipo" onClick={pet} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pet()}>
      <rect x="126" y="312" width="100" height="48" fill="transparent" />
      <path className={pets ? 's s-dog tail fast' : 's s-dog tail'} strokeWidth="5" d="M142 344q-12-2-12-16" />
      <rect className="f-dog" x="138" y="334" width="62" height="22" rx="11" />
      <rect className="f-dog" x="146" y="350" width="7" height="9" rx="3" /><rect className="f-dog" x="186" y="350" width="7" height="9" rx="3" />
      <circle className="f-dog" cx="202" cy="330" r="11" />
      <ellipse className="f-dog" cx="213" cy="334" rx="9" ry="6" />
      <circle className="f-ink" cx="221" cy="332" r="2.400" />
      <ellipse className="f-ink" cx="197" cy="334" rx="5" ry="10" transform="rotate(12 197 334)" />
      {asleep ? <path className="s s-ink" strokeWidth="1.600" d="M202 328q3 2 6 0" /> : <circle className="f-ink" cx="205" cy="327" r="1.700" />}
      {asleep && <text className="label zzz" x="214" y="312">z z</text>}
      {mood.festive && <><path className="f-pink-deep" d="M194 322l9-20 8 19Z" /><circle className="f-sun" cx="203" cy="301" r="3.500" /></>}
      {sparkle && <path className="f-sun sparkle" d="M176 300l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />}
      {pets > 0 && (
        <g className="woof" key={pets}>
          <rect className="f-white" x="150" y="286" width="62" height="24" rx="12" />
          <text className="label" x="181" y="303" textAnchor="middle">Tchipo</text>
          <path className="f-pink-deep" transform="translate(222 296) scale(.6)" d="M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z" />
        </g>
      )}
      </g>
      <rect className="f-wood" x="28" y="358" width="194" height="13" rx="6" />

      <path className="s s-wood" strokeWidth="2" d="M340 -500V70" />
      <g className="sway">
        <path className="s s-matcha-deep" strokeWidth="3" d="M326 84q-10 20-4 44M354 84q10 24 2 54" />
        <g className="f-matcha"><circle cx="321" cy="104" r="6" /><circle cx="322" cy="129" r="6" /><circle cx="360" cy="112" r="6" /><circle cx="356" cy="139" r="6" /></g>
      </g>
      <path className="f-cream" d="M322 70h36l-5 22h-26Z" />

      <rect className="f-wood" x="236" y="228" width="132" height="8" rx="4" />
      <rect className="f-pink" x="248" y="202" width="26" height="26" rx="6" /><path className="s s-pink" strokeWidth="4" d="M274 208q10 0 10 7t-10 7" />
      <rect className="f-white" x="294" y="204" width="24" height="24" rx="6" /><path className="s s-white" strokeWidth="4" d="M318 209q9 0 9 6.500t-9 6.500" />
      <ellipse className="f-matcha-deep" cx="338" cy="198" rx="6" ry="13" transform="rotate(-22 338 198)" /><ellipse className="f-matcha" cx="351" cy="197" rx="6" ry="13" transform="rotate(22 351 197)" /><ellipse className="f-matcha" cx="344" cy="193" rx="5" ry="14" />
      <rect className="f-pink-deep" x="332" y="208" width="24" height="20" rx="4" />

      <rect className="f-wood" x="236" y="312" width="132" height="8" rx="4" />
      <rect className="f-matcha" x="250" y="276" width="34" height="36" rx="6" /><rect className="f-matcha-deep" x="248" y="272" width="38" height="9" rx="4" /><rect className="f-cream" x="257" y="290" width="20" height="12" rx="3" />
      <rect className="f-wood" x="298" y="270" width="44" height="42" rx="6" /><rect className="f-cream" x="303" y="275" width="34" height="32" rx="3" />
      <path className="f-pink-deep" d="M320 301c-13-9-10-18-4-18 3 0 4 3 4 3s1-3 4-3c6 0 9 9-4 18Z" />
      <rect className="f-white" x="352" y="286" width="12" height="26" rx="4" />

      {decor.includes('frame') && (
        <g transform="rotate(-4 272 152)">
          <rect className="f-white" x="246" y="120" width="52" height="64" rx="4" />
          <rect className="f-pink-pale" x="251" y="125" width="42" height="42" rx="2" />
          <circle className="f-ink" cx="264" cy="150" r="7" /><circle className="f-wood" cx="280" cy="150" r="7" />
          <path className="f-ink" d="M254 167q0-11 10-11t10 11Z" /><path className="f-wood" d="M270 167q0-11 10-11t10 11Z" />
          <path className="f-pink-deep" transform="translate(272 134) scale(.45)" d="M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z" />
        </g>
      )}
      {decor.includes('lights') && (
        <>
          <path className="s s-ink" strokeWidth="1.500" opacity=".5" d="M-190 -4q85 26 170 0t170 0t170 0t170 0t170 0" />
          <g className="twinkle">
            <circle className="f-pink" cx="20" cy="5" r="5" /><circle className="f-sun" cx="65" cy="10" r="5" /><circle className="f-white" cx="110" cy="5" r="5" />
            <circle className="f-sun" cx="190" cy="5" r="5" /><circle className="f-pink" cx="235" cy="10" r="5" /><circle className="f-white" cx="280" cy="5" r="5" />
            <circle className="f-pink" cx="360" cy="5" r="5" /><circle className="f-sun" cx="-20" cy="-3" r="5" /><circle className="f-sun" cx="405" cy="10" r="5" />
          </g>
        </>
      )}

      <g className={'nini ' + nini}>
        <g className="bob">
          <g transform="translate(30 0)">
            <g className="f-hair"><circle cx="206" cy="338" r="10" /><circle cx="204" cy="352" r="9" /><circle cx="258" cy="338" r="10" /><circle cx="260" cy="352" r="9" /></g>
            <path className="f-wood" d="M170 480v-50q0-32 36-38h52q36 6 36 38v50Z" />
            <path className="f-cream" d="M218 394l14 34 14-34Z" />
            <rect className="f-cream" x="220" y="370" width="24" height="26" rx="8" />
            <circle className="f-skin" cx="232" cy="346" r="24" />
            <g className="f-hair"><circle cx="213" cy="328" r="11" /><circle cx="225" cy="319" r="12" /><circle cx="240" cy="319" r="12" /><circle cx="251" cy="328" r="11" /><circle cx="220" cy="331" r="7" /><circle cx="232" cy="328" r="7.500" /><circle cx="244" cy="331" r="7" /></g>
            <circle className="f-ink" cx="223" cy="348" r="2.400" /><circle className="f-ink" cx="241" cy="348" r="2.400" />
            <path className="s s-hair" strokeWidth="2.600" d="M218 342q5-3 9 0M237 342q4-3 9 0" />
            <path className="f-hair" d="M222 357q4-6 10-2q6-4 10 2q-5 3-10 0q-5 3-10 0Z" />
            <path className="s s-ink" strokeWidth="2" d="M227 361q5 4 10 0" />
            <circle className="f-pink" opacity=".8" cx="216" cy="355" r="4" /><circle className="f-pink" opacity=".8" cx="248" cy="355" r="4" />
            <path className="s s-white" strokeWidth="1.600" d="M209 357q0 26 21 42M255 357q0 26-21 42M232 399v36" />
            <circle className="f-white" cx="209" cy="356" r="3" /><circle className="f-white" cx="255" cy="356" r="3" />
            <path className="f-pink-deep hi" transform="translate(272 306)" d="M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z" />
          </g>
        </g>
      </g>

      <rect className="f-wood-pale" x="-300" y="470" width="990" height="900" />
      <path className="s s-wood" strokeWidth="2" opacity=".4" d="M-78 500V1300M0 500V1300M78 500V1300M156 500V1300M234 500V1300M312 500V1300M390 500V1300M468 500V1300" />
      <rect className="f-wood" x="-300" y="474" width="990" height="8" opacity=".55" />
      <rect className="f-cream" x="-300" y="452" width="990" height="24" />

      {mood.festive === 'christmas' && (
        <g>
          <circle className="s s-matcha-deep" strokeWidth="9" cx="125" cy="158" r="17" />
          <g className="f-pink-deep"><circle cx="113" cy="150" r="2.500" /><circle cx="137" cy="164" r="2.500" /><circle cx="122" cy="174" r="2.500" /></g>
          <path className="f-pink-deep" d="M125 139l-10-7v12ZM125 139l10-7v12Z" />
        </g>
      )}
      {mood.festive === 'birthday' && (
        <g>
          <path className="s s-ink" strokeWidth="1.200" opacity=".5" d="M22 172q4 50 8 96M44 150q-6 60-12 118M14 138q10 70 16 130" />
          <ellipse className="f-pink" cx="22" cy="152" rx="15" ry="19" /><ellipse className="f-sun" cx="46" cy="130" rx="15" ry="19" /><ellipse className="f-matcha" cx="14" cy="118" rx="15" ry="19" />
        </g>
      )}
      {mood.festive === 'newyear' && (
        <g>
          {Array.from({ length: 22 }, (_, i) => <rect key={i} className={['f-pink-deep', 'f-sun', 'f-matcha-deep', 'f-white'][i % 4]} x={14 + ((i * 53) % 360)} y={84 + ((i * 29) % 70)} width="8" height="3.500" rx="1.700" transform={`rotate(${i * 40} ${18 + ((i * 53) % 360)} ${86 + ((i * 29) % 70)})`} />)}
        </g>
      )}

      <rect className="f-pink-deep" x="34" y="342" width="92" height="22" rx="9" />
      <rect className="f-pink" x="26" y="356" width="108" height="100" rx="14" />
      <rect className="f-cream" x="40" y="370" width="80" height="22" rx="8" /><circle className="f-pink-deep" cx="56" cy="381" r="5" /><circle className="f-matcha" cx="74" cy="381" r="5" />
      <rect className="f-ink" x="62" y="398" width="36" height="10" rx="4" /><rect className="f-ink" x="76" y="406" width="8" height="9" />
      <rect className="f-white" x="67" y="424" width="26" height="24" rx="6" /><path className="s s-white" strokeWidth="4" d="M93 429q9 0 9 6.500t-9 6.500" />
      <rect className="f-pink-deep" x="42" y="446" width="76" height="10" rx="4" />

      <path className="s s-white steam" strokeWidth="4" d="M214 410q-8-12 0-24t0-24" />
      <path className="s s-white steam two" strokeWidth="4" d="M242 408q8-12 0-24t0-24" />
      <path className="f-white" d="M186 428h84a42 32 0 0 1-84 0Z" /><rect className="f-cream-deep" x="214" y="455" width="28" height="5" rx="2" />
      <ellipse className="f-matcha" cx="228" cy="428" rx="42" ry="9" /><ellipse className="f-matcha-pale" cx="221" cy="427" rx="18" ry="3.500" />
      {cup && (
        <g className="held">
          <path className="f-white" d="M248 396h30l-3 38h-24Z" />
          <path style={{ fill: `var(--${cup})` }} d="M250.500 404h25l-2.300 28h-20.400Z" />
          <circle className="f-skin" cx="279" cy="418" r="7" />
          <path className="f-pink-deep hearts" transform="translate(296 386) scale(.5)" d="M0 14c-17-12-13-24-5-24 4 0 5 4 5 4s1-4 5-4c8 0 12 12-5 24Z" />
        </g>
      )}
      <rect className="f-wood" x="284" y="404" width="14" height="28" rx="5" /><path className="f-cream-deep" d="M282 430h18l5 26h-28Z" />

      {decor.includes('flowers') && (
        <>
          <path className="s s-matcha-deep" strokeWidth="2.500" d="M161 434v-24M157 434q-6-12-9-20M165 434q6-12 10-18" />
          <g className="f-pink"><circle cx="161" cy="405" r="7" /><circle cx="146" cy="410" r="6.500" /><circle cx="177" cy="412" r="6.500" /></g>
          <g className="f-sun"><circle cx="161" cy="405" r="2.500" /><circle cx="146" cy="410" r="2.300" /><circle cx="177" cy="412" r="2.300" /></g>
          <path className="f-white" d="M150 432h22l-3 26h-16Z" />
        </>
      )}
      <ellipse className="f-white" cx="340" cy="456" rx="40" ry="6" />
      <g className="f-bake"><ellipse cx="325" cy="446" rx="10" ry="8" /><ellipse cx="355" cy="446" rx="10" ry="8" /><ellipse cx="340" cy="442" rx="13" ry="11" /></g>
      <path className="f-white" opacity=".22" d="M304 454v-16a36 36 0 0 1 72 0v16Z" /><path className="s s-white" strokeWidth="3" opacity=".85" d="M304 454v-16a36 36 0 0 1 72 0v16" /><circle className="f-white" cx="340" cy="399" r="5" />

      {(time === 'morning' || time === 'day') && <path className="f-sun beam" opacity=".17" d="M50 371H215L520 1060H270Z" />}
    </svg>
  );
}
