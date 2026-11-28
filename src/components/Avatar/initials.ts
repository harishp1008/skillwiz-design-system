const titles = new Set(['dr', 'mr', 'mrs', 'ms', 'miss', 'mx', 'prof', 'sir', 'shri', 'smt', 'kumari']);

const firstGlyph = (word: string): string => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const first = seg.segment(word)[Symbol.iterator]().next();
    return first.done ? '' : first.value.segment;
  }
  return Array.from(word)[0] ?? '';
};

/**
 * Up to two letters from a name: first letter of the first name and of the last name, middle names skipped,
 * titles and bracketed text dropped, uppercase. One name gives one letter. Returns an empty string when there is no usable name,
 * so the avatar shows the user icon (never a letter from an email).
 */
export function initialsOf(name: string | undefined): string {
  if (!name || /^\S+@\S+$/.test(name.trim())) return ''; // an email is not a name
  const words = name
    .replace(/\([^)]*\)/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter((w) => w && !titles.has(w.toLowerCase()));
  if (words.length === 0) return '';
  const first = words[0] as string;
  const last = words[words.length - 1] as string;
  const glyphs = words.length === 1 ? [first] : [first, last];
  return glyphs.map((w) => firstGlyph(w).toLocaleUpperCase()).join('');
}
