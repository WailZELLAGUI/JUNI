// Drink recipes. Colours are names of tokens in styles.css (without the leading --).

export type ArtId = 'heart' | 'tulip' | 'bear' | 'flower' | 'cream' | 'berries' | 'mango' | 'mint';

export type Step =
  | { kind: 'tap'; title: string; hint: string; button: string; color: string; count: number; amount: number; ice?: boolean }
  | { kind: 'hold'; title: string; hint: string; button: string; color: string; amount: number }
  | { kind: 'stir'; title: string; hint: string }
  | { kind: 'choose'; title: string; hint: string; options: ArtId[] };

export type Drink = {
  id: string;
  name: string;
  mixed: string;
  foam: string;
  steps: Step[];
  orders: string[];
};

const art = (options: ArtId[]): Step => ({ kind: 'choose', title: 'Finish with a little art', hint: 'Pick the one that feels like today.', options });
const topping = (options: ArtId[]): Step => ({ kind: 'choose', title: 'Add something on top', hint: 'Pick the one that feels like today.', options });
const scoops = (title: string, color: string, count = 2, amount = 0.14): Step => ({ kind: 'tap', title, hint: `${count === 3 ? 'Three' : 'Two'} scoops, one tap each.`, button: 'Add a scoop', color, count, amount });
const shots = (amount = 0.2): Step => ({ kind: 'tap', title: 'Pull the espresso', hint: 'Two shots, one tap each.', button: 'Pull a shot', color: 'coffee', count: 2, amount });
const fruit = (title: string, color: string): Step => ({ kind: 'tap', title, hint: 'Three spoonfuls, one tap each.', button: 'Add a spoonful', color, count: 3, amount: 0.2 });
const ice: Step = { kind: 'tap', title: 'Drop in the ice', hint: 'Three cubes, one tap each.', button: 'Add a cube', color: 'white', count: 3, amount: 0, ice: true };
const pour = (title: string, amount: number, hint = 'Press and hold until the glass is full.'): Step => ({ kind: 'hold', title, hint, button: 'Hold to pour', color: 'milk', amount });
const stir = (title: string): Step => ({ kind: 'stir', title, hint: 'Swirl your finger around the cup.' });

