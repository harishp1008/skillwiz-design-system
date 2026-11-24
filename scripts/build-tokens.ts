// Generates CSS custom properties and TypeScript exports from tokens/*.json.
// Usage: node scripts/build-tokens.ts [--check] [--tokens-dir <dir>] [--out-dir <dir>]
// Token format: { "group": { "name": { "$value": "..." } } }; references are "{group.name}".
// Strict hierarchy (primitive -> semantic -> component):
//   primitive: raw values only, no references.
//   semantic:  references to primitive tokens only; no raw values.
//   component: references to semantic tokens only, OR a raw component-specific value that carries
//              "$source": "documented" (the style guide specifies it) or "observed" (allowed only while the
//              token is flagged provisional/unresolved). References and raw values may not be mixed.
// Descriptions ($description) must describe purpose and usage and may not contain literal design values.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const PREFIX = 'sw';
const LAYERS = ['primitive', 'semantic', 'component'] as const;
type Layer = (typeof LAYERS)[number];
const ALLOWED_REFS: Record<Layer, readonly Layer[]> = {
  primitive: [],
  semantic: ['primitive'],
  component: ['semantic'],
};

const STATUSES = ['provisional', 'unresolved', 'retired'] as const;
type Status = (typeof STATUSES)[number];
const SOURCES = ['documented', 'observed'] as const;
type Source = (typeof SOURCES)[number];

// A literal design value (hex colour, rgba(), a number with a unit, ratio, NxN, percentage, any bare number)
// after token paths such as "color.blue.e4f0fe" have been removed.
const PATH_REF = /\b[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+\b/g;
const LITERAL = /#[0-9a-f]{3,8}\b|\brgba?\(|\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|pt)\b|\d%|\d:\d|\b\d+\s*[x×]\s*\d+\b|\b\d*\.\d+\b|\b\d+\b/i;

type Token = { layer: Layer; path: string; name: string; raw: string; description?: string; status?: Status; source?: Source };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { values: args } = parseArgs({
  options: {
    check: { type: 'boolean' },
    'tokens-dir': { type: 'string' },
    'out-dir': { type: 'string' },
  },
});
const tokensDir = resolve(args['tokens-dir'] ?? join(root, 'tokens'));
const outDir = resolve(args['out-dir'] ?? root);
const cssPath = join(outDir, 'src/styles/tokens.css');
const tsPath = join(outDir, 'src/tokens/tokens.generated.ts');

const fail = (msg: string): never => {
  console.error(`build-tokens: ${msg}`);
  process.exit(1);
};

const tokens = new Map<string, Token>(); // key: dotted path
const names = new Map<string, string>(); // css name -> dotted path

function walk(node: unknown, path: string[], layer: Layer, file: string): void {
  const where = `${file}: ${path.join('.') || '(root)'}`;
  if (typeof node !== 'object' || node === null || Array.isArray(node)) fail(`${where} must be an object`);
  const obj = node as Record<string, unknown>;
  const anyDesc = obj['$description'];
  if (anyDesc !== undefined) {
    if (typeof anyDesc !== 'string') fail(`${where} $description must be a string`);
    const hit = LITERAL.exec((anyDesc as string).replace(PATH_REF, ''));
    if (hit) {
      fail(`${where} $description contains a literal design value ("${hit[0]}"). Describe purpose and usage; values belong in $value.`);
    }
  }
  if ('$value' in obj) {
    const v = obj['$value'];
    if (typeof v !== 'string' && typeof v !== 'number') fail(`${where} $value must be a string or number`);
    const dotted = path.join('.');
    const name = `--${PREFIX}-${path.join('-')}`;
    if (tokens.has(dotted)) fail(`${where} is defined twice`);
    if (names.has(name)) fail(`${where} collides with ${names.get(name)} (both become ${name})`);
    const desc = obj['$description'];
    const status = obj['$status'];
    if (desc !== undefined && typeof desc !== 'string') fail(`${where} $description must be a string`);
    if (status !== undefined && !STATUSES.includes(status as Status)) {
      fail(`${where} $status must be one of ${STATUSES.join(', ')}`);
    }
    const source = obj['$source'];
    if (source !== undefined && !SOURCES.includes(source as Source)) {
      fail(`${where} $source must be one of ${SOURCES.join(', ')}`);
    }
    tokens.set(dotted, {
      layer,
      path: dotted,
      name,
      raw: String(v),
      description: desc as string | undefined,
      status: status as Status | undefined,
      source: source as Source | undefined,
    });
    names.set(name, dotted);
    return;
  }
  for (const [key, child] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) fail(`${where}: key "${key}" must be lowercase kebab-case`);
    walk(child, [...path, key], layer, file);
  }
}

