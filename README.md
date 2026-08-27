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
plays, it just can't save an offline copy.

The page itself asks the network first and only falls back to the cached copy, so a change shows
up on the launch you're looking at rather than the one after it. The network gets 3.5 seconds to
answer before the saved copy takes over, which is what stops a bad connection hanging the launch
on a blank screen. The ☰ menu shows the version and the time it was built, the address you're on,
whether you came in from the Home Screen and whether the offline copy took — and **Get the latest
version** scrubs every worker and cache for that address and reloads clean, for when the answer
to "did the update land?" is no.

## Playing

Setup opens on one question that changes the whole screen — **Where are the dice?** — answered by
picking one of two tiles: on the table, or in the app. It remembers what you picked last time.

Under the players: **Play to** and **Get on the board with** are both fields, grouped as you type,
so the target reads 10,000 rather than 10000 — and the caret is put back where it was among the
digits, not where it was in the string, or it walks left every time a comma appears in front of
it. The opening minimum is whatever you say it is, with its own switch beside it, and it reads
with its separator everywhere it's printed. At the bottom, **How scoring works here** shows the
working rather than describing it: every combination that scores, drawn as the buttons you'll be
tapping, including whatever house rules this table has saved. They're plain divs — there is
nothing to press on the setup screen, and fifteen real buttons would be fifteen more stops on the
way round with Tab.

### Real dice

Tap a button for each scoring combo you roll; they stack up in the pot. **Bank it** to keep them,
**Farkle** when you roll nothing and lose the lot.

- **Singles** — the 1 and the 5 get the two big buttons, since they're most of the taps.
- **Three of a kind** (teal), **more of a kind** (amber), **special rolls** (purple).
- **House rules** — name your own scoring, say what it's worth and how many dice it uses, and it
  becomes a button that sticks around between games.
- **Hot dice** — when all six get set aside, the app notices and celebrates.

### Virtual dice

A leather cup on red felt. Tap it and six white dice spill out and scatter — a small collision
sim, so they bounce off the rails and off each other and land where they land. The dice are
treated as the squares they are (a separating-axis test on four edge directions), so two of
them meeting corner-first push apart instead of overlapping, and no two knocks come off quite
the same. They hop as they leave the cup, and they tumble at the speed they're travelling, so
the turning winds down as the die does.

**The dice are real cubes.** Each one is six faces hinged around its middle in CSS 3D, under a
single camera over the table — so a die out near the rail shows you its side the way it would
in a photograph taken from above, and rolling is the cube actually turning over rather than a
flat square whose pips change. Some notes on what that took:

- **Rounded corners need a plug.** Six rounded faces meeting at a cube's corner leave a pinhole
  where three of them fall away, and you see the felt straight through it. One dark rounded panel
  across the middle of the die stops all eight — dark, because a corner you're looking into is in
  shadow anyway.
- **No `drop-shadow` anywhere above a cube.** A filter flattens everything beneath it and the
  cube collapses to a card. The shadow is its own thing lying on the felt, spreading and going
  weak as the die gets up off the table.
- **Which way up is a six?** Each side sits a quarter turn from the front, so the app works out
  once, at load, every pair of quarter turns that brings a given side round to face the camera.
  Sixteen combinations, six sides, plain trigonometry — no `DOMMatrix`, so nothing here depends
  on the browser agreeing about matrices at runtime. (It was checked against `DOMMatrix` during
  development, which is how a sign error in the first attempt turned up: the dice were landing
  on the wrong face.)
- **A die must not change its mind.** The number was decided before the dice left the cup, so the
  tumble has to be talked round to the right face at some point. Do that at the stop and it looks
  like a cheat — the die has visibly finished rolling and then turns over anyway. So it picks its
  face while it's still sliding, a good half second out, and rolls onto it, carrying on the way it
  was already turning where that's anywhere near as short as turning back.
