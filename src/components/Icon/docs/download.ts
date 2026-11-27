import { iconNames, pathsOf, type IconName } from '../icons';

const NS = 'xmlns="http://www.w3.org/2000/svg"';
const attrs = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

/** One icon as a standalone .svg file. Colour follows currentColor. */
export const svgFile = (name: IconName) =>
  `<svg ${NS} width="24" height="24" viewBox="0 0 24 24" ${attrs}>\n${pathsOf(name).map((d) => `  <path d="${d}"/>`).join('\n')}\n</svg>\n`;

/** The whole set as one sprite sheet. Use with <use href="sheet.svg#book-open">. */
export const spriteSheet = () =>
  `<svg ${NS} style="display:none">\n${iconNames
    .map((n) => `  <symbol id="${n}" viewBox="0 0 24 24" ${attrs}>${pathsOf(n).map((d) => `<path d="${d}"/>`).join('')}</symbol>`)
    .join('\n')}\n</svg>\n`;

/* A minimal zip writer (stored, no compression) so the download is always built from the same source as the page. */
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (const x of b) c = (crcTable[(c ^ x) & 0xff] as number) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
export function zip(files: { name: string; text: string }[]): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const u16 = (v: number) => [v & 255, (v >>> 8) & 255];
  const u32 = (v: number) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.text);
    const crc = crc32(data);
    const local = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...name]);
    parts.push(local, data);
    central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name]));
    offset += local.length + data.length;
  }
  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cdSize), ...u32(offset), ...u16(0)]);
  return new Blob([...parts, ...central, end] as BlobPart[], { type: 'application/zip' });
}

export function save(name: string, content: Blob | string, type = 'image/svg+xml') {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const downloadZip = () => save('skillwiz-icons.zip', zip(iconNames.map((n) => ({ name: `${n}.svg`, text: svgFile(n) }))), 'application/zip');
export const downloadSprite = () => save('skillwiz-icons-sprite.svg', spriteSheet());
export const downloadIcon = (n: IconName) => save(`${n}.svg`, svgFile(n));
