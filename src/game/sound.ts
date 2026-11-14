// Small synthesised sounds. Nothing to download, and silent unless Juju turns sound on.

const KEY = 'juni.sound';
// 0 is silent, 1 is sound effects, 2 is sound effects and music.
export type Level = 0 | 1 | 2;
let level: Level = 0;
let enabled = false;
let ctx: AudioContext | null = null;
let pour: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let music: number | undefined;

try {
  const saved = Number(localStorage.getItem(KEY));
  level = saved === 1 || saved === 2 ? saved : 0;
  enabled = level > 0;
} catch {
  // Storage blocked: sound simply stays off.
}

export const soundLevel = () => level;

export function setSound(next: Level) {
  level = next;
  enabled = next > 0;
  try {
    localStorage.setItem(KEY, String(next));
  } catch {
    // The choice just will not be remembered.
  }
  if (enabled) play('pop');
  else stopPour();
  syncMusic();
}

function audio(): AudioContext | null {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, from: number, to: number, at: number, length: number, volume = 0.1, type: OscillatorType = 'sine') {
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + at;
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + length + 0.02);
}

// A small dog's bark: a buzzy voice that drops in pitch, shaped by a mouth-like filter, plus a breath of noise.
function bark(c: AudioContext, at: number, pitch: number) {
  const t = c.currentTime + at;
  const voice = c.createOscillator();
  voice.type = 'sawtooth';
  voice.frequency.setValueAtTime(720 * pitch, t);
  voice.frequency.exponentialRampToValueAtTime(300 * pitch, t + 0.11);
  const mouth = c.createBiquadFilter();
  mouth.type = 'bandpass';
  mouth.frequency.setValueAtTime(1500, t);
  mouth.frequency.exponentialRampToValueAtTime(800, t + 0.11);
  mouth.Q.value = 1.4;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.5, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  voice.connect(mouth).connect(gain).connect(c.destination);
  voice.start(t);
  voice.stop(t + 0.16);

  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const breath = c.createBufferSource();
  breath.buffer = buffer;
  const air = c.createBiquadFilter();
  air.type = 'bandpass';
  air.frequency.value = 1800;
  const airGain = c.createGain();
  airGain.gain.value = 0.12;
  breath.connect(air).connect(airGain).connect(c.destination);
  breath.start(t);
}

export type Sound = 'plop' | 'ding' | 'chime' | 'bell' | 'woof' | 'pop';

export function play(name: Sound) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  if (name === 'plop') tone(c, 420, 210, 0, 0.14);
  if (name === 'pop') tone(c, 560, 900, 0, 0.1, 0.08);
  if (name === 'ding') {
    tone(c, 880, 880, 0, 0.3, 0.08);
    tone(c, 1320, 1320, 0.09, 0.4, 0.06);
  }
  if (name === 'chime') [660, 880, 1100, 1320].forEach((f, i) => tone(c, f, f, i * 0.11, 0.5, 0.07));
  if (name === 'bell') {
    tone(c, 1568, 1568, 0, 0.6, 0.06, 'triangle');
    tone(c, 2093, 2093, 0.16, 0.7, 0.05, 'triangle');
  }
  if (name === 'woof') {
    bark(c, 0, 1);
    bark(c, 0.19, 1.12);
  }
}

// A soft hiss while the milk is pouring.
export function startPour() {
  if (!enabled || pour) return;
  const c = audio();
  if (!c) return;
  const buffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  const gain = c.createGain();
  gain.gain.value = 0.035;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
  pour = { src, gain };
}

export function stopPour() {
  if (!pour) return;
  try {
    pour.src.stop();
  } catch {
    // Already stopped.
  }
  pour = null;
}

// A slow, quiet loop of four soft chords with a few high notes, like a cafe playlist heard from the next room.
const CHORDS = [
  [174.61, 220, 261.63, 329.63],
  [164.81, 196, 246.94, 293.66],
  [146.83, 174.61, 220, 261.63],
  [130.81, 164.81, 196, 246.94],
];
let bar = 0;

function playBar() {
  const c = audio();
  if (!c || c.state !== 'running') return;
  const chord = CHORDS[bar % CHORDS.length];
  const t = c.currentTime + 0.05;
  chord.forEach((f) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.022, t + 1.2);
    gain.gain.linearRampToValueAtTime(0.0001, t + 4.4);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 4.5);
  });
  [0.4, 1.6, 2.6].forEach((at, i) => tone(c, chord[(bar + i * 2) % 4] * 2, chord[(bar + i * 2) % 4] * 2, at, 1.1, 0.018, 'triangle'));
  bar++;
}

export function syncMusic() {
  const want = level === 2 && document.visibilityState === 'visible';
  if (want && music === undefined) {
    playBar();
    music = window.setInterval(playBar, 4000);
  }
  if (!want && music !== undefined) {
    clearInterval(music);
    music = undefined;
  }
}
document.addEventListener('visibilitychange', syncMusic);
// Music can only start after a first touch, so try again on the first one.
window.addEventListener('pointerdown', syncMusic, { once: true });
