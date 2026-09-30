# Watchtower

## Platform
web

## Product purpose
Help shoppers follow a product's observed price and availability, receive an explained alert on a meaningful change, and decide when to buy. A private watchlist and an explicitly published community snapshot are separate experiences.

## Users
Inferred from the existing product: individual shoppers comparing a considered purchase over time, and visitors browsing recommendations from other shoppers. No geographic market is assumed; the app supports multiple countries and currencies without exchange-rate conversion.

## Capabilities and constraints
Next.js App Router, React, TypeScript, Prisma/Postgres. HTTPS scraping is best effort and does not execute retailer JavaScript or bypass challenges. Groq opinions are advisory. Tavily/Google search snippets and shipping claims need checkout verification. Resend sends access and alert emails. Six-hour scheduled checks and daily fallback are best effort, with bounded batches. Accounts support Google sign-in, email links and optional passwords; watchlists are email-owned. Users may publish, update, unpublish, vote, record a purchase, undo it, or permanently delete a tracked product. Newsletter signup requires confirmation; no broadcast scheduler is implemented.

## Brand commitments
Preserve the Watchtower name, existing radar mark, factual meaning, routes, API contracts and working flows. The user authorizes a complete visual/copy redesign, directs us to choose the strongest of three directions without an approval round, and requires light/dark themes, mobile usability, accessibility, performance and full route coverage.

## Evidence
Source code, Prisma schema/migrations, README, historical DEPLOYMENT.md, deterministic tests, retailer images when stored. No supplied customer quotes, awards, statistics or new capabilities may be invented. Visual test records are isolated local fixtures, never production content.

## Principles
Explain observations; do not imply certainty. Make private/public boundaries explicit. Show prices in their recorded currency. Give users clear recovery actions. Keep frequent tasks fast and keyboard accessible.
