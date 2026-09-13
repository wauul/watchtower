# Deployment verification — September 13, 2026

Live: https://watchtower-six-umber.vercel.app

Source: https://github.com/wauul/watchtower

## Fixed and verified

Fixed production database failures by including Prisma's query compiler WASM in Next.js output tracing. Fixed Node 24 DNS lookup handling for scraping. Internal failures now return sanitized errors.

A real browser submission tracked https://www.adafruit.com/product/4864 (Raspberry Pi Pico RP2040, USD 4, out of stock). The initial observation was saved. Resend confirmed access-email delivery; its actual link opened the dashboard. The product page displayed its image and chart. Mark as bought updated dashboard totals and was then undone to leave tracking active.

A protected forced cron run saved another real observation and generated a Groq verdict: false alarm, no price change/restock, low confidence. No unnecessary alert was sent. Owner APIs returned history and analysis. Unauthenticated access, another owner's access, cross-origin mutation and private-network scraping were rejected.

Vercel settings confirmed the daily job enabled at `0 5 * * *`. The six-hour GitHub scheduler passed: https://github.com/wauul/watchtower/actions/runs/34768657274 . Type checking, four automated tests and production builds passed. The live Neon migration is applied.

## Remaining limitations

- Google project `grounded-gizmo-508515-a8` has Custom Search enabled, an API-restricted key and engine `60c74b05357f94a7f`. A real request returned HTTP 403: “This project does not have the access to Custom Search JSON API.” These credentials are not enabled in production. Alternative search needs eligible existing Google access or a different provider. The engine initially covers only amazon.com and would need expanded retailer coverage.
- Custom sender `alerts@waelfz.com` is configured. Resend accepted a test to the user's Gmail (message `58ff49b9-5f73-40a0-a7c4-911424780e4e`). The production owner-only restriction was removed. API acceptance is verified; inbox delivery of this test is not yet confirmed.
- Requested Groq model `llama-3.1-8b-instant` returned model_not_found. Live inference uses configurable `GROQ_MODEL=openai/gpt-oss-20b`. The replacement key expires October 13, 2026; rotate before then. An earlier unused Watchtower key remains for owner review/revocation.
- A real price-drop/restock combined alert and alternative results have NOT been demonstrated. No production history was fabricated to simulate a sale.
- Further browser verification was blocked by the browser approval service's usage limit. Mobile layout and final console checks remain unverified.
- Custom Search was also enabled in existing Google project `awesome-habitat-508513-b2` before switching to Watchtower. No keys or data were changed there; review whether to disable that newly enabled API.

## Accounts and resources

No new login accounts were created. Existing identities: GitHub/Vercel `wauul`; Groq/Google `waelfeza@gmail.com`; Resend `wael.fezari@epitech.eu`; Neon Wauul organization / Wael Fezari (email not independently verified).

Vercel project: `wauuls-projects/watchtower`, Hobby. Neon project: `young-mountain-08421044`, production branch with applied migration. Credentials are excluded from source control.
