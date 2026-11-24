// Shared documentation chrome for the foundation stories. Every visual value comes from the generated tokens.
import type { CSSProperties, ReactNode } from 'react';
import {
  cssVars,
  tokenMeta,
  tokenValues,
  type TokenLayer,
  type TokenPath,
} from '../src/tokens/tokens.generated';

export const allPaths = Object.keys(cssVars) as TokenPath[];

export const hairlineWidth = '1px';
export const hairline = `${hairlineWidth} solid ${cssVars['color.border.strong']}`;

export const pathsWhere = (prefix: string, layer: TokenLayer): TokenPath[] =>
  allPaths.filter((p) => p.startsWith(prefix) && tokenMeta[p].layer === layer);

export const resolved = (p: TokenPath): string => String(tokenValues[p]);

export const groupBy = (paths: TokenPath[], segment: number): [string, TokenPath[]][] => {
  const groups = new Map<string, TokenPath[]>();
  for (const p of paths) {
    const key = p.split('.')[segment] ?? '';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups.entries()];
};

export const byNumericValue = (a: TokenPath, b: TokenPath): number => parseFloat(resolved(a)) - parseFloat(resolved(b));

export const pageStyle: CSSProperties = {
  fontFamily: cssVars['font.family.base'],
  fontSize: cssVars['type.body.size'],
  fontWeight: cssVars['type.body.weight'],
  color: cssVars['color.text.body'],
  display: 'flex',
  flexDirection: 'column',
  gap: cssVars['space.32'],
  padding: cssVars['space.24'],
};

type Tone = 'provisional' | 'unresolved' | 'retired';
const tones: Record<Tone, { bg: TokenPath; fg: TokenPath }> = {
  provisional: { bg: 'color.risk.watch.tint', fg: 'color.risk.watch.text' },
  unresolved: { bg: 'color.risk.high.tint', fg: 'color.risk.high.text' },
  retired: { bg: 'color.status.offline.bg', fg: 'color.status.offline.text' },
};

const captionStyle: CSSProperties = { color: cssVars['color.text.muted'], fontSize: cssVars['type.caption.size'] };

/** Filled badge = the token's own (direct) flag. Dashed outline = inherited from a token it references. */
function Badge(props: { tone: Tone; inherited: boolean; title: string; flag: string; forPath: string }) {
  const c = tones[props.tone];
  return (
    <span
      title={props.title}
      data-flag={props.flag}
      data-flag-for={props.forPath}
      style={{
        alignSelf: 'flex-start',
        background: props.inherited ? cssVars['color.surface.default'] : cssVars[c.bg],
        color: cssVars[c.fg],
        border: `${hairlineWidth} ${props.inherited ? 'dashed' : 'solid'} ${cssVars[c.fg]}`,
        borderRadius: cssVars['radius.chip'],
        padding: `${cssVars['space.4']} ${cssVars['space.8']}`,
        fontSize: cssVars['type.chip-label.size'],
        fontWeight: cssVars['type.chip-label.weight'],
      }}
    >
      {props.inherited ? `inherited ${props.tone}` : props.tone}
    </span>
  );
}

const MEANING: Record<Tone, string> = {
  provisional: 'The value appears in the style guide but is not part of its documented palette or scale. Needs review.',
  unresolved: 'Style guide sources conflict. A design decision is needed; none has been made.',
  retired: 'Documented as no longer in use. Kept for traceability; nothing may reference it.',
};

export function TokenFlags({ path }: { path: TokenPath }) {
  const m = tokenMeta[path];
  const origins = m.inheritedFrom ?? [];
  const inheritedTones = (['unresolved', 'provisional'] as const).filter((t) => origins.some((o) => o.status === t));
  if (!m.status && inheritedTones.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.4'] }}>
      {m.status ? <Badge tone={m.status} inherited={false} title={MEANING[m.status]} flag={`direct-${m.status}`} forPath={path} /> : null}
      {inheritedTones.map((t) => {
        const from = origins.filter((o) => o.status === t).map((o) => o.path);
        return (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.4'] }}>
            <Badge tone={t} inherited title={`Inherits ${t} from ${from.join(', ')}`} flag={`inherited-${t}`} forPath={path} />
            <span style={captionStyle}>from {from.join(', ')}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StatusLegend() {
  const rows: { tone: Tone; inherited: boolean; text: string }[] = [
    { tone: 'provisional', inherited: false, text: `Direct. ${MEANING.provisional}` },
    { tone: 'unresolved', inherited: false, text: `Direct. ${MEANING.unresolved}` },
    { tone: 'retired', inherited: false, text: MEANING.retired },
    { tone: 'provisional', inherited: true, text: 'Inherited. The token references a provisional token. Resolve the origin shown under the badge to clear it.' },
    { tone: 'unresolved', inherited: true, text: 'Inherited. The token references an unresolved token. Resolve the origin shown under the badge to clear it.' },
  ];
  return (
    <Section title="Token status legend" note="Filled badge: the token's own flag. Dashed badge: inherited from a token it references. No badge: nothing open.">
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: `${cssVars['space.8']} ${cssVars['space.16']}`, alignItems: 'start' }}>
        {rows.map((r) => (
          <div key={`${r.tone}-${r.inherited}`} style={{ display: 'contents' }}>
            <Badge tone={r.tone} inherited={r.inherited} title={r.text} flag={`legend-${r.inherited ? 'inherited-' : 'direct-'}${r.tone}`} forPath="legend" />
            <span>{r.text}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function TokenLabel({ path }: { path: TokenPath }) {
  const meta = tokenMeta[path];
  return (
    <div data-token={path} style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.4'], minWidth: 0 }}>
      <span style={{ fontWeight: cssVars['type.name.weight'], color: cssVars['color.text.heading'], overflowWrap: 'anywhere' }}>
        {path}
      </span>
      <span style={{ color: cssVars['color.text.muted'], fontSize: cssVars['type.caption.size'], overflowWrap: 'anywhere' }}>
        {resolved(path)}
      </span>
      <TokenFlags path={path} />
      {meta.description ? (
        <span style={{ color: cssVars['color.text.muted'], fontSize: cssVars['type.caption.size'] }}>{meta.description}</span>
      ) : null}
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.16'] }}>
      <h2
        style={{
          margin: 0,
          fontSize: cssVars['type.panel-title.size'],
          fontWeight: cssVars['type.panel-title.weight'],
          color: cssVars['color.text.heading'],
        }}
      >
        {title}
      </h2>
      {note ? <p style={{ margin: 0, color: cssVars['color.text.muted'] }}>{note}</p> : null}
      {children}
    </section>
  );
}

export const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
  gap: cssVars['space.24'],
};