- **Lighting has to follow the landing.** A die at rest is lit from above, so the side you see
  down past the edge is in shade — but *which* side that is depends on how it landed, so the light
  goes on the one face that ends up on top. Mid-throw every face is lit; dimming a tumbling die
  just makes the roll look muddy.

Measured over 402 settled dice: every one shows the face it actually rolled, not one changed face
after it stopped moving, and 1,005 pairs with no overlap. A throw takes about 1.1 seconds.

**The cup is drawn, not photographed.** Straight-sided, green baize in the mouth, a rolled lip and
cream stitching under the lip, up the seam and round the base. A line running round a cylinder is
the rim's own ellipse further down, so the stitching sags by exactly the rim's `ry` — which is why
the curves look drawn rather than guessed. Its cast shadow is a soft ellipse of its own lying on
the felt, for the same reason the dice have one: a `drop-shadow` filter traces the silhouette, so
the cup wore a hard-edged trapezoid with the rim's arc cut across it — and, being a filter on the
element, swung the whole blob round with it on every shake. It's sized off the felt the way the
dice are, against both sides of it: 42% of the width, but no more than .458 of the height, since
width alone put it at 77% of a short landscape board with 28px of daylight above it.

- **Tap what you're keeping.** Six identical white dice — the felt tells you nothing about which
  ones are worth anything, so read your own roll. The bar adds up your picks as you go and won't
  let you set aside a handful that doesn't fully score — no leaving a stray 3 in with your three 5s.
- **What you've picked wears a gold circle.** A circle because it has to be one: the ring hangs off
  the die's outer box while the turning is applied to the cube inside it, so a cornered shape sat
  crooked against a die that settled at 40°. It stands well off the die as well — a corner reaches
  71% of the die's width from the middle where a flat side reaches 50%, so a closer ring would cut
  through the corners of a die lying on the diagonal. The red refusal and a Rollerbot's pick share
  the same ring.
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
| 🤪 **Screwball** | Draws a new temperament every turn and announces it. Occasionally more cautious than Careful; occasionally unhinged — but its table manners hold whatever mood it is in. |

Over a million simulated turns apiece, Careful averages 571 a turn, Steady 573, the Gambler 559
and the Screwball 554, with the Gambler farkling 37% of the time against Careful's 20% and
Steady's 25%. That's a turn opened with a fresh six and nothing inherited. Somebody else's pot is
worth far more than a fresh six: a ridden turn averages about 890, and around one turn in six is
a ride, which lifts everyone's per-turn average by about fifty.

They know the rules they're playing under, too: one chasing a leader on the last lap won't bank
anything short of the lead, and one that can cross the target takes it.

### What they'll leave you

With let-it-ride on, banking hands the next player the pot *and* the dice you never rolled. Three
dice score seven throws in ten, so handing that over with a pot behind it is a present, and how
freely a bot gives one is temperament rather than arithmetic. Each profile says so in three
numbers:

| | |
| --- | --- |
| `sits` | the most dice it will ever sit down on and leave behind |
| `push` | how few dice it will stand back up on, when the pot is too small to bother with |
| `onBoard` | how hard it pushes while it's still getting on the board |

Which comes out as:

- **Nobody hands over three dice or more.** They stand up and throw them, whatever the pot and
  whether or not the target is already crossed.
- **Except the 🐢**, which will sit on three — but only under 1,200, and even then only on the
  toss of a coin. That number is where its own sums stop preferring the throw, so the one handful
  it sits on, it sits on exactly while sitting is the cheaper side. It quits while it's ahead;
  that is the whole of its character.
- **The 😈 dithers on the small ones.** Under 500 with one or two dice it tosses a coin to throw
  again, and another on whatever that leaves, chasing the clean sweep back to a fresh six. Over
  500 it stops and banks like everyone else — the surprise being that a gambler is the one bot
  that will pass up a two-dice throw on a decent pot.
- **Nothing applies when there's nobody to hand to.** Rule off, someone still short of the board,
  or a bank that ends the game — in any of those the dice go back in the cup unseen, and the
  arithmetic decides on its own. Banking past the leader on the last lap is not one of them: that
  takes the lead back and starts the lap again, so the player who has to beat it gets the dice.

