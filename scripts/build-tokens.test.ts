// Tests for scripts/build-tokens.ts. Run: npm run test:tokens
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts', 'build-tokens.ts');

type Json = Record<string, any>;
type Fixture = { primitive: Json; semantic: Json; component: Json };

const base = (): Fixture => ({
  primitive: {
    color: { blue: { '0071eb': { $value: '#0071EB', $description: 'Action blue.' } } },
    space: { 8: { $value: '8px' } },
  },
  semantic: {
    color: { action: { default: { $value: '{color.blue.0071eb}', $description: 'Primary action fill.' } } },
    space: { gap: { $value: '{space.8}' } },
  },
  component: {
    button: {
      bg: { $value: '{color.action.default}' },
      gap: { $value: '{space.gap}' },
      height: { $value: '36px', $source: 'documented' },
    },
  },
});

function run(fx: Fixture, extra: string[] = [], keep?: { dir?: string }) {
  const dir = keep?.dir ?? mkdtempSync(join(tmpdir(), 'sw-tokens-'));
  const tokens = join(dir, 'tokens');
  const out = join(dir, 'out');
  mkdirSync(tokens, { recursive: true });
  for (const [k, v] of Object.entries(fx)) writeFileSync(join(tokens, `${k}.json`), JSON.stringify(v, null, 2));
  const r = spawnSync(
    process.execPath,
    ['--disable-warning=ExperimentalWarning', script, '--tokens-dir', tokens, '--out-dir', out, ...extra],
    { encoding: 'utf8' },
  );
  return { dir, tokens, out, status: r.status, text: `${r.stdout}${r.stderr}` };
}

