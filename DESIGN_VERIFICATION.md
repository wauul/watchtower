# Watchtower redesign coverage

The repository was audited at `d8aa5e7` before implementation. The existing track and login interfaces were inspected in a running browser before edits. The redesigned app preserves the Next.js App Router, Prisma schema, API paths, ownership checks, data shapes and service integrations. No production data or credentials were used in verification.

## Coverage checklist

| Surface / route | Implemented and inspected coverage |
| --- | --- |
| Shared layout | Header, footer, active navigation, search/close, native mobile navigation, skip link, persistent theme, storage notice, back to top, print styling |
| `/` | Asymmetric introduction, public snapshot feed, all three sort selections, anonymous and signed-in reactions, retailer links, ranking disclosure, FAQ, newsletter, empty feed |
| `/track` | URL, target price, country select, email, help and native validation; invalid private URL, busy, disabled, error and success feedback; limits and privacy explanation |
| `/login` | Password sign-in, visibility control, email-link sign-in and recovery disclosure |
| `/dashboard` | Private email access form, expired-link feedback, populated and empty watchlists, single observation, stock/check errors, purchased/paused state, savings separated by currency |
| `/product/[id]` | Long names, images and fallback, themed price trace/target/tooltip, accessible table, AI assessment/unknown assessment, comparisons/unknown prices/unconfigured search, snapshot publish/unpublish, purchase/resume and delete confirmation |
| `/account` | Profile, password, saved/error feedback, published-find list/empty list, sign-out |
| `/search` | Site, FAQ, public and owned private results; no query and no matches |
| `/help`, `/contact`, `/privacy` | Shared readable prose and native FAQ disclosure, original code snippet, GitHub contact, factual privacy and storage copy |
| `/newsletter` | Missing token, invalid/expired token, confirm and unsubscribe, success and failure feedback |
| Framework states | Loading skeleton/status, error recovery control, 404, anonymous account/product redirects |

There are no separate onboarding, billing, upload, calendar, combobox, checkbox, radio or slider screens in this repository. No invented features were added to fill those categories. Native country options retain platform behavior and the browser's light/dark color scheme.

## Browser evidence

Local Edge/Chromium was driven with Playwright. Browser tooling and test data live under ignored `.local/`; no browser tooling was added to application dependencies. Fonts are self-hosted with their SIL OFL licenses.

- First visual batch: **72** route/theme/size combinations, using 1440px desktop, 768px tablet and 390px mobile. Every UI route, including permission/expired/empty/404 variants, was included. Dense price histories, multiple currencies, long titles and explicitly labeled synthetic shared notes were used.
- Additional state batch: **48** captures across desktop/mobile and both themes, plus 16 image/retry/newsletter assertions. Empty feed/watchlist/account, no query, loading/error recovery, form busy/success, access failure and newsletter success/unsubscribe were inspected. Loading/error recovery used a temporary local harness importing the actual components; that route was removed before the production build. Tracking success/busy used an intercepted contract response, not a claim of external scraping or email delivery.
- **22** local functional/keyboard checks passed: skip link/content focus, mobile menu Escape/return focus, persistent theme, rejected private URL, password visibility and real local sign-in, native dialog initial/return focus, actual purchase pause/resume, unconfigured search feedback, actual publish/unpublish, accessible history table, actual profile save/reaction, ownership redirects, invalid newsletter token, FAQ and enlarged text.
- Enlarged-text correction: **16** checks at 320/390/768/1440px, both themes and 100%/200% root text size. The adaptive form now stacks when two fields no longer fit. No page overflow or axe violations were found. This checks text enlargement, not a claim of testing every browser zoom implementation.
- Automated axe checks used WCAG 2 A/AA and 2.1 AA tags on principal pages and additional states. No violations were reported in those scans. These checks supplement manual visual and keyboard inspection; they are not a complete accessibility certification.
- Reduced-motion mode was used throughout the visual matrix; charts have no animated trace, and CSS disables loaders/transitions when motion is reduced. Visible focus, disclosure, modal keyboard behavior and text resizing were checked. Four first-batch resource errors came from the intentionally requested 404 route; there were no JavaScript page errors in that matrix.