The opening is its own phase, and the phase lasts as long as *anybody* is still short of the
board — not just the bot having the turn. Nobody can ride until everyone is on, so until then
there is no such thing as leaving too much behind: the dice go back in the cup either way. With
nothing to protect and no reason to risk anything, 🐢 and 🤖 bank the moment they're over the
opening minimum and hand over however many dice that leaves, unless they've swept all six and are
holding a fresh handful. The 😈 goes a little further, riding out a four-, five- or six-dice
handful, but banks like the rest once it's over the line with three or fewer.

Underneath all of it the sheet still runs: a bot rolls whenever rolling is plainly worth more
than banking, and what it makes of a close call is its bias. The temperament rules only ever come
up when the sheet has said *bank* — and for the 😈's coin toss, which replaces the sheet outright,
because the sheet would throw every one of those and the point is that it hesitates.

Head to head over 200,000 games a pairing with riding on, the top three are inseparable: Careful
and Steady split it 49.8–50.2, Careful takes the Gambler 50.7–49.3 and Steady takes it 50.6–49.4.
The Screwball trails the field by two to three points — 52.4–47.6 to Careful, 52.5–47.5 to Steady,
51.7–48.3 to the Gambler — and that is a point and a half better than it managed while it was
losing its table manners with every change of mood. Against the older, cannier setting each of
them still gives up something under a point. The character is worth more than the point.

Undo during a bot's turn parks it rather than letting it instantly replay the move you just took
back — tap the bar under the felt to set it going again.

### From the keyboard

The whole game plays without taking a hand off the keys. <kbd>Enter</kbd> does the obvious thing
for wherever you are — shake the cup, take what the bar is offering, throw what's left, bank,
answer the ride, close the overlay — and whatever it would press wears a ⏎ so it's never a guess.
Nothing shows until a key is actually pressed, so a tablet is never told about a key it hasn't got.

| | |
| --- | --- |
| <kbd>Enter</kbd> | presses the button wearing the ⏎ |
| <kbd>⇧ Enter</kbd> | take every scoring die and throw the rest, in one press |
| <kbd>1</kbd>…<kbd>6</kbd> | pick up every die showing that number; again to put them back |
| <kbd>Tab</kbd> / <kbd>Space</kbd> | walk the dice and the buttons; pick up the die you're on |
| <kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd> | undo and redo (<kbd>⌘Y</kbd> works too), except in a name field |
| <kbd>Esc</kbd> | close whatever's open |

### The rest of the game

- **Let it ride** — when someone banks, the next player can pick up their total and keep rolling
  with the dice left on the table. Score and it's theirs; farkle and it's gone.
- **Finishing** — first past the target starts the last lap. Everyone else gets one turn to take
  the lead, and each column shows exactly what they need. Take the lead and the lap resets around
  you. A full lap with nobody passing the leader ends it.
- **How it played out** — under the final scoresheet, the whole game as one graph: a line per
  player climbing turn by turn, the target as a dashed finish line, hollow dots where somebody
  farkled, and a count of how many times the lead actually changed hands.

The top bar is seven line icons and no boxes — sound, the scoring reference, undo, redo, a gear
for settings and players, the menu, and full screen where the browser has it. They're drawn at one
stroke weight rather than typed as emoji, which come out in whatever colour and heft each font
feels like, and they tint gold on press. The gear is one tap from the felt and nobody presses it
meaning "bin this", so a game in progress is *parked* — any Rollerbot stops mid-think and a **Back
to the game** button appears under the logo. The only door that throws a game away is NEW PLAYERS
on the finished-game bar, where there's nothing to come back to.

Undo and redo step through every single press. Players, icons, and house rules are remembered
between games; benched players are one tap from rejoining. The scoresheet header stays put while
the turns scroll under it, the rolling player's column included.

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
