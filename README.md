# Watchtower

A small, full-stack price and restock tracker. Next.js 14 App Router, React, Tailwind, Prisma/Postgres on Neon, Cheerio, Groq `openai/gpt-oss-20b`, Resend and Recharts.

## Current service constraints

- **Google Custom Search JSON API is closed to new customers.** Existing customers have until January 1, 2027 to transition. The integration is implemented, but new API activation does not guarantee eligibility. Without working credentials, Watchtower explicitly shows no alternatives; it never fabricates search results. [Google documentation](https://developers.google.com/custom-search/v1/overview).
- **Vercel Hobby allows daily cron schedules, not every six hours.** `vercel.json` registers a daily fallback at 05:00 UTC. The included GitHub Actions workflow calls the same protected endpoint every six hours, using repository secrets. Never change the Vercel cron to `0 */6 * * *` on Hobby: deployment will fail. [Vercel limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).
- Resend's sandbox sender only emails the account owner's verified email. The deployed instance uses alerts@waelfz.com with no owner-only restriction. To invite other users, verify a domain you own, set `EMAIL_FROM`, and remove that restriction. Domain purchase is not included or required for personal use.
- The free instance supports 10 tracked products per owner, with bounded check batches. Scheduling is best effort, not exact-time delivery. A run may defer products to the next trigger when time is tight.

## Local setup

Use Node 22 or 24 and pnpm. No paid API key is necessary for tracking/AI/email within provider limits.

```sh
pnpm install
cp .env.example .env
# Fill the variables below; never commit .env.
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm dev
```

The Prisma JavaScript engine and official Postgres adapter support Windows ARM without loading an x64 native DLL. The migration CLI still uses Prisma's schema engine.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres pooled connection string with TLS |
| `GROQ_API_KEY` | Groq inference/extraction |
| `GROQ_MODEL` | Defaults to openai/gpt-oss-20b; requested Llama model unavailable |
| `RESEND_API_KEY` | Sending-only email key |
| `GOOGLE_CSE_API_KEY` | Optional, eligible Google Custom Search key |
| `GOOGLE_CSE_ENGINE_ID` | Optional, paired programmable search engine ID |
| `CRON_SECRET` | Random 32-byte secret for scheduler authentication |
| `AUTH_SECRET` | Independent random 32-byte key signing email links |
| `APP_URL` | Public HTTPS production origin; localhost for development |
| `EMAIL_FROM` | Verified sender, defaults to sandbox `onboarding@resend.dev` |
| `ALLOWED_EMAIL` | Sandbox owner email; remove only with a verified sending domain |

Generate each secret separately with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and store it only in the ignored environment or provider secret store.

## Deploy

Import the GitHub repository into Vercel, choose Next.js, set all required environment variables, use `pnpm build`, and deploy. Run `pnpm exec prisma migrate deploy` against the production database before accepting traffic. Set `APP_URL` to the assigned production URL and redeploy.

For six-hour checks, configure GitHub Actions repository secrets `WATCHTOWER_URL` and `CRON_SECRET`. The public repository uses GitHub's free hosted runner allocation. Scheduled Actions can be delayed or disabled after extended repository inactivity. The daily Vercel cron is a fallback; a five-hour freshness guard avoids duplicate checks.

Manually run the scheduled workflow or send a GET to `/api/cron/check-prices` with `Authorization: Bearer <CRON_SECRET>`. An unauthenticated request must return 401. Check the JSON `results` array: HTTP 200 can contain individual retailer/AI failures.

## Flows and security

- `/`: submit a public HTTPS product URL, optional target, email, and country. Structured Product JSON-LD, Open Graph and Cheerio selectors are tried first. Groq extraction is a fallback for missing name/price. Unknown currency fails closed. Each product starts with a history point.
- `/dashboard`: request an emailed signed link. Links expire after 30 days, then exchange into an HttpOnly SameSite cookie. Email addresses and product IDs alone do not authorize API access. Rotate `AUTH_SECRET` to revoke all links and sessions.
- `/product/[id]`: full chart, latest verdict, alternatives, retailer link, and purchase status.
- `POST /api/products`, `GET/PATCH /api/products/[id]`, `GET /api/dashboard/[email]`, `POST /api/access`, `GET /api/auth`, and protected `GET /api/cron/check-prices`.
- Scheduled checks persist stock and price, ask AI for deal judgment, suppress first-observation/unavailable/unchanged/duplicate alerts, and email only when `worthNotifying` survives the safety checks. A restock must be a confirmed out-of-stock to in-stock transition. An unknown stock status is not a restock.
- Search runs only on an alert-worthy change. Atomic daily quota allows at most 95 search attempts/day, leaving headroom below Google's historical free 100/day. Results are constrained to search-provided HTTPS URLs, comparable currency, max three, known prices first.
- Scraping checks DNS and pins the public address to the HTTPS connection; redirects are independently checked. Private/loopback/link-local IPs, credentials in URLs, nonstandard ports, excessive responses, and non-HTML are rejected.
- Custom-domain sending supports other recipients; sandbox setups must restrict recipients. Distributed request counters limit email and product creation. HTML email is not used, so scraped text cannot inject email markup.
- Bought products stop being checked. Savings are first observed price minus recorded purchase price, floored at zero, grouped by currency; no invented exchange rates.

## Honest limitations

Cheerio does not execute JavaScript. JS-heavy shops, consent walls, bot protection, and regional pricing may prevent extraction; Playwright is a future improvement. Respect each retailer's terms and robots guidance. Variant selection, installment prices, currencies and stale metadata can still confuse extraction. Unsupported pages produce errors rather than zero prices.

AI analysis is probabilistic. Sparse observations mean weak historical evidence, and an observed low is not a market-wide low. Extremely long history can exceed model context/free quota; a failed AI call is recorded and no speculative alert is sent. The dashboard retains the latest successful data.

**“Ships to you” is best effort, never a guarantee.** Domains and snippets do not reliably prove shipping, taxes, stock, authenticity, or exact product identity. Uncertain results read **“Unverified — check at checkout.”** Prices are not converted, unknown prices sort last, and checkout is authoritative. No shipping claim is based solely on a country-code domain.

Email failure is recorded as a check error. Resend idempotency prevents duplicate delivery of the same analysis, but this small version does not have a durable email retry queue. Free provider quotas, key expiry, function deadlines and external outages can interrupt checks. Review provider logs and the per-product error message.

## Accounts and resources

All services used existing browser sessions; no new account login was created.

| Service | Existing identity | Resource / purpose |
| --- | --- | --- |
| GitHub | `wauul` | `wauul/watchtower`, source control and scheduler |
| Neon | Wauul organization, Wael Fezari | New `watchtower` project, `young-mountain-08421044`, Postgres 18, AWS Ohio |
| Groq | `waelfeza@gmail.com` | Watchtower inference key; replacement expiration tracked in deployment notes |
| Resend | `wael.fezari@epitech.eu` | Watchtower sending-only key, sandbox sender |
| Google Cloud | `waelfeza@gmail.com` | Project grounded-gizmo-508515-a8; verified API request returned 403 access denied |
| Vercel | `wauul`, Hobby | Watchtower hosting |

No credentials belong in this table. See `DEPLOYMENT.md` for the verified deployment outcome.

## Checks

```sh
pnpm test
pnpm typecheck
pnpm build
```

Tests cover localized price parsing, private-IP rejection including IPv4-mapped IPv6, JSON-LD price/currency/stock extraction, and tamper-resistant magic links. End-to-end verification must additionally test live scraping, saved history, AI inference, delivery, authenticated dashboard/product access, unauthorized rejection and a cron invocation.



## Community accounts and search updates

The public homepage is a community feed. `/track` is the tracking form, `/login` signs in or creates a persistent account using an emailed link, and `/account` manages the public display name and sign-out. Product pages offer explicit publish/update/unpublish controls. The public feed selects only the shared snapshot and display name, never email, targets or private price history. No tracked products are shared automatically.

Alternative search now uses `TAVILY_API_KEY` when configured, with Google's integration retained for eligible users. Tavily basic searches are capped at 950 attempts per calendar month within the 1,000-credit free plan. Keep paid usage disabled. The product-page search button is limited to three attempts per product per hour; automatic searches still run only for worthwhile alerts. Prices absent from snippets remain unknown, and search results are not guarantees.

The scraper accepts up to 16 MB of decoded HTML and supports gzip, Brotli and deflate. It validates real image URLs, falls back from stale metadata to product-gallery images and refreshes images during checks. Amazon CAPTCHA/bot protection can still block tracking; no browser challenges are bypassed.