The Impeccable finish reviewer checked eight authoritative desktop/mobile captures. Its initial disposition was **fix** for the enlarged-text field layout. After the coordinated correction and recapture, it scored that fix **resolved**, with disposition **ship** at that scored-fix scope. The documenter derived DESIGN.md and `.impeccable/design.json` from the finished CSS/components. The one detector pass warned about Space Grotesk's common usage; the pair and treatment were retained as an intentional part of this specific direction.

## Repository checks

- `npm run test:unit`: **68 tests passed** across seven files after the product-image correction, including four added regression tests.
- `npm run typecheck`: passed.
- `npm run build`: passed; includes Next's type validation. Temporary review routes are absent from the build route table.
- `git diff --check`: passed with the repository's Windows line-ending handling.
- There is no standalone lint script or configured ESLint check in this repository; no independent lint pass is claimed.

## Production browser confirmation

The final `next start` build passed **24** principal-page checks at desktop/mobile widths in both themes: all returned 200, without page overflow or axe violations. **10** additional assertions passed: both alternative sort selections, persistent profile confirmation, actual password change, actual logout, sign-in with the changed password, actual deletion/redirect, initial system theme, following a system-theme change and persistence of an explicit override.

These checks exposed and resolved two functional issues: native sign-out submission returned 403 with the existing strict origin check and no-referrer headers, so the control now uses the same-origin fetch path; profile success feedback disappeared during an unnecessary route refresh, so it now remains visible. The backend endpoints and security checks were preserved. A routine browse-link arrow was removed during the final copy check.

Local production console errors were confined to missing `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` resources/MIME warnings. Those existing SDK endpoints are supplied by Vercel hosting and unavailable in standalone `next start`; hosted analytics was not verified. No application JavaScript exception was observed in this confirmation.

Four final interaction assertions also passed: keyboard selection of the native country control and opening the actual price-chart tooltip in each theme. Their rendered focus and tooltip captures were inspected after the final build.

The final non-text contrast check strengthened input/select/textarea boundaries using a separate semantic control-line token. The light border is 3.51:1 against its field surface and 3.21:1 against the surrounding page; the dark border is 4.04:1 against its field surface. Content dividers retain the quieter line token. Body, placeholder, feedback and focus colors retain the accessible semantic palette.

After that CSS correction, **12** rendered track/account/product checks across both themes and desktop/mobile confirmed the computed field-border ratios above, without overflow or axe violations. The final production build passed again, and the corrected captures were inspected. No unit test repetition was needed for the final CSS-only change; the 64-test pass includes the preceding account corrections.

## Product images and blue palette follow-up

The preview's three public products initially had no image URLs. Matching product photos were retrieved from their actual Amazon and Keychron listings, validated as accessible raster images, and populated in the isolated preview's private records and shared snapshots. Prices and history remain explicitly labeled synthetic fixtures.

The production scraper now handles structured image arrays and ImageObject content URLs, lazy gallery attributes, picture/srcset sources and Amazon's dynamic gallery metadata. It tries validated alternatives when metadata images fail. Existing HTTPS, public-network, MIME, size and timeout checks remain in place. A later price check that finds no retrievable image now preserves the last successfully retrieved image.

Four new regression tests failed before those fixes and passed afterward; the full unit suite passed with **68 tests**. Actual retailer-page extraction and image delivery were checked for the three preview products. A separate live retailer listing also passed the complete create → scrape → image validation → database save → private detail display flow through the real local API. Its disposable fixture was then deleted. The preview email provider was disabled; no email delivery is claimed.

The user's final palette preference is blue. Shared light/dark tokens now use cool paper, ink blue, medium blue actions and a deep navy dark theme. Navigation, selected reactions, fields, focus indicators, chart traces and the radar favicon use that system. Green is reserved for semantic success. DESIGN.md and the schema-version-2 sidecar reflect the actual final tokens.

