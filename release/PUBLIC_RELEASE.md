# Once public beta — September 20, 2026

App: https://once-guide.once-guides.workers.dev
Extension 0.3.2: https://once-guide.once-guides.workers.dev/once-extension.zip
Privacy: https://once-guide.once-guides.workers.dev/privacy
Support: https://once-guide.once-guides.workers.dev/support
Owner-approved contact: thefool3547@gmail.com

## Released
Deployment 90ce2030fc414913a47c16bfbb200d90. Cloudflare storage bindings remain empty. Hosted sharing deliberately disabled by the owner; use file exports. No R2/D1 resources or paid upgrades created.

0.3.2 corrects a screenshot timing defect: the prior implementation rejected ordinary clicks that changed the DOM before capture began. The recorder now waits briefly for the click response and samples fresh masking geometry. It still discards images if the page or masking changes during capture, if the page navigates, or if the recorded tab loses focus. Old click markers are omitted after view changes. Missing-image notes provide retry guidance. Pages with custom elements/open shadow roots remain conservatively text-only.

## Verification
21 automated tests passed, including fresh-mask success, changed/invalid mask rejection, navigation rejection, sender isolation, and retained editor handoff. Targeted lint passed with zero errors and two existing test warnings. The website production build and typecheck passed in the preceding release; this patch changes only extension code and release artifacts.

Production smoke passed at 2026-09-20T18:51:35.242Z: four public pages, all 28 deployed asset hashes verified, hosted writes disabled (503), cross-origin writes rejected (403). Prior public Chrome checks verified sample guide editing, reload persistence, HTML export, and the support page. Those sample-guide checks do not verify the installed recorder.

## Outstanding external steps
The owner reported screenshots not working in 0.3.1. The defect above is corrected and regression-tested, but 0.3.2 still requires installed-Chrome acceptance before claiming the reported issue fully resolved. The original unpacked folder /Users/overse/Downloads/Once-Extension-0.3.1 now contains 0.3.2, preserving the installed path; Chrome must reload it. Browser policy blocks extension-management controls. Broad native inspection was rejected because unrelated private content was foreground; the Once-only foreground/access request is pending.

Store submission and approval: not completed. Publisher registration/access for the approved email is unverified. Two genuine 1280×800 editor/export screenshots of the test guide are included. The real recorder demo remains outstanding. Any required registration fee/terms require the owner. No launch posts have been published; existing publishing accounts have not been specified. No real-user metrics are claimed.

The package includes the extension, store submission text, launch drafts, promotional artwork, two genuine editor/export screenshots, production checks and integrity hashes. Older 0.3.1 records and STATUS.md blockers are superseded by this document where they conflict.