export const drinks: Drink[] = [
  {
    id: 'matcha-latte', name: 'Matcha latte', mixed: 'matcha-milk', foam: 'milk',
    steps: [scoops('Add the matcha', 'matcha-deep'), pour('Pour the warm milk', 0.62), stir('Whisk it smooth'), art(['heart', 'tulip', 'bear'])],
    orders: ['One matcha latte, with extra love.', 'A matcha latte, please. The way only you make it.', 'The usual matcha, and a smile if you have one.'],
  },
  {
    id: 'iced-matcha', name: 'Iced matcha latte', mixed: 'matcha-milk', foam: 'milk',
    steps: [ice, scoops('Add the matcha', 'matcha-deep'), pour('Pour the cold milk', 0.6), stir('Whisk it smooth'), topping(['cream', 'mint', 'heart'])],
    orders: ['An iced matcha, please. It is too warm to miss you this much.', 'One iced matcha latte, cold drink, warm heart.'],
  },
  {
    id: 'cappuccino', name: 'Cappuccino', mixed: 'coffee-milk', foam: 'milk',
    steps: [shots(), pour('Pour the steamed milk', 0.56), stir('Give it a gentle stir'), art(['heart', 'tulip', 'flower'])],
    orders: ['A cappuccino, please, with lots of foam.', 'One cappuccino for a sleepy boy who misses you.', 'A cappuccino, and five minutes of your company.'],
  },
  {
    id: 'iced-latte', name: 'Iced latte', mixed: 'coffee-milk', foam: 'milk',
    steps: [ice, shots(0.18), pour('Pour the cold milk', 0.58), stir('Give it a swirl'), topping(['cream', 'heart', 'flower'])],
    orders: ['An iced latte, please. And your number, I forgot I have it.', 'One iced latte, as cool as you are.'],
  },
  {
    id: 'strawberry-matcha', name: 'Strawberry matcha', mixed: 'straw-milk', foam: 'milk',
    steps: [fruit('Add the strawberries', 'straw'), ice, pour('Pour the cold milk', 0.42, 'Press and hold until it is nearly full.'), scoops('Top it with matcha', 'matcha'), stir('Swirl it together'), topping(['berries', 'heart', 'cream'])],
    orders: ['A strawberry matcha, as sweet as you.', 'One strawberry matcha, please. Pink and green, like us.'],
  },
  {
    id: 'ube-latte', name: 'Ube latte', mixed: 'ube-milk', foam: 'milk',
    steps: [scoops('Add the ube', 'ube'), pour('Pour the warm milk', 0.62), stir('Stir until it turns lilac'), art(['heart', 'flower', 'bear'])],
    orders: ['An ube latte, please. Purple is my second favourite colour, after your eyes.', 'One warm ube latte, soft and sweet like you.'],
  },
  {
    id: 'iced-ube', name: 'Iced ube latte', mixed: 'ube-milk', foam: 'milk',
    steps: [ice, scoops('Add the ube', 'ube'), pour('Pour the cold milk', 0.6), stir('Stir until it turns lilac'), topping(['cream', 'heart', 'flower'])],
    orders: ['An iced ube latte, please. The prettiest drink for the prettiest girl.', 'One iced ube, and one long look at you.'],
  },
  {
    id: 'matcha-mango', name: 'Matcha mango', mixed: 'mango-matcha', foam: 'milk',
    steps: [fruit('Add the mango', 'mango'), ice, pour('Pour the cold milk', 0.42, 'Press and hold until it is nearly full.'), scoops('Top it with matcha', 'matcha'), stir('Swirl it together'), topping(['mango', 'mint', 'heart'])],
    orders: ['A matcha mango, please. Sunshine in a glass, like you.', 'One matcha mango, sweet first and green after.'],
  },
  {
    id: 'hot-chocolate', name: 'Hot chocolate', mixed: 'cocoa-milk', foam: 'milk',
    steps: [scoops('Add the cocoa', 'cocoa', 2, 0.16), pour('Pour the hot milk', 0.6), stir('Stir until it is silky'), art(['bear', 'heart', 'flower'])],
    orders: ['A hot chocolate, please. Today feels like a cosy one.', 'One hot chocolate, to keep me warm until I see you.'],
  },
  {
    id: 'mocha', name: 'Mocha', mixed: 'cocoa-milk', foam: 'milk',
    steps: [shots(0.16), scoops('Add the cocoa', 'cocoa', 2, 0.12), pour('Pour the steamed milk', 0.5), stir('Stir it together'), art(['heart', 'tulip', 'bear'])],
    orders: ['A mocha, please. Coffee and chocolate, the second best couple I know.', 'One mocha, a little sweet and a little strong.'],
  },
  {
    id: 'strawberry-smoothie', name: 'Strawberry smoothie', mixed: 'straw-milk', foam: 'milk',
    steps: [fruit('Add the strawberries', 'straw'), ice, pour('Pour the yoghurt', 0.5), stir('Blend it smooth'), topping(['berries', 'cream', 'heart'])],
    orders: ['A strawberry smoothie, please. Pink, like your cheeks when I flirt.', 'One strawberry smoothie, the sweetest thing here after you.'],
  },
  {
    id: 'mango-smoothie', name: 'Mango smoothie', mixed: 'mango-milk', foam: 'milk',
    steps: [fruit('Add the mango', 'mango'), ice, pour('Pour the yoghurt', 0.5), stir('Blend it smooth'), topping(['mango', 'cream', 'mint'])],
    orders: ['A mango smoothie, please. I need something as bright as you.', 'One mango smoothie, pure sunshine.'],
  },
];
