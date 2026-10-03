# A Very Important Question 💌

A tiny interactive love story that asks her out: an envelope to open, a NO button that refuses to be caught, a date and time picker, food "vibes", a personalized confirmation, a fake $499 "Date Agreement™" that gets declined, and a ticket for the actual date.

Built with React, Vite, Tailwind CSS v4, Framer Motion, Lucide icons and canvas-confetti.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Make it yours (2 minutes)

Everything lives in **`src/dateConfig.js`**:

| Setting | What it does |
| --- | --- |
| `girlfriendName` | Her name. Shown on the opening letter, the invoice and the ticket. If you leave `"Her Name"`, the site says "you" instead. |
| `senderName` | Your name. Signs the last screen and the footer. If you leave `"Your Name"`, it's hidden. |
| `defaultMessage` | The line under "Hey Sarah…" on the first screen. |
| `finalMessage` | The very last line of the story. |
| `photo`, `photoCaption` | The polaroid on the question screen (see below). |
| `music` | Optional song (see below). |
| `prankPrice`, `currency` | The fake fee. The line items add up to it automatically. |
| `whatsappNumber` | Optional. Your number, digits only with country code (`923001234567`). If set, the last screen gets a "text me your answer" button that opens WhatsApp with her date, time and food already typed. |
| `timeSlots`, `maxDaysAhead`, `foods` | The choices she gets. |

You can also set the names from the link, with no rebuild:
`https://your-site.com/?to=Sarah&from=Ali`

### Your photo

Put a photo at **`public/images/date-photo.jpg`** (any landscape-ish photo works; it's cropped to 4:3). Until that file exists, a cute illustrated puppy shows instead.

### Music (optional)

Put an mp3 at **`public/music/our-song.mp3`**. A small ♪ button appears in the corner. Nothing autoplays (browsers block that anyway). If the file is missing, the button doesn't show.

## Send it to her

```bash
npm run build
```

Upload the `dist/` folder anywhere static. (A ready-made `dist/` is already included. It still has the placeholder names, so either add `?to=Her&from=You` to the link, or edit `dateConfig.js` and rebuild. You can drop your photo straight into `dist/images/date-photo.jpg` too.)

- **Netlify**: drag the `dist` folder onto app.netlify.com/drop. You get a link in seconds.
- **Vercel**: `npx vercel` in this folder (framework: Vite).
- **GitHub Pages**: push, then serve the `dist` folder (the build uses relative paths, so sub-folders work).

Prefer one file? `npm run build:single` creates `dist-single/index.html` with all code and fonts inlined. (Your photo and music still need to sit next to it in `images/` and `music/`.)

**Link preview tip:** once deployed, uncomment the `og:image` line in `index.html` and point it at your photo's full URL so the WhatsApp/iMessage preview shows it.

## The story

| Chapter | Screen | File |
| --- | --- | --- |
| prologue | "Hey you… I have a very important question." + envelope | `src/screens/IntroScreen.jsx` |
| 1 | Will you go on a date with me? (runaway NO) | `src/screens/DateQuestion.jsx`, `src/components/RunawayButton.jsx` |
| 2 | WAIT... YOU ACTUALLY SAID YES?? | `src/screens/ReactionScreen.jsx` |
| 3 | Pick a day + time (with validation) | `src/screens/DateTimeScreen.jsx`, `src/components/MiniCalendar.jsx` |
| 4 | Food vibe cards | `src/screens/FoodSelection.jsx` |
| 5 | Personalized confirmation + P.S. | `src/screens/ConfirmationScreen.jsx` |
| 6 | "one small fee 💳" → declined → free | `src/screens/PaymentPrank.jsx` |
| finale | See you on [date] at [time] + ticket | `src/screens/FinalScreen.jsx` |

State (date, time, food, number of NO attempts) lives in `src/App.jsx` / `src/story.js` and survives a page refresh in the same tab.

## Good to know

- **The payment is 100% fake.** There are no card fields, no payment provider and no network calls. The button only plays an animation.
- **The NO button** jumps to random spots that are always fully on screen, never on top of YES or the question, and never off the edges. It runs from the mouse on desktop, on touch-down on phones, and from Enter/Space on keyboards. After a few tries it gets more dramatic.
- **Accessible:** real buttons and radio inputs, a keyboard-navigable calendar (arrows, Home/End, PageUp/PageDown), focus moves to each new chapter's heading, live regions announce the jokes, and `prefers-reduced-motion` turns off movement while keeping the story intact.
- **Fonts** (Fraunces, Nunito, Caveat) are self-hosted in `src/assets/fonts`, so nothing loads from third-party servers.
