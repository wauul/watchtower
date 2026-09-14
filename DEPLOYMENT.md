# Deployment verification — September 14, 2026

Live: https://watchtower-six-umber.vercel.app

Source: https://github.com/wauul/watchtower

## Implemented and verified

- Product images: retailer metadata pointed to 404 URLs. The scraper now verifies candidates and falls back to real product-gallery images. Existing Adafruit and BISSELL images were repaired. Browser image decoding succeeded for the repaired Adafruit image.
- Amazon: the supplied B07GXS35PG listing returned about 2.5 MB of gzip-compressed HTML. The scraper now decodes gzip/Brotli/deflate, caps decoded HTML at 16 MB, and reads the main product selectors. It extracted BISSELL SpotClean ProHeat 36988, EUR 149.99, and a valid image. The production browser form subsequently saved that exact listing successfully at EUR 124.99 (the live response differed from the earlier local price). Its image decoded in the browser at 1089 pixels wide.
- Search: Tavily basic search replaces blocked Google access, with the user-approved key configured in Vercel. The shared quota caps attempts at 950/month. Groq filters same-product retail listings and preserves unknown prices/shipping. A live product-page search returned a Raspberry Pi listing at USD 4 with shipping unverified. The original retailer is excluded from alternative results, including alternate URL paths and tracking parameters. A cheaper offer is not guaranteed.
- Accounts: email-link sign-in creates a persistent profile. Users can edit a public display name, keep a private watchlist, and sign out. No password is required.
- Community: the homepage is public. Product pages have explicit publish/update/unpublish controls. A temporary, labelled verification account successfully published and unpublished a sample; its email was absent from the public response. Cross-owner and cross-origin publishing were rejected. The verification records were removed afterward. Anonymous account access redirects to login; logout clears the cookie.
- Database: both the initial migration and additive community migration are applied to Neon. Existing products remain intact.
- Scheduling: Vercel's daily cron is enabled at 05:00 UTC; the six-hour GitHub Actions scheduler passed at https://github.com/wauul/watchtower/actions/runs/34768657274 . A protected real recheck persisted another observation and generated a false-alarm verdict without sending unnecessary mail.
- Email: alerts@waelfz.com is configured, the owner-only restriction is removed, and the user confirmed inbox delivery.
- Six automated regressions, type checks, production builds, and live ownership/privacy checks passed. Account and community pages were inspected at a 390-pixel viewport with no horizontal overflow or browser errors observed.

## Remaining limits

- Google Custom Search returned 403 access denied for new project grounded-gizmo-508515-a8. Its key and engine 60c74b05357f94a7f are not enabled in production; Tavily is the active replacement.
- Requested Groq llama-3.1-8b-instant was unavailable. Production uses openai/gpt-oss-20b. The replacement Watchtower verified deployment key expires October 13, 2026. Earlier invalid/unused Watchtower keys remain for account-owner review.
- No real price-drop/restock event has occurred during verification, so a combined positive alert has not been demonstrated. No production price history was altered to manufacture a deal.
- Retailer challenges, unavailable pages, changing markup and regional pricing can still prevent scraping. CAPTCHA protection is detected, not bypassed. Search snippets can be stale; unknown shipping remains unverified.
- Free provider limits and scheduling delays apply. Keep Tavily paid usage disabled. Manual searches are capped at three attempts per product/hour.
- Custom Search was also enabled in existing Google project awesome-habitat-508513-b2 before switching to Watchtower. No keys or data were changed there; review whether to disable that newly enabled API.

## Accounts and resources

Existing identities: GitHub/Vercel wauul; Groq/Google waelfeza@gmail.com; Resend wael.fezari@epitech.eu; Neon Wauul organization / Wael Fezari (email not independently verified). Tavily was added through Google sign-in as waelfeza@gmail.com with user approval; the user completed onboarding and supplied the key.

Vercel: wauuls-projects/watchtower, Hobby. Neon: young-mountain-08421044. Secrets are excluded from source control and stored in the ignored local environment and Vercel.


