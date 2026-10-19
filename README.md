# UNVEILED

*A little more about us.* A private intimacy card game for a small group of adult friends, built on the RBDSMA framework (Relationships, Boundaries, Desires, Sexual health, Meaning, Aftercare), plus four optional After Dark questions.

It runs entirely in the browser. Data syncs through [GUN](https://github.com/amark/gun) via the relay at `https://try.axe.eco/gun`, encrypted with [SEA](https://gun.eco/docs/SEA) using a group password. There are no accounts, no logins and no server to run.

## Run

Serve the folder with any static server. SEA needs a secure context, so use `https://` or `localhost`, not `file://`.

```bash
python3 -m http.server 8077
```

Then open http://localhost:8077.

- **Test vs real:** `localhost`, `127.0.0.1` and any URL with `?test` use the GUN root `unveiled-test`. Anything else uses `unveiled`. The first time a password is used in the test root, the four fictional people (Alex, Jordan, Sam, Riley) are planted for it. They never appear in the real root.
- **The password:** nothing to set up. Whatever password you share with friends *is* the group. Everyone types it on the entry page, the first thing the site shows. Their card is saved encrypted with it, and the gallery shows exactly the cards saved with the same password. A typo just means you see nobody, and your card is invisible to the others; *Use a different group password* on the review screen fixes it. To move between groups, tap *Switch group* at the top of the gallery and enter another password. If you've already shared in that group you land in its gallery; if not, you start at Welcome.

## How the privacy works

- **Password → key.** The password is stretched with `SEA.work` (PBKDF2, 250,000 rounds) into the group key. Only that derived key is kept in the browser, never the password. A SHA-256 hash of the key names the group's place under the root, so nobody can find it without the password.
- **Encrypted cards.** Each person's shared answers are encrypted with the group key before leaving the phone. The relay only ever sees `SEA{…}` ciphertext.
- **Private answers never leave the device.** That includes skipped answers and anything toggled private. Only shared answers are uploaded.
- **Nobody can change your card.** Each browser quietly makes its own signing key pair. Cards are written to that key's signed space (`~pub`), so GUN peers reject anyone else's writes. You can edit or delete your card only from the browser you shared it from.
- **Limits of a shared password.** Anyone who has the password can read every shared answer, and anyone can copy the encrypted data from the public relay and try guessing passwords offline. Use a long passphrase (4–5 random words) and share it only in person or in a private chat.

## Files

| File | Role |
| --- | --- |
| `ask.js` | **All questionnaire copy.** Edit the words here. |
| `index.html` | Shell. Each screen gets a fresh frame. |
| `app/keep.js` | Your full draft (private answers included) and the test/real switch |
| `app/view.js` | Screen transitions and back-swipe history |
| `app/flow.js` | What each screen receives, and what each action does |
| `app/group.js` | The single door to group data |
| `data/api.html` | Hidden component. The only code that loads GUN/SEA or sees group data. |
| `data/act.js` | Its actions: `ping`, `join`, `all`, `one`, `put`, `cut` |
| `data/net.js` | GUN helpers: relay, timed reads/writes, signing queue, device key |
| `data/seed.js` | Fictional people for the test root |
| `view/*.html` | Screens: `hello`, `pass`, `name`, `card`, `dark`, `look`, `done`, `all`, `one` |
| `app.css` | Design tokens and shared classes |

## Tests

- `test/api.html`: open it on `localhost` and expect `PASS`. It runs against the real relay with a throwaway password and checks:
  - a different password sees none of the cards
  - the password itself is never stored
  - stored cards are ciphertext
  - only shared answers are uploaded
  - the gallery carries no answers
  - delete works
- `test/forge.js`: run `npm i gun@0.2020.1241 && node test/forge.js <room> <pub>`. A second, unrelated client tries to overwrite someone's card and must be refused.

## Putting it online

It's static files, so any static host works. GitHub Pages is the simplest:

1. Push this folder to a GitHub repo.
2. Go to Settings → Pages → *Deploy from a branch* → `main`, root.
3. Share `https://<you>.github.io/<repo>/`. That URL uses the real `unveiled` root. Add `?test` to try it against the test root.
