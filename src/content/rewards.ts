// What a full stamp card unlocks, in order. One card is five served orders.
// Decorations appear in the shop; secret letters are kept in the letter box.

export const CARD = 5;

export type Reward =
  | { kind: 'decor'; id: 'lights' | 'flowers' | 'frame'; name: string; text: string }
  | { kind: 'letter'; name: string; text: string };

export const rewards: Reward[] = [
  { kind: 'decor', id: 'lights', name: 'Fairy lights', text: 'A string of little lights for the shop. They are already up, go and see.' },
  {
    kind: 'letter',
    name: 'Why I keep coming back',
    text: 'Juju, I could say I come here for the matcha, but we both know the truth. I come for the way you look when you concentrate, for the small smile you try to hide, and for the feeling that the day has properly started once I have seen you. You are my favourite habit. I love you.',
  },
  { kind: 'decor', id: 'flowers', name: 'Fresh flowers', text: 'A little vase of pink flowers for the counter, because you deserve flowers every day.' },
  {
    kind: 'letter',
    name: 'Things I never get tired of',
    text: 'Your laugh when something is really funny. Your voice when you are sleepy. The way you get excited about a good drink. How kind you are when nobody is watching. How you make me want to be softer and better. I never get tired of any of it, and I never will.',
  },
  { kind: 'decor', id: 'frame', name: 'Our picture', text: 'A little frame for the wall, with the two of us in it. The shop was missing it.' },
  {
    kind: 'letter',
    name: 'For the days you doubt yourself',
    text: 'My Juju, on the days you feel small, please borrow my eyes for a minute. I see someone brave, gentle, clever and so beautiful. I see someone who keeps going. I am proud to be yours, today and on every ordinary day after it.',
  },
];