for (const layer of LAYERS) {
  const file = join(tokensDir, `${layer}.json`);
  if (!existsSync(file)) fail(`missing ${file}`);
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`${file} is not valid JSON (${(e as Error).message})`);
  }
  walk(json, [], layer, `${layer}.json`);
}

const REF = /\{([a-z0-9.-]+)\}/g;

function toCss(t: Token): string {
  return t.raw.replace(REF, (_m, ref: string) => {
    const target = tokens.get(ref);
    if (!target) return fail(`${t.path} references unknown token {${ref}}`);
    if (!ALLOWED_REFS[t.layer].includes(target.layer)) {
      return fail(`${t.layer} token ${t.path} may not reference ${target.layer} token {${ref}}`);
    }
    return `var(${target.name})`;
  });
}

function resolveValue(t: Token): string {
  return t.raw.replace(REF, (_m, ref: string) => resolveValue(tokens.get(ref) as Token));
}

const refsOf = (t: Token): string[] => [...t.raw.matchAll(REF)].map((m) => m[1] as string);

const lookup = (t: Token, r: string): Token => tokens.get(r) ?? fail(`${t.path} references unknown token {${r}}`);

// A retired token may only be referenced by another retired token.
for (const t of tokens.values()) {
  for (const r of refsOf(t)) {
    if (lookup(t, r).status === 'retired' && t.status !== 'retired') {
      fail(`${t.path} references retired token {${r}}`);
    }
  }
}

// Shape rules per layer.
for (const t of tokens.values()) {
  const refs = refsOf(t);
  const literal = t.raw.replace(REF, '').trim();
  if (t.source && (t.layer !== 'component' || refs.length > 0)) {
    fail(`${t.path}: $source is only valid on a raw component value (a component token without references)`);
  }
  if (t.layer === 'semantic' && (refs.length === 0 || literal !== '')) {
    fail(`semantic token ${t.path} must be made of primitive references only (no raw values)`);
  }
  if (t.layer === 'component') {
    if (refs.length > 0 && literal !== '') fail(`component token ${t.path} may not mix references and raw values`);
    if (refs.length === 0) {
      if (!t.source) {
        fail(`component token ${t.path} has a raw value, so it needs "$source": "documented" (the style guide specifies it) or "observed" (only while flagged provisional or unresolved)`);
      }
      if (t.source === 'observed' && t.status !== 'provisional' && t.status !== 'unresolved') {
        fail(`component token ${t.path} has an observed raw value; it must stay flagged provisional or unresolved until reviewed`);
      }
    }
  }
}

// Inherited status: every directly flagged (provisional/unresolved) token reachable through references.
type Origin = { status: 'provisional' | 'unresolved'; path: string };
const collectOrigins = (t: Token, seen: Set<string>, out: Map<string, Origin>): void => {
  for (const r of refsOf(t)) {
    if (seen.has(r)) continue;
    seen.add(r);
    const target = tokens.get(r) as Token;
    if (target.status === 'provisional' || target.status === 'unresolved') out.set(r, { status: target.status, path: r });
    collectOrigins(target, seen, out);
  }
};
const origins = new Map<string, Origin[]>();
for (const t of tokens.values()) {
  const found = new Map<string, Origin>();
  collectOrigins(t, new Set(), found);
  if (found.size) origins.set(t.path, [...found.values()].sort((a, b) => a.path.localeCompare(b.path)));
}

const sorted = [...tokens.values()].sort(
  (a, b) => LAYERS.indexOf(a.layer) - LAYERS.indexOf(b.layer) || a.path.localeCompare(b.path, 'en', { numeric: true }),
);
const css = sorted.map((t) => ({ t, css: toCss(t) })); // validates every reference

