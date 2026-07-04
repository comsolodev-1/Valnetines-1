# Valentine's Day Website

An elegant, minimal Valentine's Day experience built as a static single-page site. No frameworks, no build tools — just HTML, CSS, and vanilla JS.

## Features

- **Multilingual question** — cycles through 11 languages as the recipient keeps saying no (English → Spanish → French → Japanese → Mandarin → Korean → Portuguese → Italian → German → Russian → Arabic → English)
- **Roaming No button** — drifts and dodges the cursor, up to 5 times per language before it lets itself be caught
- **Weather storytelling** — the scene shifts from sunny to windy (with falling leaves) to rain as rejections accumulate; fully reverses on yes
- **Synthesized audio** — ambient wind and rain using the Web Audio API, no external audio files required
- **Date plan carousel** — three Valentine's Day plans (A, B, C) displayed one at a time, swipeable on mobile, keyboard-navigable on desktop
- **Export** — save any plan as PNG or PDF
- **Send to email** — opens the user's email app with the chosen plan pre-filled; requires typing "sure" as an anti-spam confirmation
- **Flower greeting page** — bouquet photo in a photo-frame mount with a personal message
- **Quiet closer** — a final page with a single line
- **Fully responsive** — adapts to any screen size, phone, tablet, or desktop; respects `prefers-reduced-motion`

## File Structure

```
valentine/
├── index.html        — markup
├── style.css         — all styles
├── main.js           — all behaviour
├── images/
│   └── bouquet.jpg   — your bouquet photo (add this yourself)
├── README.md
└── LICENSE
```

## Setup

1. Clone or download this folder.
2. Add your bouquet image at `images/bouquet.jpg`. Any JPG or PNG works; portrait orientation looks best.
3. Open `main.js` and set your email address on line 3:
   ```js
   const DEVELOPER_EMAIL = "your@email.com";
   ```
4. Open `index.html` in a browser, or deploy the folder to any static host (GitHub Pages, Netlify, Vercel, etc.).

No build step. No npm install. No dependencies to manage.

## Customisation

| What | Where |
|------|-------|
| Developer email address | `main.js` — `DEVELOPER_EMAIL` |
| Date plan content (times, activities) | `index.html` — `.plan-items` inside each `article.plan-card` |
| Greeting message | `index.html` — `.p3-title` and `.p3-sub` |
| Closing line | `index.html` — `#page4 p.main` |
| Colour palette | `style.css` — `:root` CSS variables |
| Bouquet image | `images/bouquet.jpg` |
| Languages / translations | `main.js` — the `languages` array |

## Browser Support

Works in all modern browsers (Chrome, Safari, Firefox, Edge). The Web Audio API degrades silently on browsers that don't support it — sound simply won't play but everything else works. Export (PNG/PDF) requires an internet connection to load the `html2canvas` and `jsPDF` libraries from cdnjs on first use.

## Deployment

Drop the entire `valentine/` folder onto any static host. No server-side code required.

```
GitHub Pages:  push to a repo, enable Pages from the root
Netlify:       drag and drop the folder onto netlify.com/drop
Vercel:        vercel deploy --prod
```
