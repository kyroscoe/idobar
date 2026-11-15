# Netlify Forms setup

Code integration completed November 15, 2026. No live inquiry was submitted and no notification delivery was tested.

## Netlify dashboard steps

1. Open the Netlify project connected to `kyroscoe/idobar`.
2. In **Forms**, enable automatic form detection if it is not already enabled.
3. Deploy the latest `main` revision. If it deployed before enabling detection, trigger a new deploy afterward.
4. Confirm **bar-inquiry** appears in Forms and that the honeypot is recognized.
5. In **Forms > Submission notifications**, configure an email notification for this form. The existing business contact is `Buckeyebartendingohio@gmail.com`; confirm this is the intended notification recipient. An external recipient may need to confirm Netlify's email before notifications begin; some teams require a team-member recipient instead. Website source cannot configure this dashboard setting.
6. Coordinate a real delivery test with the owner before launch. UI tests have used mocked responses only. If needed, check both verified and spam submissions. Do not assume email delivery merely because an on-page confirmation appeared.

Official references: [setup](https://docs.netlify.com/manage/forms/setup/), [notifications](https://docs.netlify.com/manage/forms/notifications/), [spam filters](https://docs.netlify.com/manage/forms/spam-filters/).

## Implementation

- Static form name: `bar-inquiry`.
- `method="POST"`, `action="/thank-you/"`, `data-netlify="true"`, and `netlify-honeypot="bot-field"`.
- Static fields: `form-name`, `bot-field`, `name`, `email`, `date`, `guests`, `venue`, `message`.
- `email` is named for Netlify's Reply-to behavior. No API key or third-party form account is needed in source.
- With JavaScript: URL-encoded POST, pending state, duplicate-submit protection, inline success only after a successful HTTP response, and error/retry retaining entries.
- Without JavaScript: normal browser POST and custom confirmation route after Netlify processing.
- Direct email and phone links remain available. Honeypot is hidden from keyboard and visual navigation.
- Local preview has no form backend. AJAX is blocked locally with an honest nothing-sent message; native POST is rejected by the static server.
- `netlify.toml` sets the build/check command, `public` output, and Node 22. No SPA catch-all redirect is necessary.

## Verification

`npm run check` verifies deployed HTML detection markers, schema, confirmation-route existence, URL encoding of punctuation, invalid-form no-op, local no-op, sending/duplicate guard, server success, HTTP/network errors, retry, reset only on success, enabled controls after completion, and status focus. All responses are mocked, so this verifies client behavior rather than Netlify receipt or email notifications.

Desktop reading sizes increased above 700px: normal content 17px, main navigation/buttons/form labels 15px, and supporting copy 14px. The logo and brand phrases remain unchanged. Browser visual verification is still required.
