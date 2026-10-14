# Release gates and identity audit

## Public identity boundary
The previous owner-only hostname contains personal identifiers. The current development package targets localhost; it is not a public release. Build a release package for the verified neutral public origin using scripts/package-extension.py.

Required: a neutral domain, DNS access, a dedicated support email, a brand publisher account, and brand marketing accounts. Pass the final origin to scripts/package-extension.py, update all public links, and verify the old hostname is absent from distributed assets. A neutral domain alone does not guarantee that hosting redirects, headers, certificates, or account pages reveal no connection; inspect them before public release.

Keep this repository private until its files AND commit metadata have been audited. The connected personal GitHub account must not be used for anonymous promotion. If publishing source later, use a brand-owned repository and a deliberate history export; do not rewrite the existing private source history to hide it.

Public pseudonymity is the goal. Store, domain, hosting, payment, and platform providers can require accurate identity information. Do not falsify those details. Check publisher information actually displayed by the store before submission.

## Acceptance checks requiring real desktop Chrome
These are not yet passed by unit tests or deployment success.

- Load the packaged extension; approve only the chosen site; reject a permission request and confirm no recording starts.
- Record the fictional practice workflow, including navigation, fast double clicks, scrolling, and a single-page route change.
- Verify the indicator appears only on the recorded tab. Pause: no new steps. Resume: steps continue. Stop: no later clicks captured.
- Switch tabs and navigate to another origin; confirm no unrelated screenshot is retained.
- Check text inputs, password fields, contenteditable, iframe, open/closed shadow DOM, and marked private regions. Sensitive text must not appear in retained screenshots; unsupported cases must be explicitly reviewed or recorded without an image.
- Close/reopen popup; restart the service worker; restart Chrome; close the captured tab. Verify capture preservation and recording shutdown behavior.
- Open captured guide after both a warm and cold editor load. If handoff fails, JSON backup must import without losing steps.
- Edit, reorder, redact, crop, undo, reload, export HTML/Markdown/JSON, and print PDF. Review the actual exported redaction pixels.
- Test storage-full and maximum-size cases. Existing guides must remain recoverable.
- On final public hosting, create a shared guide, read it in a separate browser profile, test the wrong key, revoke it, and verify access is denied afterward.
- Inspect mobile layout, keyboard navigation, contrast, and dialog focus.
- Test the install flow with someone who has never used the tool.

## Operations before general availability
- Provide a monitored brand support inbox and a bug-report path.
- Verify hosting quotas, actual cost limits, and alerting. Current application cap: 200 hosted share attempts per day globally, 10 per network per day; 8 MB each, seven-day link lifetime. These intentionally constrain this beta and are not a large-scale service promise.
- Verify request-driven expired-object cleanup and plan scheduled lifecycle deletion if a fixed physical-retention guarantee is required.
- Keep the previous deployed version available for rollback. Never rollback by deleting user data.
- Run tests and build for every release; produce the package with scripts/package-extension.py.
- Register store account, complete required payment/verification, supply icons and actual screenshots, submit, and resolve review findings. No approval or install count is implied by having a ZIP.

## Requested access to finish
1. Neutral domain + DNS management through a supported provider connection.
2. Brand Chrome Web Store developer account, with registration/verification completed by its owner.
3. Dedicated brand support inbox.
4. Brand accounts for the desired launch channels, authenticated through supported sign-in. Never send passwords in chat.
5. Desktop Chrome testing access or completed acceptance evidence, including explicit permission to install this unpacked build for testing.
6. Optional brand GitHub repository if public source distribution is desired; not required for store distribution.

No paid promotion, fake reviews, purchased votes, invented adoption, or posts from the personal GitHub/LinkedIn account are included.
