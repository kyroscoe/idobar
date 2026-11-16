# I Do Bar Co. local redesign

Implemented November 13, 2026; revised using the owner-supplied logo. Source has been pushed to GitHub. Netlify Forms integration was added November 15, 2026; hosting, form detection, and notification delivery require Netlify-side verification. No live inquiry was submitted.

## Preview and source

Run `npm run dev` from this folder, then visit http://127.0.0.1:4174. No installation or framework is needed; Node 22+ is sufficient. Stop with Ctrl+C. `npm run check` rebuilds the static output and runs the checks. Deployable files are in `public/`, but no hosting has been configured.

Edit page copy in `src/pages/`; run `npm run build` to refresh `public/`. Shared navigation, footer, and head metadata are in `scripts/build.mjs`. Styles and inquiry behavior are in `public/styles.css` and `public/app.js`.

## Reference decisions

The actual completed sister-brand source was found at `../ido/public/`, with its client-review notes in `../ido/README.md`. The supplied https://idocoordination.netlify.app/ destination returned HTTP 200. A source copy of that live homepage was captured during research. The earlier chat itself was not available or needed.

- Exact font families and available weights: EB Garamond 400/500 with italic, DM Sans 400/500/600. Font fallbacks work if Google Fonts is unavailable.
- Shared patterns: compact horizontal navigation, 48px minimum primary buttons with a 3px radius, uppercase letter-spaced eyebrows, serif headings, generous sections, two-column desktop inquiry and stacked phone layouts, visible keyboard focus.
- Sister source uses white, navy, and pale blue. The revised site takes navy from the supplied bar logo for buttons, headings, footer, and the story band, alongside white backgrounds, pale-blue sections, and blue-gray body copy. The former tan/ivory/bronze UI palette was removed in the November 16 client revision. Burgundy remains within the unaltered logo. No purple UI is used. Fonts and interaction patterns are shared with the sister brand.
- The owner-supplied official logo replaces the provisional wordmark in header/footer and supplies the favicon. Artwork, colors, proportions, and its white background are retained. The original PNG is preserved alongside small WebP display variants. No generated or recolored logo is used.

## Existing-site audit

Source pages inspected at https://www.idobarco.com/: `/`, `/about`, `/team-members`, `/blank` (bar add-ons), and `/blank-5` (partnered venues). Snapshots and a complete image contact sheet are local in ignored `research/`.

| Existing URL | Result in redesign |
| --- | --- |
| `/` | Full homepage: hero, offer, services, real event photos, story, FAQ, inquiry |
| `/about` and `/about#contact` | Story of Becky and Christyn, direct email/phone, inquiry link; contact anchor retained |
| `/team-members` | All nine published team names and portraits |
| `/blank` | Accessible text description of bartending and published supply categories, alcohol arrangement, selection deadline and guest-count basis |
| `/blank-5` | Venue inquiry guidance; original page had no verified named venue or working website destination, so none invented |
| `/privacy-policy`, `/accessibility-statement` | Footer links still point to the existing live site's documents; suitable new-host documents need review before domain replacement |

Directory routes serve with or without a trailing slash in the local server. Confirm equivalent behavior in the eventual host. Do not redirect all unknown pages to the homepage; a real 404 page is provided.

Homepage Inquire and Bar Add Ons buttons on the old site pointed back to `/`. The contact section had text-only email and phone, no form. No existing form backend, booking service or working dedicated inquiry destination was found. The existing business email is now a `mailto:` link and phone a `tel:` link.

Owner context: the business has published its Wix site and requested help with its colors, removal of purple, additional photos, and replacement of template imagery. This establishes a visual/content cleanup brief; it does not authorize invented packages or new business claims.

Original homepage title was `Home | Purement`, with template footer text and gallery captions. Those were replaced intentionally. Useful supporting page subjects and URLs are retained; descriptions and social metadata now describe the business. Preview pages have `noindex,nofollow`. Canonicals use the existing domain. Remove review noindex only when approved for launch and ensure the social image is reachable at the final domain. No standalone GA/GTM/Meta tracking ID was identified in the inspected homepage. Wix platform scripts are not portable; confirm any dashboard-managed analytics or consent integration before replacing Wix.

## Confirmed content and inquiry behavior

Published sources support Central Ohio, weddings/private parties/corporate events/special celebrations, TIPS-certified and fully insured bartenders, staff-only service, optional supplies, and client-provided alcohol. Christyn's experience and Becky's founding story come from `/about`; team identities come from `/team-members`. See source inventory for exact photo identities. No testimonials, named venue partnerships, pricing, response-time promises, alcohol sales, or equipment ownership claims were added.

The existing add-on graphic is titled `Bar Packages 2027`; its page says prices take effect January 2027 and may change without notice. As of this November 2026 review, the redesign requests a current quote rather than presenting those future prices as current. Its verified supply categories and terms were converted to readable text.

The inquiry now submits to Netlify Forms as `bar-inquiry`. Static HTML has `data-netlify="true"`, POST to `/thank-you/`, a matching hidden `form-name`, and a hidden `bot-field` honeypot. Native name/email validation runs before JavaScript submission; form entries remain in place on failure, the send control is disabled while pending, duplicate clicks are ignored, and the status message receives focus. Only a successful server response triggers reset and success. Native POST works without JavaScript on Netlify. Local preview prevents AJAX submission and displays an explicit nothing-sent message; its server rejects native POST with 405. Direct email and phone remain available. Netlify form detection and notifications still require dashboard setup; see `docs/NETLIFY-FORMS.md`. No real submission or email delivery has been verified.

## Photography used and approval status

