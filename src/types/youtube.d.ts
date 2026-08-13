// @types/youtube declares the global `YT` namespace but not how the IFrame API
// announces itself on `window`. No imports here on purpose — this file has to
// stay a script so the interface merges into the global `Window`.

interface Window {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: () => void
}
