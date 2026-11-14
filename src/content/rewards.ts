// What a full stamp card unlocks, in order. One card is five served orders.
// Decorations appear in the shop; secret letters are kept in the letter box.
// To add a secret letter, copy one of the letter blocks at the end and change its name and text.

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
  {
    kind: 'letter',
    name: 'The first time',
    text: 'I still remember what it felt like when I realised you were not like anyone else. It was not loud. It was quiet and certain, like recognising a song. Since then, every ordinary thing has been a little better because you exist in my days. Thank you for letting me love you.',
  },
  {
    kind: 'letter',
    name: 'What home means',
    text: 'People say home is a place. I think it is a person. It is the way I breathe more slowly when I hear your voice, and the way a bad day ends the second you say my name. Wherever we go, Juju, if you are there, I am home.',
  },
  {
    kind: 'letter',
    name: 'A promise',
    text: 'I cannot promise that every day will be easy. I can promise that I will show up for all of them. On the good mornings and the grumpy ones, when you are shining and when you are tired. I am not going anywhere. That is the easiest promise I have ever made.',
  },
  {
    kind: 'letter',
    name: 'Little things I love',
    text: 'The face you make when you taste something good. How you say my name when you want something. Your cold hands. Your warm heart. The way you care about the smallest details. You think nobody notices these things. I notice all of them, and I love every one.',
  },
  {
    kind: 'letter',
    name: 'When we are old',
    text: 'One day we will be old, and I hope we are still doing this. Me asking for my drink, you pretending to be annoyed, both of us laughing. I do not need a big life, Juju. I need a long one, with you in it.',
  },
  {
    kind: 'letter',
    name: 'Thank you',
    text: 'Thank you for your patience with me. Thank you for your kindness on the days I did not deserve it. Thank you for laughing at my jokes, even the bad ones. Thank you for choosing me, again and again. I will spend a very long time making sure you never regret it.',
  },
  {
    kind: 'letter',
    name: 'Just so you know',
    text: 'If you ever wonder whether you are loved, come back to this letter. The answer is yes. Completely, patiently, and more every day. You are the best thing that has happened to me, and I wanted it written down somewhere you can always find it.',
  },
];
