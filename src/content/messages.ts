// Nini's notes to Juju.
// To add a note, add a line of text to any list below. One note is shown per day,
// and none repeats until every note has been seen.

export const notes: Record<string, string[]> = {
  morning: [
    'Good morning, beautiful. Today is a good day, I can feel it.',
    'Good morning, sunshine. I hope today treats you as gently as you deserve.',
    'Rise and shine, my love. The world is nicer when you are awake.',
    'Good morning, Juju. I hope your first sip today tastes like a hug.',
    'A new day, a new cup, and the same boy who adores you.',
    'Good morning, my favourite girl. Go slowly, the day will wait for you.',
    'The sun came out early just to see you. So did I.',
    'Good morning, pretty. Whatever today brings, you are ready for it.',
    'Morning, my heart. I already know you are going to make today lovely.',
  ],
  proud: [
    'I am so proud of you, Juju. Never forget how amazing you are.',
    'You are doing so much better than you think. I see it every day.',
    'Look how far you have come. I am proud of every single step.',
    'You work so hard and you stay so kind. That is rare, and it is you.',
    'Whatever you do today, I am already proud of you.',
    'You make difficult things look graceful. I notice, always.',
    'I brag about you in my head all day long.',
  ],
  missing: [
    'A little reminder that someone is thinking about you right now. It is me.',
    'I miss you. This coffee is only an excuse to see your smile.',
    'I came in for a matcha, but really I came for you.',
    'I would cross the whole city for five minutes at your counter.',
    'Every place is a little better when you are in it. I miss you there.',
    'I keep a seat for you in every one of my thoughts.',
  ],
  compliments: [
    'You have the prettiest smile in any coffee shop, anywhere.',
    'You make ordinary mornings feel like a small celebration.',
    'Your laugh is my favourite sound. Please use it a lot today.',
    'You are the softest, warmest part of my day.',
    'Being around you feels like sunlight through a window.',
    'You are beautiful today. Yes, today too. Yes, like that.',
    'The best thing on the menu is the girl behind the counter.',
    'You are my favourite hello.',
  ],
  cute: [
    'Today\'s special ingredient is a little reminder that you are loved.',
    'This order comes with one kiss on the forehead. Collect it soon.',
    'I like you more than matcha likes milk.',
    'If I had a loyalty card for loving you, it would be full of stamps.',
    'Five stars. I will be back tomorrow, and every day after.',
    'I ordered a small drink and left with a very big crush.',
    'You plus me plus something warm to drink. That is the whole recipe.',
    'Please keep the change, and also my heart.',
    'I love you a latte. I had to say it once.',
  ],
  gentle: [
    'Take a deep breath. You have got this, my favourite girl.',
    'It is going to be better today. And I am right here, either way.',
    'If today feels heavy, put some of it down. I will help you carry the rest.',
    'You do not have to do everything today. Being you is already enough.',
    'Hard days end. My love for you does not.',
    'Be kind to yourself today, the way you are kind to everyone else.',
    'Small steps count. A warm drink counts. You count, most of all.',
    'Whatever happens today, tonight you still have me.',
  ],
};

// Notes for special days, keyed by month-day. These always win over the daily note.
export const specials: Record<string, { title: string; text: string; order?: string }> = {
  '10-06': {
    title: 'Happy birthday, Juju',
    text: 'Happy birthday, my love. The world got so much better the day you arrived. Today everything is on the house, and all of my heart too.',
    order: 'The birthday girl\'s favourite, please. She deserves the best cup of the year.',
  },
  '12-23': {
    title: 'A birthday wish',
    text: 'It is my birthday today, and I already have the best gift. It is you. Thank you for being mine.',
    order: 'A birthday drink for me, made by my favourite person.',
  },
  '12-25': {
    title: 'Merry Christmas',
    text: 'Merry Christmas, my Juju. You are the warmest, brightest part of my winter.',
    order: 'Something warm for Christmas morning, please.',
  },
  '01-01': {
    title: 'Happy New Year',
    text: 'Happy New Year, my love. A whole new year of mornings with you. I cannot wait for every one of them.',
    order: 'The first drink of the year, for the first person in my heart.',
  },
};
