/** Cuts a label at `max` characters with an ellipsis. The full text stays available for the tooltip and the accessible name. */
export function truncateLabel(text: string, max: number): { shown: string; cut: boolean } {
  if (text.length <= max) return { shown: text, cut: false };
  return { shown: `${text.slice(0, max - 1).trimEnd()}…`, cut: true };
}
