# Deploy Once to a neutral Cloudflare hostname

The source repository stays private. The public Worker and extension should use Once branding, with no personal GitHub links or personally named hosting subdomains. No public deployment has been completed from this checkout yet.

## Required account state

- Sign in to Cloudflare and authenticate Wrangler with `pnpm exec wrangler login`.
- Choose a neutral Workers subdomain in the dashboard. Use Workers Free unless the owner approves a paid change.
- Create a D1 database named `once-guides` and an R2 bucket named `once-shares` in the intended account. Record the D1 database ID.
- R2 includes free usage but can accrue usage charges beyond it. Do not enable a billing subscription, add a payment method, or buy a domain without the owner's approval. If the account requires billing setup, stop there and show the concrete terms.
- Set a monitored brand support inbox before publishing the store listing. Update `app/privacy/page.tsx` with that real contact and the actual public availability status.

References: [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [Cloudflare billing](https://developers.cloudflare.com/billing/understand/how-billing-works/), [Chrome developer registration](https://developer.chrome.com/docs/webstore/register).

## Prepare the release

Supply the real values in the shell environment (the values below are placeholders, not provisioned resources):

```sh
export ONCE_PUBLIC_ORIGIN='https://once-guide.YOUR-NEUTRAL-SUBDOMAIN.workers.dev'
export ONCE_DATABASE_ID='YOUR-D1-DATABASE-UUID'
export ONCE_BUCKET_NAME='once-shares'
export ONCE_DATABASE_NAME='once-guides'
export ONCE_WORKER_NAME='once-guide'
pnpm release:prepare
```

This runs the tests, type check, lint, extension packaging, and production build. It verifies the output bindings match the requested account resources. It does not deploy or create resources. The ZIP and `.sites-runtime/extension` target the provided origin; source files keep localhost for development.

Review `dist/server/wrangler.json`, then apply migrations and deploy:

```sh
pnpm exec wrangler d1 migrations apply DB --remote --config dist/server/wrangler.json
pnpm exec wrangler deploy --config dist/server/wrangler.json
```

Never use the placeholder database UUID for a public deployment. Database migrations have an explicit path in the generated configuration. Keep local development state separate with `--local --persist-to .wrangler/state`.

## Verify the actual deployment

1. Open the public home, practice, and privacy pages in a browser without the owner's session. Confirm no owner-only redirect and no personally named domain or public account links.
2. Download the hosted ZIP and verify both JavaScript entry points target the public origin.
3. Load that exact package in desktop Chrome. Complete recording, permission-denial, pause/resume, navigation, screenshot masking, and editor handoff checks in `RELEASE_GATES.md`.
4. Create a fictional guide with an image. Edit and redact it, reload, export HTML/Markdown/JSON/PDF, and inspect the resulting image pixels.
5. Create a hosted link, open it from a separate browser, try a wrong key, revoke it, and verify it is no longer served.
6. Review actual usage allowances and billing state. Application rate limits do not guarantee a zero bill. The existing implementation uses request-driven expiry cleanup, not a scheduled physical-deletion guarantee.
7. Only after this verification, upload the release ZIP and actual screenshots to the brand Chrome Web Store developer account. Registration, any required fee, and store approval remain separate steps.
8. Replace placeholders in `LAUNCH_KIT.md` with the verified public URL and approved store listing. Publish through authenticated brand accounts, with maker disclosure.

## Rollback

Keep the previous successful Worker version available in Cloudflare. Roll back the Worker version if needed; do not delete databases or buckets. Keep the prior store package and version notes. Never try to undo a release by removing users' shared objects.

## Local-only beta (owner-selected September 19)

R2 remains disabled. Set `ONCE_SHARING_ENABLED=false` when building to omit both storage bindings; the editor displays an unavailable-sharing explanation. Do not apply database migrations or activate R2 for this mode. The account subdomain `once-guides.workers.dev` has been reserved, but no live Worker URL is verified yet.

The existing `release:prepare` command is for storage-enabled releases. For the local-only beta, run the tests, typecheck and lint, package the extension for the verified origin, then build with `ONCE_SHARING_ENABLED=false`. Inspect the generated configuration to confirm both binding arrays are empty before deployment. Update the privacy availability notice before publishing. Wrangler OAuth is separate from the working MCP connection.
