# Once launch kit — draft, not posted

## Positioning
Once turns a browser workflow into an editable how-to guide. Capture once, check the screenshots, share the instructions. Start with operations teams and customer support staff who repeatedly explain the same browser task.

## Chrome Web Store
Name: Once — workflow guides

Short description: Record a browser workflow, edit its steps, redact screenshots, and export a guide. Local-first, with HTML, Markdown, JSON and PDF exports.

Detailed description:

Stop explaining the same browser task from memory. Once helps you turn the steps into a guide someone else can follow.

Start recording on a website you approve. Click through the task, pause when needed, and stop when finished. Open the capture in Once to rename steps, add context, reorder instructions, and review the screenshots. Crop images or permanently cover sensitive information before sharing.

Export a standalone HTML guide, Markdown, or a JSON backup. Use your browser’s print dialog to save a PDF. Hosted sharing is disabled in this public beta. Send an exported file instead.

Your captures and edited guides stay in local browser storage until you export them. The recorder does not log keystrokes or intentionally read typed field values. Once includes no advertising trackers. Automatic masking is a precaution, not a guarantee: always review visible personal information before sharing.

Current limitations: capture stays in one tab and on one approved website; browser settings, the Chrome Web Store, and some restricted pages cannot be captured. Fast navigation or pages that cannot be safely masked may produce a step without a screenshot. Capture is limited to 100 steps and local storage capacity.

## Privacy fields — verify against the final release
Single purpose: Create editable step-by-step guides from a user-started browser workflow.

- activeTab: Identify the current tab and capture its visible area during a user-started workflow.
- scripting: Install the packaged click recorder on the approved website and transfer a stopped capture to the editor after the user requests it.
- storage: Keep the local capture, recording state, and pending editor handoff across popup closures and service worker lifetimes.
- Optional HTTP/HTTPS host access: Request access to the specific website selected by the user, and separately to the editor for an explicit handoff. No blanket host permission is granted on installation.
- Remote executable code: No remote executable code is loaded by the extension. The editor is a separate website.
- Data disclosures: Account for website content, user activity/click labels, and visible personal information potentially present in screenshots. Public beta hosted sharing is disabled and does not accept guide uploads. The host still processes ordinary connection metadata. Review current dashboard disclosure wording against local capture behavior.
- Privacy URL: https://once-guide.once-guides.workers.dev/privacy. Support: https://once-guide.once-guides.workers.dev/support.

## Show HN draft
Title: Show HN: Once — local-first browser workflows into editable how-to guides

I built Once for the browser tasks I kept explaining repeatedly. You record a workflow, review the generated steps and screenshots, then export a guide as HTML or Markdown. You can crop and redact screenshots before they leave your browser.

The extension is deliberately explicit about capture: one approved website, a visible recording control, and no typed-value recording. Hosted sharing is disabled in this beta; use file exports. Automatic masking still needs human review; I would especially appreciate examples where a capture is confusing or incomplete.

Try it: https://once-guide.once-guides.workers.dev
Extension: https://once-guide.once-guides.workers.dev/once-extension.zip (unpacked beta; not a store listing)

What browser workflow do you most often have to explain twice?

## Product Hunt draft
Tagline: Do it once. Share the how.

Description: Turn a browser task into an editable step-by-step guide. Record clicks, review and redact screenshots, and export your instructions. Local-first editing and file exports.

Maker comment: I built Once because screenshots and written instructions drift apart when you create them separately. Once keeps each screenshot with its step, then lets you clean up the guide before sending it. The first version focuses on a small job: make repeat browser instructions easier to produce and safer to review. I’d love feedback from people writing support walkthroughs and internal SOPs.

## Reddit draft — only in a community that permits maker posts
Title: I built a free tool to turn browser workflows into editable guides

I’m the maker of Once. It records a workflow on a website you approve, pairs clicks with screenshots when available, and lets you edit and redact the result before exporting. I made it for repeated support explanations and internal how-to documents.

It’s an early release with clear limits: one site at a time, no mobile capture, and screenshots still need review. If this is useful for your work, I’d love to see where it falls short: https://once-guide.once-guides.workers.dev.

## X / Bluesky draft
I built Once to stop explaining the same browser task twice.

Record → edit the steps → redact screenshots → export a guide.

Local-first. No guide account required on the public release. Export HTML, Markdown, JSON or PDF. Hosted sharing is disabled.

Try it: https://once-guide.once-guides.workers.dev

## Demo storyboard (record the real product)
0–5s: Repeat instructions: “How do I invite a teammate?”
5–15s: Record only the fictional practice workspace; click Members and Send invitation.
15–23s: Stop, open the guide, rename a step, redact a sample field.
23–30s: Export HTML and show the resulting guide. Close with the neutral public URL.
Do not use customer accounts, employer material, real emails, fabricated installation counts, or mock screenshots presented as the working product.

## Launch sequence
1. Complete installed-recorder acceptance testing; the neutral public deployment is live.
2. Confirm publisher registration and access, add genuine product screenshots, submit the store package, and wait for approval. The approved support contact is already live.
3. Recruit five consenting testers through brand accounts. Fix onboarding failures before broad promotion.
4. Post one Show HN submission when visitors can actually try the product; respond to technical feedback.
5. Publish Product Hunt and the demo through the maker/brand account. Disclose that you built it.
6. Select one relevant community, read its current rules, and post only if allowed. Tailor the example to that audience. Do not mass-post duplicates or send unsolicited DMs.
7. Track actual installs, first successful guide exports, returning users, bug reports, and source links. Do not invent metrics. Add analytics only with an explicit implementation and matching privacy disclosure.

## Reference requirements
- Chrome registration: https://developer.chrome.com/docs/webstore/register
- Chrome privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Show HN: https://news.ycombinator.com/showhn.html
- Reddit self-promotion guidance: https://www.reddit.com/r/reddit.com/wiki/selfpromotion/

These are editable drafts. The public URLs and support contact are live. Installed-recorder acceptance, demo, store submission, approval, and published posts remain incomplete.

## Verified release links — September 19, 2026
- App: https://once-guide.once-guides.workers.dev
- Privacy: https://once-guide.once-guides.workers.dev/privacy
- Support: https://once-guide.once-guides.workers.dev/support
- Support email approved by owner: thefool3547@gmail.com
- Extension 0.3.2: https://once-guide.once-guides.workers.dev/once-extension.zip
- Store status: not submitted. Do not present the ZIP as an approved store listing.
- Marketing status: none of these drafts have been published. Real capture demo remains pending installed-extension testing.