const HEADER = 'AUTO-GENERATED by scripts/build-tokens.ts from tokens/*.json. DO NOT EDIT. Run `npm run tokens`.';

let cssOut = `/* ${HEADER} */\n:root {\n`;
let current: Layer | undefined;
for (const { t, css: value } of css) {
  if (t.layer !== current) {
    cssOut += `${current ? '\n' : ''}  /* ${t.layer} */\n`;
    current = t.layer;
  }
  cssOut += `  ${t.name}: ${value};\n`;
}
cssOut += '}\n';

const q = (s: string) => JSON.stringify(s);
const cssVarsBody = sorted.map((t) => `  ${q(t.path)}: ${q(`var(${t.name})`)},\n`).join('');
const valuesBody = sorted.map((t) => `  ${q(t.path)}: ${q(resolveValue(t))},\n`).join('');
const metaBody = sorted
  .map((t) => {
    const parts = [`layer: ${q(t.layer)}`, `cssVar: ${q(t.name)}`];
    if (t.description) parts.push(`description: ${q(t.description)}`);
    if (t.status) parts.push(`status: ${q(t.status)}`);
    if (t.source) parts.push(`source: ${q(t.source)}`);
    const inherited = origins.get(t.path);
    if (inherited) parts.push(`inheritedFrom: ${JSON.stringify(inherited)}`);
    return `  ${q(t.path)}: { ${parts.join(', ')} },\n`;
  })
  .join('');
const tsOut =
  `/* ${HEADER} */\n\n` +
  `/** CSS custom property reference for each token, keyed by dotted token path. */\n` +
  `export const cssVars = {\n${cssVarsBody}} as const;\n\n` +
  `/** Fully resolved literal value for each token, keyed by dotted token path. */\n` +
  `export const tokenValues = {\n${valuesBody}} as const;\n\n` +
  `export type TokenPath = keyof typeof cssVars;\n\n` +
  `export type TokenLayer = 'primitive' | 'semantic' | 'component';\n` +
  `export type TokenStatus = 'provisional' | 'unresolved' | 'retired';\n` +
  `export interface TokenOrigin {\n  readonly status: 'provisional' | 'unresolved';\n  readonly path: string;\n}\n` +
  `/** status is the token's own (direct) flag; inheritedFrom lists the directly flagged tokens it references, directly or not. */\n` +
  `export interface TokenMeta {\n  readonly layer: TokenLayer;\n  readonly cssVar: string;\n  readonly description?: string;\n  readonly status?: TokenStatus;\n  readonly inheritedFrom?: readonly TokenOrigin[];\n  readonly source?: 'documented' | 'observed';\n}\n\n` +
  `/** Layer, CSS variable name, notes and review status for each token. */\n` +
  `export const tokenMeta: Record<TokenPath, TokenMeta> = {\n${metaBody}};\n`;

const summary = (): string => {
  const byLayer = LAYERS.map((l) => `${l} ${sorted.filter((t) => t.layer === l).length}`).join(', ');
  const direct = (st: Status) => sorted.filter((t) => t.status === st).length;
  const inherited = (st: Status) => sorted.filter((t) => origins.get(t.path)?.some((o) => o.status === st)).length;
  const flagged = sorted.filter((t) => t.status || origins.has(t.path)).length;
  return (
    `${sorted.length} tokens (${byLayer}); ${flagged} flagged: ` +
    `direct provisional ${direct('provisional')}, inherited provisional ${inherited('provisional')}, ` +
    `direct unresolved ${direct('unresolved')}, inherited unresolved ${inherited('unresolved')}, retired ${direct('retired')}`
  );
};

const outputs: [string, string][] = [
  [cssPath, cssOut],
  [tsPath, tsOut],
];

if (args.check) {
  const stale = outputs.filter(([p, c]) => !existsSync(p) || readFileSync(p, 'utf8') !== c);
  if (stale.length) fail(`generated files are out of date: ${stale.map(([p]) => p).join(', ')}. Run \`npm run tokens\`.`);
  console.log(`build-tokens: up to date, ${summary()}`);
} else {
  for (const [p, c] of outputs) {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, c);
  }
  console.log(`build-tokens: wrote ${summary()} -> src/styles/tokens.css, src/tokens/tokens.generated.ts`);
}
