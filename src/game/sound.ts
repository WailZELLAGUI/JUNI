// Small synthesised sounds. Nothing to download, and silent unless Juju turns sound on.

const KEY = 'juni.sound';
let enabled = false;
let ctx: AudioContext | null = null;
let pour: { src: AudioBufferSourceNode; gain: GainNode } | null = null;

try {
  enabled = localStorage.getItem(KEY) === '1';
} catch {
  // Storage blocked: sound simply stays off.
}

export const soundOn = () => enabled;

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // The choice just will not be remembered.
  }
  if (on) play('pop');
  else stopPour();
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
    tone(c, 300, 170, 0, 0.1, 0.12, 'triangle');
    tone(c, 320, 180, 0.16, 0.1, 0.12, 'triangle');
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
