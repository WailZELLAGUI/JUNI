# JUNI

A little coffee shop for Juju. Every morning Nini orders a drink, Juju makes it, and a note from Nini is waiting at the end.

## Changing what Juju sees

Everything written by Nini lives in three small files. Edit them on GitHub (the pencil button), save, and the shop updates itself a minute or two later.

| File | What it holds |
|---|---|
| `src/content/messages.ts` | The daily notes, grouped by mood, and the notes for special days |
| `src/content/rewards.ts` | What a full stamp card unlocks: shop decorations and secret letters |
| `src/content/drinks.ts` | The menu and the lines Nini uses to order |

**Add a daily note:** add a new line of text, in quotes and followed by a comma, to any list in `messages.ts`. One note is shown per day and none repeats until all have been seen.

**Add a special day:** add an entry to `specials` in `messages.ts`, keyed by month and day. For 14 February:

```ts
'02-14': {
  title: 'Happy Valentine\'s Day',
  text: 'Your note for that day.',
  order: 'What Nini orders that day (optional).',
},
```

If a note contains an apostrophe, write it as `\'`.

## Trying things out

- Add `?day=2026-12-23` to the link to see any date.
- Add `?reset` to the link to empty the letter box, stickers and stamps on that device.

## Working on the code

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Progress is saved on Juju's phone only. Adding JUNI to the home screen (Share, then Add to Home Screen) keeps it safest, and it should be done before she starts collecting, because the home-screen app keeps its own separate save.
