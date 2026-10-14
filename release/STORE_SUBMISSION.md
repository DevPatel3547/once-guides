# Once 0.3.2 — submission materials (not submitted)

Name: Once — workflow guides
Short description: Record browser workflows, edit steps, review screenshots, and export local-first how-to guides.
Category: Productivity (verify the current dashboard category).
Package: once-extension.zip
Homepage: https://once-guide.once-guides.workers.dev
Privacy: https://once-guide.once-guides.workers.dev/privacy
Support: https://once-guide.once-guides.workers.dev/support
Contact: thefool3547@gmail.com (owner-approved)

## Description
Record a workflow on one website you approve. Pause or stop recording, then open the capture in Once to rename steps, add notes, reorder instructions and review screenshots. Crop or redact before exporting.

Export standalone HTML, Markdown, a Once JSON backup, or use browser print for PDF. Captures and edited guides stay in local browser storage. Hosted sharing is disabled in this beta.

The recorder does not log keystrokes or intentionally read typed values. Automatic field masking is a precaution, not a guarantee. Visible page content can contain sensitive information; review every screenshot before sharing an exported file.

Desktop Chrome; one approved site and tab; up to 100 steps and about 8 MB per capture. Restricted pages cannot be captured. Export backups before clearing browser storage.

## Single purpose and permissions
Single purpose: create editable step-by-step guides from user-started browser workflows.
- activeTab: capture the visible user-selected tab during recording.
- scripting: inject packaged click recorder code into the approved site and transfer a stopped capture to the editor.
- storage: retain local capture, recording state and pending editor handoff across popup closures and service-worker lifetimes.
- Optional HTTP/HTTPS hosts: access requested for the selected site and separately for editor handoff. No blanket install-time site access.
- Remote executable code: none in extension. Companion editor is a separate website.

## Data-use answers to verify against current form
Website content and click activity are processed locally. Screenshots can contain visible personal information. No advertising, data sale, or analytics tracker. Public beta has no hosted guide-storage bindings. Hosting handles ordinary connection metadata. Do not claim screenshots never contain sensitive information or mark disclosures without reading current dashboard wording.

## Reviewer instructions
No product account required. Install and open https://once-guide.once-guides.workers.dev/practice. Start recording and approve this site. Click Workspace settings, Members, Send invitation (fictional; no real email sent). Stop, open capture, approve editor permission, import, edit and export HTML/JSON. Verify reload persistence, pause/resume and tab boundaries. Share should explain hosting is disabled.

## Submission gate
Not submitted or approved. Publisher sign-in/registration and any required registration fee remain owner actions. Confirm public publisher identity; keep source GitHub private. The 440×280 promo tile and two actual 1280×800 JPEG screenshots are included (store-editor.jpg and store-export.jpg). These show the live editor with a test guide; they do not demonstrate extension capture. Recorder acceptance and a real recording demo remain pending.

References checked September 19, 2026:
https://developer.chrome.com/docs/webstore/register
https://developer.chrome.com/docs/webstore/cws-dashboard-listing
https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
