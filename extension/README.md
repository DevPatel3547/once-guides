# Once extension — beta 0.3.2

Unzip this folder, open chrome://extensions (or edge://extensions), enable Developer mode, and choose **Load unpacked**. Select this folder containing manifest.json.

1. Open an HTTP(S) website you have permission to record.
2. Click the Once icon, grant access to that specific website and start recording.
3. Perform your workflow with deliberate clicks. Only the selected tab is recorded.
4. Open the popup and stop recording. Open captured guide to import it into the web editor, or download a JSON backup for manual import.
5. Review titles and every screenshot before sharing. Use Crop / redact to permanently cover visible private information.

Captures are stored locally by Chrome. No automatic uploads or analytics. Input, textarea, editable regions and embedded frames are covered in captured images where detectable; typed values are not logged. Text elsewhere can still contain private data. Capture is not supported in browser settings, Chrome Web Store pages or cross-origin embedded frames. Leaving the approved origin stops recording. Very rapid clicks may have text-only steps. Workflows are limited to 100 steps and approximately 8 MB per capture; download before replacing a capture. The editor supports unlimited local guide count subject to device/browser capacity.

This is an unpacked beta, not a Chrome Web Store release. Test on the included practice page before using on real workflows. The source is original; it does not include Scribe, Tango or Clueso code.
# Release 0.2.0

Pause, resume, and stop are available in the popup and the recorded page. If a page contains custom elements or open shadow roots, capture uses text-only steps because internal fields cannot be reliably inspected. Review every screenshot; automatic masking cannot cover all possible visible private information or dynamic changes.

The editor destination is set when this package is built. This is an unpacked beta, not a Chrome Web Store listing. A page that changes during screenshot capture produces a text-only step to avoid using stale privacy masks.

Release 0.3.1 retries editor delivery until the editor acknowledges the capture. The original recording remains in the extension even after receipt; keep it until you confirm the imported guide is saved. If the editor fails to load, download the JSON backup.

Release 0.3.2 captures the settled view after a click with fresh privacy masks. A change during pixel capture still discards the image. When the view changes, the screenshot omits the old click marker. Missing-image notes now explain how to retry.
