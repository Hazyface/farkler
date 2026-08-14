# Farkler

The dice game Farkle, with your own dice or its own. One self-contained HTML file — no build
step, no dependencies, no network. Open it and play.

## Running it

**On a computer:** open `index.html`.

**On an iPad or iPhone:** serve the folder with any small web server app and open it in Safari,
then Share → **Add to Home Screen** to get a full-screen app with no browser chrome.

Serve it from your Mac instead with:

```bash
python3 -m http.server 8000
```

…then open `http://<your-mac-ip>:8000/` on the tablet.

### Offline

`sw.js` caches the app so the Home Screen icon still works when the server isn't running.
Service workers only register on `localhost` or HTTPS — over a plain IP address the app still
plays, it just can't save an offline copy. The 🏠 menu shows which address you're on and whether
the offline copy took.

## Playing

Setup opens on one question that changes the whole screen — **Where are the dice?** — answered by
picking one of two tiles: on the table, or in the app. It remembers what you picked last time.

### Real dice

Tap a button for each scoring combo you roll; they stack up in the pot. **Bank it** to keep them,
**Farkle** when you roll nothing and lose the lot.

- **Singles** — the 1 and the 5 get the two big buttons, since they're most of the taps.
- **Three of a kind** (teal), **more of a kind** (amber), **special rolls** (purple).
- **House rules** — name your own scoring, say what it's worth and how many dice it uses, and it
  becomes a button that sticks around between games.
- **Hot dice** — when all six get set aside, the app notices and celebrates.

### Virtual dice

A black cup on red felt. Tap it and six white dice spill out and scatter — a small collision
sim, so they bounce off the rails and off each other and land where they land. The dice are
treated as the squares they are (a separating-axis test on four edge directions), so two of
them meeting corner-first push apart instead of overlapping, and no two knocks come off quite
the same. They hop as they leave the cup and the faces turn over at the speed the die is going,
so the tumbling slows down as the die does.

- **Tap what you're keeping.** Six identical white dice — the felt tells you nothing about which
  ones are worth anything, so read your own roll. The bar adds up your picks as you go and won't
  let you set aside a handful that doesn't fully score — no leaving a stray 3 in with your three 5s.
- **A dud makes a rude noise.** Tap a die that can't be part of any combination and it flashes red
  and farts at you.
- **The bar knows the best combo.** With nothing selected it names the biggest thing on the table
  and what it's worth; tap the bar to take it in one go.
- **Set & roll** drops those dice into the tally, adds the points to your pot and throws what's
  left. Set all six and hot dice hands you a fresh six.
- **Farkle calls itself** — but not straight away. It gives you half a second per die to find
  something in there yourself (three seconds on a full six) before the felt flashes red and takes
  your turn.

Everything else — banking, letting it ride, house rules, undo, the scoresheet — works exactly the
same. Undo steps back through throws and set-asides the way it steps through button presses.

### Rollerbots

Tap the 🤖 beside a name and the app plays that seat, so you can play on your own. A Rollerbot
always rolls on the felt, even in a game where the people are using real dice — it can't very
well pick up the ones on your table. It shakes the cup, picks its dice up one at a time, and the
bar under the felt says what it's doing and why.

The interesting part is what it keeps. Taking every die that scores is the beginner's mistake:
a 1 with three 2s is 300 points all in, but keeping *just the 1* is worth about 400, because
five dice to throw beats two. Each bot works this out from the actual odds — every way its dice
could land, every legal handful it could keep, and what the rest of the turn is worth after each
one. The only thing that separates them is how much of an edge they need before they'll risk
the pot:

| | |
| --- | --- |
| 🐢 **Careful** | Good picks, then quits while it's ahead. Stops on three dice. |
| 🤖 **Steady** | Plays it straight — rolls whenever rolling is worth more than banking. |
| 😈 **Gambler** | Leaves dice out for the chance of a big throw, rolls on two, sometimes goes for it on one. Farkles nearly twice as often. |
| 🤪 **Screwball** | Draws a new temperament every turn and announces it. Occasionally more cautious than Careful; occasionally unhinged. |

Over a few hundred thousand simulated turns, Careful averages 588 a turn, Steady 602, and the
Gambler 578 with a farkle rate of 38% against the others' 15–21%. Head to head, Steady beats
Careful about 53–47 and the Gambler about 54–46.

They know the rules they're playing under, too: a bot that isn't on the board keeps rolling
until it can bank the opening 500, one chasing a leader on the last lap won't bank anything
short of the lead, and one that can cross the target takes it. Undo during a bot's turn parks
it rather than letting it instantly replay the move you just took back — tap the bar under the
felt to set it going again.
- **Let it ride** — when someone banks, the next player can pick up their total and keep rolling
  with the dice left on the table. Score and it's theirs; farkle and it's gone.
- **Finishing** — first past the target starts the last lap. Everyone else gets one turn to take
  the lead, and each column shows exactly what they need. Take the lead and the lap resets around
  you. A full lap with nobody passing the leader ends it.

Undo and redo step through every single press. Players, icons, and house rules are remembered
between games; benched players are one tap from rejoining.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The entire game — markup, styles, logic, dice physics, and synthesized sound |
| `sw.js` | Service worker, for offline launches from the Home Screen |
| `icon-180.png` | Home Screen icon |

There is deliberately no web app manifest. On iOS a manifest's `start_url` overrides the page you
were viewing when you tapped Add to Home Screen, which is an easy way to end up with an icon that
opens a URL nothing serves. Without one, iOS bookmarks exactly the page you were on and takes the
standalone/title/icon settings from the `apple-*` meta tags.

## Notes

Sound is synthesized with the Web Audio API — nothing is downloaded. It is not tasteful.
There is a mute button.