No photos were supplied in this empty workspace. Three event photos and nine portraits were recovered from client uploads on the existing site. They are treated as existing business assets for this local review, not as newly confirmed rights-cleared photos. Confirm reuse permission, subject releases, and photographer credits before publishing. No stock, generated image, or sister-brand wedding photo is used to imply bar work.

`src/photos.json` is the single slot manifest for filenames, responsive widths, alt text, intrinsic dimensions, focal positions, and primary event-source IDs. Full-size gallery links are generated from the same manifest. Actual files are optimized WebP derivatives in `public/assets/`. Above-the-fold hero is eager/high priority; other images lazy load with width/height to limit layout shift. The hero retains a 4:3 full image on phones. Desktop uses a modest fill crop with the bar and bartender centered. Gallery images link to uncropped copies. Mobile crop results still require visual browser review.

To replace a photo: run `python scripts/prepare-photo.py hero PATH_TO_APPROVED_IMAGE` (Pillow required for this optional tool), then edit that slot's `alt`, `position`, and `source` in the manifest; run `npm run check`. Other slot keys are `mobile`, `team`, and each bartender's lowercase name. No Pillow dependency is needed to build or serve the site. Do not describe people, venues, or events beyond what the replacement actually shows. Do not introduce a new slot just to fill space without an approved photo.

## Exact missing shots

Existing images keep the layout complete. These are replacement/addition requests, not blank mandatory placeholders:

| Intended placement | Subject requested | Preferred orientation |
| --- | --- | --- |
| Hero replacement | Complete staffed bar at a real event, counter and surrounding setting visible; bartender near center, no important content at edges | Landscape 4:3 or 3:2, at least 2000px wide; also provide a phone-safe 4:3 crop |
| Services section or expanded gallery | Bartender actively serving a guest; show the interaction and bar together | Landscape 3:2, plus portrait 4:5 if available |
| Gallery detail slot | Client-made cocktail or actual event glassware/garnishes on the bar, with event context | Portrait 4:5 or square, at least 1200px |
| Gallery detail slot | Actual drinks menu/signage and coordinated bar details, with readable design and no sensitive guest information | Portrait 4:5, at least 1200px |
| Gallery wide slot / venue page | Wide venue view showing where the bar fits into the event, cleared for publication and identified by client | Landscape 3:2 or 16:9, at least 2000px wide |
| About/story replacement | Approved current photo of Christyn at work with the bar team | Portrait 4:5 or landscape 3:2 |

Do not add stock or generated substitutes for any of these.

## Launch items and unresolved details

1. Approve reuse of the three recovered event photos and nine team portraits, permissions/credits, logo placement, and crop choices. The source file for Jennifer is named `Neveah Pic.heic`; it is mapped to Jennifer because of its placement in the original team page. Verify this identity and current roster explicitly.
2. Confirm the published email and phone are still correct. Enable Netlify form detection, deploy this revision, confirm `bar-inquiry` appears, and configure the notification recipient. Verify actual submission and notification delivery with the owner at launch; no live test has been sent.
3. Confirm current service inclusions, staffing and supplies, equipment responsibility, venue requirements, travel boundaries beyond the published Central Ohio wording, add-on availability, and pricing effective for the intended launch date. No unconfirmed terms should be added.
4. Confirm TIPS certification and insurance remain current at launch, current team roster and Christyn's biography, and any named partnered venues/permission to show their branding. No named venues are currently advertised.
5. Supply any approved testimonials if desired; none are needed for this layout.
6. Verify the sister-site review URL is the desired public footer destination; replace with its final domain when supplied.
7. Review privacy/accessibility documents for this implementation; existing footer destinations are still on Wix. Confirm analytics/consent needs and remove preview noindex only with the domain launch.
8. Finish visual and keyboard QA below, then choose hosting. No deployment, DNS, analytics, or external form settings were changed.

## Verification results and remaining browser QA

Passed `npm run check`: seven HTML outputs (six content/confirmation pages plus 404), internal file links and hash targets, responsive photo variants, image alt text/dimensions, Netlify detection markup and field schema, required validation, localhost guard, pending/duplicate submission, encoded payload, mocked success, HTTP/network errors, retry, focus, and text contrast. No live request was made by these tests.

November 15 desktop typography update: body copy is 17px, navigation/buttons/labels are 15px, and secondary copy is 14px above 700px. Headings, the supplied logo, and all established brand phrases are unchanged. Flexible navigation and footer layouts allow the larger text to wrap.

Browser rendering and a full keyboard walkthrough remain unverified: the previous native browser control attempt could not determine the Chrome URL with enough confidence to enforce policy. Inspect at 320, 390, 768, and 1440px before final launch: no overflow, comfortable larger text, nav wrapping, photo crops, form validation and status focus, native POST fallback, disabled/pending state, and preserved fields after failure. Use mocked responses for UI testing; do not send a live inquiry without explicit authorization.

## November 16 customer revision

Customer feedback requests stronger recognition of Buckeye Bartending Services, removal of tan, and buttons instead of underlined arrow actions. Buckeye Bartending Services is now the primary homepage heading, appears next to the unchanged I Do Bar Co. logo in shared navigation, and is repeated in homepage service, gallery, inquiry, supporting-page, and footer identity. The existing d/b/a relationship, official logo, LET'S CELEBRATE tagline, original service copy, and owner biographies are retained.

All tan UI values were replaced with white, navy, pale blue, or blue-gray. Action links for galleries, About, bar options, inquiries, email, phone, footer inquiry, and sister brand use button styling. Directional arrow labels were removed. Contextual inline links, contact information, and ordinary navigation remain links. The larger desktop text and Netlify form integration are preserved. Source checks passed, including current palette contrast calculations. Desktop/mobile visual browser review remains outstanding.
