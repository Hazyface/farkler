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

Setup asks one question that changes the whole screen: **real dice or virtual**.

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
sim, so they bounce off the rails and off each other and land where they land.

- **Dead dice go grey.** Anything that can't be part of any scoring combination is dimmed, and
  tapping one is refused.
- **The best combo flashes** for a few seconds after the throw. The bar under the felt names it
  and its score; tap the bar to take it in one go.
- **Tap what you're keeping.** The bar adds up your picks as you go and won't let you set aside
  a handful that doesn't fully score — no leaving a stray 3 in with your three 5s.
- **Set & roll** drops those dice into the tally, adds the points to your pot and throws what's
  left. Set all six and hot dice hands you a fresh six.
- **Farkle calls itself.** Roll nothing at all and the felt flashes red and takes your turn.

Everything else — banking, letting it ride, house rules, undo, the scoresheet — works exactly the
same. Undo steps back through throws and set-asides the way it steps through button presses.
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
