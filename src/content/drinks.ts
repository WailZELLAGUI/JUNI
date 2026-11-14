// Drink recipes. Colours are names of tokens in styles.css (without the leading --).

export type ArtId =
  | 'heart' | 'rosetta' | 'tulip' | 'bear' | 'flower' | 'swirl'
  | 'cream' | 'berries' | 'mango' | 'mint' | 'drizzle' | 'sprinkles' | 'marshmallows' | 'cocoa' | 'sugarheart';

export type Vessel = 'glass' | 'bowl' | 'blender';
export type Item = 'powder' | 'strawberry' | 'mango' | 'ice';

export type Step =
  | { kind: 'scoop'; title: string; hint: string; button: string; into: Vessel; item: Item; color: string; count: number; amount: number }
  | { kind: 'pour'; title: string; hint: string; into: 'glass' | 'blender'; from: 'pitcher' | 'bowl' | 'blender'; color: string; amount: number }
  | { kind: 'brew' | 'steam' | 'blend' | 'whisk' | 'stir'; title: string; hint: string }
  | { kind: 'choose'; title: string; hint: string; options: ArtId[]; multi: boolean };

export type Drink = { id: string; name: string; mixed: string; foam: string; steps: Step[]; orders: string[] };

const words = ['', 'One', 'Two', 'Three'];
const scoop = (title: string, color: string, into: Vessel = 'glass', count = 2, amount = 0.14): Step =>
  ({ kind: 'scoop', title, hint: `${words[count]} scoops, one tap each.`, button: 'Add a scoop', into, item: 'powder', color, count, amount });
const fruit = (title: string, item: 'strawberry' | 'mango', into: Vessel): Step =>
  ({ kind: 'scoop', title, hint: 'Three pieces, one tap each.', button: 'Add a piece', into, item, color: item === 'mango' ? 'mango' : 'straw', count: 3, amount: 0.2 });
const ice = (into: Vessel = 'glass', count = 3): Step =>
  ({ kind: 'scoop', title: 'Drop in the ice', hint: `${words[count]} cubes, one tap each.`, button: 'Add a cube', into, item: 'ice', color: 'white', count, amount: 0 });
const pour = (title: string, amount: number, color = 'milk', from: 'pitcher' | 'bowl' | 'blender' = 'pitcher', into: 'glass' | 'blender' = 'glass'): Step =>
  ({ kind: 'pour', title, hint: 'Press and hold until it stops.', into, from, color, amount });
const brew: Step = { kind: 'brew', title: 'Pull the espresso', hint: 'Press and hold while the shot runs.' };
const steam: Step = { kind: 'steam', title: 'Steam the milk', hint: 'Press and hold until it is just warm enough.' };
const whisk: Step = { kind: 'whisk', title: 'Whisk the matcha', hint: 'Add a splash of hot water, then whisk back and forth.' };
const blend: Step = { kind: 'blend', title: 'Blend it smooth', hint: 'Press and hold until the fruit disappears.' };
const stir = (title: string): Step => ({ kind: 'stir', title, hint: 'Swirl your finger around the cup.' });
const art: Step = { kind: 'choose', title: 'Finish with latte art', hint: 'Pick one, or draw your own.', options: ['heart', 'rosetta', 'tulip', 'bear', 'flower', 'swirl'], multi: false };
const top = (first: ArtId, second: ArtId = 'mint'): Step =>
  ({ kind: 'choose', title: 'Dress it up', hint: 'Add as many as you like.', options: ['cream', first, second, 'drizzle', 'sprinkles', 'sugarheart'], multi: true });

