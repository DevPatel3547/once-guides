# Once — local-first workflow guides

A working beta consisting of a Chrome/Edge Manifest V3 capture extension and a web editor. Original implementation; no competitor source code or trademarks are included.

## Features

- Explicit single-tab capture with per-site optional permissions, automatic click titles and highlighted screenshots.
- Local capture storage; no typed-value logging; detected input, editable and iframe regions are masked before screenshot persistence.
- Local IndexedDB guide library, validated JSON imports and capture-to-editor transfer with an explicit import confirmation.
- Step editing/reordering, screenshots, destructive raster redaction and crop, and HTML/Markdown/JSON exports. PDF uses the browser print dialog.
- Optional browser-encrypted AES-GCM snapshots. Decryption keys stay in URL fragments; the server stores ciphertext. Seven-day expiration, per-network daily creation limit, bearer-token revocation.
- Responsive editor, read-only shared guide view, practice workflow, privacy disclosure, keyboard-accessible dialogs and menus.

## Development

Node 24 and pnpm. Install the locked dependencies and start the local editor:

```sh
pnpm install --frozen-lockfile
pnpm extension:dev
pnpm build
pnpm exec wrangler d1 migrations apply DB --local --config dist/server/wrangler.json --persist-to .wrangler/state
pnpm dev
```

Open http://localhost:5173. Load `.sites-runtime/extension` as an unpacked Chrome extension to test capture against the local editor. `public/once-extension.zip` is the matching development package. Never distribute it as a public release: its editor is localhost.

Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`. GitHub Actions runs these checks for pushes and pull requests. Build the public extension with `python3 scripts/package-extension.py --origin https://YOUR-VERIFIED-HOST`; that command updates both entry points together, includes the existing icons, and excludes environment files. See [deployment instructions](release/DEPLOYMENT.md) and [verification status](release/STATUS.md).

## Release boundaries

This is an unpacked beta, not a store-approved production extension. Browser-extension runtime QA is still required on real desktop Chrome/Edge. Unit mocks do not verify captureVisibleTab rendering, navigation timing, browser permissions, or every website's DOM. Test the full recording/import/redaction/export/share/revoke flow before inviting external users. Store publishing requires a developer account, extension icons and listing assets, disclosure review and approval.

The extension supports same-origin workflows in the selected tab, not all desktop apps or cross-origin iframes. Rapid navigation or rapid clicks may produce text-only steps; the editor explicitly flags them. Capture is limited to 100 steps and around 8 MB. The platform may require sign-in while the deployment is owner-private; recipient links only become usable by external users after the owner explicitly enables public access.

Local guides are device-specific, not automatically synchronized. Browser clearing deletes them; export backups. Revocation keys remain in local guide state and are intentionally excluded from share snapshots and exported backups. Revoking a link cannot remove recipient downloads.

Hosted sharing is limited to 8 MB and 10 attempts per network per UTC day. IP-derived daily counters and encrypted payload sizes/timing are server-side metadata. Expired ciphertext is removed when visited or during bounded cleanup on later share requests, not guaranteed immediately at expiration. Add scheduled deletion, deployment-wide storage quotas, operational monitoring and stronger abuse protection before a large public launch. The endpoint is not a substitute for an independently audited secure document vault. No uptime, load or privacy certification is claimed.

## Architecture

Browser extension → chrome.storage.local → confirmed editor import → IndexedDB.
Optional share: validated guide → AES-GCM in browser → ciphertext in R2 + expiry/revocation hash in D1.
Recipient: share ID → encrypted bytes → URL-fragment key → browser decryption → text-safe read-only view.

No paid AI API is required. Capture instructions use accessible labels and simple templates; this beta does not generate video or AI voiceovers.
