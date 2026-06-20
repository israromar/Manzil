/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  // Was `lineWidth` — not a valid Prettier option; caused default 80-col breaks.
  printWidth: 120,
  // Keep `>` on the same line as the last JSX attribute.
  bracketSameLine: true,
  // Don't force one attribute per line in JSX.
  singleAttributePerLine: false,
};