export const drinks: Drink[] = [
  {
    id: 'matcha-latte', name: 'Matcha latte', mixed: 'matcha-milk', foam: 'milk',
    steps: [scoop('Scoop the matcha', 'matcha-deep', 'bowl'), whisk, steam, pour('Pour the warm milk', 0.55), pour('Pour the matcha over', 0.24, 'matcha', 'bowl'), art],
    orders: ['One matcha latte, with extra love.', 'A matcha latte, please. The way only you make it.', 'The usual matcha, and a smile if you have one.'],
  },
  {
    id: 'iced-matcha', name: 'Iced matcha latte', mixed: 'matcha-milk', foam: 'milk',
    steps: [scoop('Scoop the matcha', 'matcha-deep', 'bowl'), whisk, ice(), pour('Pour the cold milk', 0.5), pour('Pour the matcha over', 0.24, 'matcha', 'bowl'), top('mint', 'berries')],
    orders: ['An iced matcha, please. It is too warm to miss you this much.', 'One iced matcha latte, cold drink, warm heart.'],
  },
  {
    id: 'cappuccino', name: 'Cappuccino', mixed: 'coffee-milk', foam: 'milk',
    steps: [brew, steam, pour('Pour the steamed milk', 0.52), stir('Give it a gentle stir'), art],
    orders: ['A cappuccino, please, with lots of foam.', 'One cappuccino for a sleepy boy who misses you.', 'A cappuccino, and five minutes of your company.'],
  },
  {
    id: 'iced-latte', name: 'Iced latte', mixed: 'coffee-milk', foam: 'milk',
    steps: [ice(), brew, pour('Pour the cold milk', 0.52), stir('Give it a swirl'), top('cocoa', 'mint')],
    orders: ['An iced latte, please. And your number, I forgot I have it.', 'One iced latte, as cool as you are.'],
  },
  {
    id: 'strawberry-matcha', name: 'Strawberry matcha', mixed: 'straw-milk', foam: 'milk',
    steps: [fruit('Spoon in the strawberries', 'strawberry', 'glass'), ice(), pour('Pour the cold milk', 0.36), whisk, pour('Pour the matcha over', 0.2, 'matcha', 'bowl'), top('berries')],
    orders: ['A strawberry matcha, as sweet as you.', 'One strawberry matcha, please. Pink and green, like us.'],
  },
  {
    id: 'ube-latte', name: 'Ube latte', mixed: 'ube-milk', foam: 'milk',
    steps: [scoop('Add the ube', 'ube'), steam, pour('Pour the warm milk', 0.6), stir('Stir until it turns lilac'), art],
    orders: ['An ube latte, please. Purple is my second favourite colour, after your eyes.', 'One warm ube latte, soft and sweet like you.'],
  },
  {
    id: 'iced-ube', name: 'Iced ube latte', mixed: 'ube-milk', foam: 'milk',
    steps: [scoop('Add the ube', 'ube'), ice(), pour('Pour the cold milk', 0.58), stir('Stir until it turns lilac'), top('berries', 'cocoa')],
    orders: ['An iced ube latte, please. The prettiest drink for the prettiest girl.', 'One iced ube, and one long look at you.'],
  },
  {
    id: 'matcha-mango', name: 'Matcha mango', mixed: 'mango-matcha', foam: 'milk',
    steps: [fruit('Spoon in the mango', 'mango', 'glass'), ice(), pour('Pour the cold milk', 0.36), whisk, pour('Pour the matcha over', 0.2, 'matcha', 'bowl'), top('mango')],
    orders: ['A matcha mango, please. Sunshine in a glass, like you.', 'One matcha mango, sweet first and green after.'],
  },
  {
    id: 'hot-chocolate', name: 'Hot chocolate', mixed: 'cocoa-milk', foam: 'milk',
    steps: [scoop('Add the cocoa', 'cocoa', 'glass', 2, 0.16), steam, pour('Pour the hot milk', 0.58), stir('Stir until it is silky'), { kind: 'choose', title: 'Dress it up', hint: 'Add as many as you like.', options: ['cream', 'marshmallows', 'cocoa', 'drizzle', 'sprinkles', 'sugarheart'], multi: true }],
    orders: ['A hot chocolate, please. Today feels like a cosy one.', 'One hot chocolate, to keep me warm until I see you.'],
  },
  {
    id: 'mocha', name: 'Mocha', mixed: 'cocoa-milk', foam: 'milk',
    steps: [brew, scoop('Add the cocoa', 'cocoa', 'glass', 2, 0.12), steam, pour('Pour the steamed milk', 0.46), stir('Stir it together'), art],
    orders: ['A mocha, please. Coffee and chocolate, the second best couple I know.', 'One mocha, a little sweet and a little strong.'],
  },
  {
    id: 'strawberry-smoothie', name: 'Strawberry smoothie', mixed: 'straw-milk', foam: 'milk',
    steps: [fruit('Drop in the strawberries', 'strawberry', 'blender'), ice('blender', 2), pour('Pour in the yoghurt', 1, 'milk', 'pitcher', 'blender'), blend, pour('Pour it into the glass', 0.76, 'straw-milk', 'blender'), top('berries')],
    orders: ['A strawberry smoothie, please. Pink, like your cheeks when I flirt.', 'One strawberry smoothie, the sweetest thing here after you.'],
  },
  {
    id: 'mango-smoothie', name: 'Mango smoothie', mixed: 'mango-milk', foam: 'milk',
    steps: [fruit('Drop in the mango', 'mango', 'blender'), ice('blender', 2), pour('Pour in the yoghurt', 1, 'milk', 'pitcher', 'blender'), blend, pour('Pour it into the glass', 0.76, 'mango-milk', 'blender'), top('mango')],
    orders: ['A mango smoothie, please. I need something as bright as you.', 'One mango smoothie, pure sunshine.'],
  },
];
