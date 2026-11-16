# I Do Bar Co.

A photo-led redesign emphasizing Buckeye Bartending Services alongside the supplied I Do Bar Co. logo. White, navy, and pale-blue styling with button-based calls to action. Static HTML/CSS/JS with no runtime dependencies, prepared for Netlify hosting.

```sh
npm run dev
```

Open **http://127.0.0.1:4174**. Node.js 22+ required. Stop with Ctrl+C.

```sh
npm run check
```

- Edit content: `src/pages/`
- Update photos, alt text, focal points: `src/photos.json`
- Shared header/footer/metadata: `scripts/build.mjs`
- Styles and design tokens: `public/styles.css`
- Netlify Forms submission: `public/app.js`
- Generated site: `public/`

The inquiry submits to Netlify Forms as `bar-inquiry`, with a honeypot, inline sending/success/error messages, and a native POST fallback when JavaScript is unavailable. Local preview cannot send inquiries. No live submission or notification delivery has been tested.

Netlify uses `netlify.toml` to run `npm run check`, publish `public`, and use Node 22. Enable form detection before deploying, confirm `bar-inquiry` appears in Forms, and configure submission notifications. See [Netlify setup](docs/NETLIFY-FORMS.md).

See [the handoff](docs/HANDOFF.md) for sister-brand decisions, source audit, missing photo shot list, business details requiring confirmation, and exact QA limits. See [asset provenance](docs/ASSET-SOURCES.md) for recovered photos. Desktop/mobile browser verification remains outstanding because browser automation could not verify the active URL.
