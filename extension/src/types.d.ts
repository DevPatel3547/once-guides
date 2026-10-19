// Shared message and storage shapes for the extension scripts. Ambient on
// purpose: each entry point is compiled as a classic script (no import/export)
// because Chrome injects content.js with scripting.executeScript and the popup
// loads popup.js without type="module".

interface MaskRect { x: number; y: number; w: number; h: number }

/** What the content script reports about the page right before/after a capture. */
interface PageState {
  href: string;
  width: number;
  height: number;
  masks: MaskRect[];
  unsafeMasking: boolean;
  revision: number;
}

interface CaptureMessage extends PageState {
  type: 'CAPTURE';
  title: string;
  url: string;
  x: number;
  y: number;
}

interface GuideStep {
  id: string;
  title: string;
  note: string;
  image?: string;
  url: string;
}

interface CapturedGuide {
  version: 1;
  id: string;
  title: string;
  description: string;
  created: number;
  updated: number;
  steps: GuideStep[];
}

/** The single record kept in chrome.storage.local under the key "once". */
interface RecorderState {
  recording?: boolean;
  paused?: boolean;
  tabId?: number;
  origin?: string;
  guide?: CapturedGuide;
}

/** Pending editor handoff kept in chrome.storage.session until acknowledged. */
interface PendingTransfer {
  tabId: number;
  guide: CapturedGuide;
  transferId: string;
}

interface PageStatus {
  recording: boolean;
  paused: boolean;
  origin?: string;
  steps: number;
}

type CommandResult = { ok: true } | { error: string } | RecorderState | PageStatus;

type ExtensionMessage =
  | CaptureMessage
  | { type: 'PAGE_STATUS' }
  | { type: 'PAGE_CONTROL'; action: string }
  | { type: 'STATUS' }
  | { type: 'START'; tabId: number; origin: string; title?: string }
  | { type: 'STOP' }
  | { type: 'PAUSE' }
  | { type: 'CLEAR' }
  | { type: 'EDITOR' }
  | { type: 'ONCE_SCREENSHOT_STATE' };

/** Set by content.js so re-injection after navigation does not install twice. */
interface Window { __onceCaptureInstalled?: boolean }