The final production build passed. **64** rendered checks covered community, tracking, watchlist, product detail, account, login, help and search at 390/768/1440px in both themes, plus focused fields, keyboard country selection, mobile menus, delete dialogs and chart tooltips. No page overflow, WCAG-tagged axe violations or application JavaScript page errors were observed. All three community images loaded in all six theme/size combinations. Representative light/dark desktop/mobile captures were visually inspected. These checks supplement the earlier complete-route audit; they do not claim a complete accessibility certification.

Final field boundaries measure **3.52:1** against light field surfaces and **5.15:1** against dark field surfaces. Primary button text measures **7.20:1** in light mode and **9.08:1** in dark mode. Muted text on the soft secondary surface measures **4.81:1** and **6.69:1** respectively. Type checking and the Windows-aware diff whitespace check also passed after the image changes.

## Google sign-in follow-up

Created and published an external Google consent application in the existing Watchtower project, with the production home/privacy URLs and only OpenID, email and profile scopes. The web client registers exactly the production and localhost callbacks. Google client credentials were placed in Vercel's production/development environment and the ignored local environment; the production secret is marked sensitive. Existing database, session, email and provider secrets were preserved.

Real Google authorization, signed identity verification and callback completed against the isolated local database. The browser reached the private watchlist and Account showed Google connected. Logout and existing password sign-in also succeeded. Connecting an already-bound Google identity from a different local account returned the designed conflict message while preserving its signed-in session and three public finds.

Sixteen additional rendered checks cover connected Account and Login at 390/768/1440px in both themes, visible keyboard focus, expiry feedback, an unconnected account and a link conflict. No horizontal overflow was observed. The official Google image decoded, Google Sans loaded, and the sign-in control measured 48px high. Representative desktop/light and mobile/dark captures were visually inspected. This follow-up did not rerun the earlier axe matrix.

The unit suite now passes **93 tests**, including **25** Google-authentication checks; type checking and the production build passed. GitHub CI passed all **17** integration tests against disposable PostgreSQL 18, including preservation of a legacy account's history/public find and concurrent linking uniqueness. The production build's missing-database guard also passed a local subprocess check. The Vercel build applies migrations only for the production target and refuses promotion on migration failure.

The release was merged to main and deployed on Vercel. The production migration applied successfully. Real hosted Google sign-in opened the existing owner's watchlist, preserving its display name, published find, product and 40 price observations. The BISSELL photo decoded at 1089px. Thirty hosted community/track/watchlist/detail/account checks covered 390/768/1440px in both themes with no page overflow or missing rendered images. The native delete dialog fit mobile and initially focused Cancel; cancellation preserved the product. The expanded price table rendered all 40 rows without page overflow. No hosted browser error logs were observed in this session.

Eight public routes returned HTTP 200. An unauthenticated cron request returned 401. An invalid Google callback redirected to the explicit expiry message and cleared the transaction cookie. No real comparison search, outgoing email, scheduled job, purchase, deletion or publication was triggered by this release verification.

## Concrete limits

The preview database is isolated in-memory PGlite using the repository's migrations and a Postgres wire adapter. It is useful for local UI/API checks and does **not** replace the real PostgreSQL 18 Testcontainers integration suite. Docker's engine was unavailable locally, and automatic approval review rejected launching Docker Desktop; the Docker-dependent suite instead passed on the GitHub runner.

Selected live retailer scraping and external image delivery were verified in the follow-up above; this does not establish compatibility with every retailer. Groq assessments, Tavily/Google search, Resend delivery and scheduled production cron execution were not exercised with real credentials. Their existing contracts and unit coverage were preserved. The unavailable-image fallback remains available. The preview's prices, histories and notes are explicit local fixtures, never production claims.

The release is deployed; details are recorded in DEPLOYMENT.md. The official Google authentication library was added and both lockfiles synchronized. This redesign does not resolve the repository's pre-existing dependency audit findings. Google's separate branding validation still requires homepage ownership verification and its stated 24-hour propagation wait; sign-in works with the production hostname shown in Google's chooser meanwhile.
