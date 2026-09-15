# Amazon B07GXS35PG regression fixture

Source: https://www.amazon.fr/-/en/BISSELL-SpotClean-ProHeat-36988-Shampoo/dp/B07GXS35PG/ref=sr_1_3?sr=8-3
Captured anonymously on 2026-09-15. This is actual selected product-title, price, availability and image markup, not a fabricated product fixture. No account cookies or API keys were used. The decoded source response was 2,460,279 bytes. The displayed main price and current extraction both read EUR 149.99.

The previously reported missing-price bug came from the old 2 MB response cap and missing transport decompression. Both were fixed before this testing task. Current code succeeds on the live page, so no new application-code change is justified by this capture. The earlier EUR 124.99 production observation is not enough evidence to call EUR 149.99 wrong: those responses were captured at different times/locations.

Regression tests parse this exact snippet and pass it through mocked gzip/Brotli/deflate responses with more than 2 MB of inert HTML padding. They also preserve the 16 MB decoded-size guard. Changing price extraction, reducing the response cap, or removing decompression will now break deterministic tests. A separate JavaScript-only fixture test confirms that missing price engages AI fallback and fails clearly if the model returns null. No headless browser was added.

The full response is intentionally not committed; only markup relevant to the regression is retained. Normal CI never revisits this URL. Tavily and Google JSON fixtures are synthetic API examples for deterministic tests.