function rejects(fx: Fixture, pattern: RegExp) {
  const r = run(fx);
  try {
    assert.notEqual(r.status, 0, `expected failure, got success:\n${r.text}`);
    assert.match(r.text, pattern);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
}

test('baseline fixture is accepted', () => {
  const r = run(base());
  try {
    assert.equal(r.status, 0, r.text);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('hierarchy: component -> primitive reference is rejected', () => {
  const fx = base();
  fx.component.button.bg.$value = '{color.blue.0071eb}';
  rejects(fx, /primitive|layer|may not reference/i);
});

test('hierarchy: semantic -> component and primitive -> anything are rejected', () => {
  const a = base();
  a.semantic.space.gap.$value = '{button.height}';
  rejects(a, /may not reference|layer/i);
  const b = base();
  b.primitive.space['8'].$value = '{space.8}';
  rejects(b, /may not reference|layer/i);
});

test('hierarchy: semantic tokens must be references, not raw values', () => {
  const fx = base();
  fx.semantic.space.gap.$value = '8px';
  rejects(fx, /primitive references only/i);
});

test('hierarchy: semantic tokens may not mix references and literals', () => {
  const fx = base();
  fx.semantic.space.gap.$value = '{space.8} 4px';
  rejects(fx, /primitive references only/i);
});

test('component raw values need $source', () => {
  const fx = base();
  delete fx.component.button.height.$source;
  rejects(fx, /needs "\$source"/);
});

test('component $source must be documented or observed', () => {
  const fx = base();
  fx.component.button.height.$source = 'guess';
  rejects(fx, /\$source must be one of/);
});

test('observed raw values must stay flagged provisional or unresolved', () => {
  const fx = base();
  fx.component.button.height.$source = 'observed';
  rejects(fx, /observed raw value/);
  fx.component.button.height.$status = 'unresolved';
  const r = run(fx);
  try {
    assert.equal(r.status, 0, r.text);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('component tokens may not mix references and raw values', () => {
  const fx = base();
  fx.component.button.gap.$value = '{space.gap} 2px';
  rejects(fx, /mix references and raw values/);
});

test('$source is rejected on non-raw tokens', () => {
  const fx = base();
  fx.component.button.bg.$source = 'documented';
  rejects(fx, /\$source is only valid/);
});

test('unknown references are rejected', () => {
  const fx = base();
  fx.component.button.bg.$value = '{color.nope}';
  rejects(fx, /unknown|not found|does not exist/i);
});

test('descriptions: literal design measurements are rejected', () => {
  const samples = ['Fill #0071EB on hover', 'Height of 36px', 'Duration 150ms', 'Opacity 30%', 'Contrast about 2.6:1', 'Padding 14x18', 'Scale 0.96', 'Weight 700', 'rgba(0,0,0,.3)'];
  for (const text of samples) {
    const fx = base();
    fx.semantic.color.action.default.$description = text;
    rejects(fx, /literal design value/);
  }
});

test('descriptions: purpose text and token paths are allowed', () => {
  const fx = base();
  fx.semantic.color.action.default.$description = 'Near-duplicate of color.blue.e4f0fe; kept separate until reviewed.';
  const r = run(fx);
  try {
    assert.equal(r.status, 0, r.text);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('statuses: direct flags are preserved and inheritance is computed, not stored', () => {
  const fx = base();
  fx.primitive.color.blue['0071eb'].$status = 'provisional';
  const r = run(fx);
  try {
    assert.equal(r.status, 0, r.text);
    const ts = readFileSync(join(r.out, 'src/tokens/tokens.generated.ts'), 'utf8');
    assert.match(ts, /"color\.blue\.0071eb": \{[^}]*status: "provisional"/);
    assert.match(ts, /"color\.action\.default": \{[^}]*inheritedFrom: \[\{"status":"provisional","path":"color\.blue\.0071eb"\}\]/);
    assert.doesNotMatch(ts, /"color\.action\.default": \{[^}]*\bstatus: "provisional"/);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('statuses: invalid status values are rejected', () => {
  const fx = base();
  fx.primitive.space['8'].$status = 'maybe';
  rejects(fx, /status/i);
});

test('retired tokens cannot be referenced by non-retired tokens', () => {
  const fx = base();
  fx.primitive.color.blue['0071eb'].$status = 'retired';
  rejects(fx, /retired/i);
});

test('generated output is reproducible and --check passes, then catches tampering', () => {
  const r = run(base());
  try {
    assert.equal(r.status, 0, r.text);
    const css = join(r.out, 'src/styles/tokens.css');
    const ts = join(r.out, 'src/tokens/tokens.generated.ts');
    const css1 = readFileSync(css, 'utf8');
    const ts1 = readFileSync(ts, 'utf8');
    const again = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', script, '--tokens-dir', r.tokens, '--out-dir', r.out], { encoding: 'utf8' });
    assert.equal(again.status, 0);
    assert.equal(readFileSync(css, 'utf8'), css1, 'css must regenerate byte-identically');
    assert.equal(readFileSync(ts, 'utf8'), ts1, 'ts must regenerate byte-identically');
    const check = () => spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', script, '--check', '--tokens-dir', r.tokens, '--out-dir', r.out], { encoding: 'utf8' }).status;
    assert.equal(check(), 0);
    writeFileSync(css, css1.replace('#0071EB', '#000000'));
    assert.notEqual(check(), 0, 'hand-edited css must fail --check');
    writeFileSync(css, css1);
    writeFileSync(ts, ts1 + '\n// manual edit\n');
    assert.notEqual(check(), 0, 'hand-edited ts must fail --check');
    writeFileSync(ts, ts1);
    rmSync(css);
    assert.notEqual(check(), 0, 'deleted generated file must fail --check');
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('real tokens: pass validation and generated files are current', () => {
  const r = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', script, '--check'], { encoding: 'utf8', cwd: root });
  assert.equal(r.status, 0, `${r.stdout}${r.stderr}`);
});

test('real tokens: no component token references a primitive directly', () => {
  const prim = JSON.parse(readFileSync(join(root, 'tokens/primitive.json'), 'utf8'));
  const paths = new Set<string>();
  const walk = (n: Json, p: string[]) => {
    if ('$value' in n) return void paths.add(p.join('.'));
    for (const [k, v] of Object.entries(n)) if (!k.startsWith('$')) walk(v, [...p, k]);
  };
  walk(prim, []);
  const comp = readFileSync(join(root, 'tokens/component.json'), 'utf8');
  for (const m of comp.matchAll(/\{([a-z0-9.-]+)\}/g)) assert.ok(!paths.has(m[1] ?? ''), `component references primitive {${m[1]}}`);
  assert.ok(existsSync(join(root, 'tokens/component.json')));
});
