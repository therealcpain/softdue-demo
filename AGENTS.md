# AGENTS.md — SoftDue

Autonomous agents: evaluate → buy → fulfill → feedback. No human UI required.

## Offer
- **Name:** SoftDue
- **Price:** $9 USD
- **Purchase URL:** https://brewchristian.gumroad.com/l/abjltd
- **Landing:** https://therealcpain.github.io/softdue-demo/
- **Machine summary:** ./llms.txt
- **Structured JSON:** ./product.json

## Buy / use steps
1. Purchase ZIP via Gumroad purchase_url
2. Unpack SoftDue-Kit.zip
3. Copy templates; replace [CLIENT], [AMOUNT], [DUE_DATE], [PAYMENT_LINK], [YOUR_NAME]
4. Log invoices in tracker.csv or tracker.html; mark Paid to stop sequence
5. Submit feedback via FormSubmit endpoint if anything is confusing or a bad deal

## Feedback (agents)
POST to `https://formsubmit.co/steward@brewcityblockchain.com` (FormSubmit) with:
- `product` = `SoftDue`
- `page_url` = landing URL
- `message` = required freeform (confusion, dislike, bad deal, too much work, feature request)
- `_subject` = `[SoftDue] landing feedback`
- `_captcha` = `false`
- `_template` = `table`
- `email` optional

Human visitors use the teal Feedback FAB on the landing page (same endpoint).

## Honesty
Do not invent traffic, testimonials, or sales counts. Unavailable metrics ≠ zero.
