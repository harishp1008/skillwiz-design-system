import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, tokenValues, type TokenPath } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, byNumericValue, hairline, pageStyle, pathsWhere } from './foundations';

const SAMPLE = 'Student risk at a glance';

/** One style from the type scale: three tokens (size, line height, weight). */
type Style = { name: string; token: string; sample: string; use: string; upper?: boolean };
const styles: Style[] = [
  { name: 'display/lg', token: 'type.display.lg', sample: 'Live Board', use: 'Empty-state hero, marketing only' },
  { name: 'display/sm', token: 'type.display.sm', sample: '176 live', use: 'Big KPI numbers' },
  { name: 'heading/h1', token: 'type.heading.h1', sample: 'Live Board', use: 'Page title' },
  { name: 'heading/h2', token: 'type.heading.h2', sample: 'Achintya Mishra', use: 'Section / drawer title' },
  { name: 'heading/h3', token: 'type.heading.h3', sample: 'Activity log', use: 'Panel title' },
  { name: 'heading/h4', token: 'type.heading.h4', sample: 'Inderjeet Kaur', use: 'Card title, student name' },
  { name: 'heading/h5', token: 'type.heading.h5', sample: 'Phone detected', use: 'List item title' },
  { name: 'body/lg', token: 'type.body.lg', sample: 'The student looked away from the screen for 4 seconds.', use: 'Long reading, dialogs' },
  { name: 'body/md', token: 'type.body.md', sample: 'Message sent to Rohit Das.', use: 'Default body, menu items' },
  { name: 'body/sm', token: 'type.body.sm', sample: 'Recorded clips are kept for 30 days.', use: 'Dense help text' },
  { name: 'label/lg', token: 'type.label.lg', sample: 'Dashboard', use: 'Large buttons, nav' },
  { name: 'label/md', token: 'type.label.md', sample: 'Open details', use: 'Buttons, tabs, chips' },
  { name: 'label/sm', token: 'type.label.sm', sample: 'Third eye', use: 'Small chips, feed labels' },
  { name: 'caption', token: 'type.caption', sample: 'ACHINTYA2026 · 12s ago', use: 'IDs, timestamps, meta' },
  { name: 'overline', token: 'type.overline', sample: 'Attempted', use: 'Section eyebrow, stat labels', upper: true },
];

const px = (p: TokenPath) => String(parseFloat(String(tokenValues[p])));
const tp = (token: string, part: 'size' | 'line-height' | 'weight') => `${token}.${part}` as TokenPath;

const rowGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(9rem, 1fr) minmax(8rem, 1fr) 4fr minmax(14rem, 2fr)',
  alignItems: 'center',
  gap: cssVars['space.24'],
  padding: `${cssVars['space.16']} ${cssVars['space.24']}`,
  borderBottom: hairline,
};
const mono: CSSProperties = { fontFamily: 'monospace', color: cssVars['color.text.heading'] };

function TypeScale() {
  return (
    <div
      style={{
        border: hairline,
        borderRadius: cssVars['radius.card'],
        background: cssVars['color.surface.default'],
        padding: cssVars['space.24'],
      }}
    >
      <div
        style={{
          marginBottom: cssVars['space.16'],
          color: cssVars['color.text.heading'],
          fontSize: cssVars['type.caption.size'],
          fontWeight: cssVars['type.label.sm.weight'],
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Type scale
      </div>
      {styles.map((st) => {
        const size = tp(st.token, 'size');
        const lh = tp(st.token, 'line-height');
        const weight = tp(st.token, 'weight');
        return (
          <div key={st.name} style={rowGrid} data-style={st.name}>
            <span style={mono}>{st.name}</span>
            <span style={{ color: cssVars['color.text.body'], fontSize: cssVars['type.body.sm.size'] }}>
              {`${px(size)} / ${px(lh)} · ${String(tokenValues[weight])}`}
            </span>
            <span
              style={{
                color: cssVars['color.text.heading'],
                fontSize: cssVars[size],
                lineHeight: cssVars[lh],
                fontWeight: cssVars[weight],
                textTransform: st.upper ? 'uppercase' : undefined,
                overflowWrap: 'anywhere',
              }}
            >
              {st.sample}
            </span>
            <span style={{ color: cssVars['color.text.body'], fontSize: cssVars['type.body.md.size'] }}>{st.use}</span>
          </div>
        );
      })}
    </div>
  );
}

function Row({ children, label }: { children: ReactNode; label: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(14rem, 1fr) 2fr', gap: cssVars['space.24'], alignItems: 'baseline' }}>
      {label}
      <div style={{ color: cssVars['color.text.heading'] }}>{children}</div>
    </div>
  );
}

function TypographyFoundations() {
  return (
    <div style={pageStyle}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.8'] }}>
        <span style={{ color: cssVars['color.text.heading'], fontSize: cssVars['type.caption.size'], fontWeight: cssVars['type.label.sm.weight'] }}>02</span>
        <h1
          style={{
            margin: 0,
            color: cssVars['color.text.heading'],
            fontSize: cssVars['type.heading.h1.size'],
            lineHeight: cssVars['type.heading.h1.line-height'],
            fontWeight: cssVars['type.heading.h1.weight'],
          }}
        >
          Typography
        </h1>
        <p style={{ margin: 0, maxWidth: '70ch', fontSize: cssVars['type.body.md.size'], lineHeight: cssVars['type.body.md.line-height'] }}>
          Karla only. 15 styles in 6 groups; each style is three tokens: /size, /line-height, /weight. Headings Bold 700, labels SemiBold 600, body Regular 400.
        </p>
      </header>

      <StatusLegend />
      <TypeScale />

      <Section title="Font family" note="Primitive.">
        {pathsWhere('font', 'primitive').map((p) => (
          <Row key={p} label={<TokenLabel path={p} />}>
            <span style={{ fontFamily: cssVars[p], fontSize: cssVars['type.display.sm.size'] }}>Aa {SAMPLE}</span>
          </Row>
        ))}
      </Section>

      <Section title="Font weights" note="Primitive weights.">
        {pathsWhere('font-weight.', 'primitive').map((p) => (
          <Row key={p} label={<TokenLabel path={p} />}>
            <span style={{ fontWeight: cssVars[p], fontSize: cssVars['type.heading.h2.size'] }}>{SAMPLE}</span>
          </Row>
        ))}
      </Section>

      <Section title="Font sizes" note="Primitive size scale.">
        {pathsWhere('font-size.', 'primitive')
          .sort((a, b) => byNumericValue(b, a))
          .map((p) => (
            <Row key={p} label={<TokenLabel path={p} />}>
              <span style={{ fontSize: cssVars[p] }}>{SAMPLE}</span>
            </Row>
          ))}
      </Section>

      <Section title="Line heights" note="Primitive line-height scale.">
        {pathsWhere('line-height.', 'primitive')
          .sort((a, b) => byNumericValue(b, a))
          .map((p) => (
            <Row key={p} label={<TokenLabel path={p} />}>
              <span style={{ display: 'inline-block', maxWidth: '24ch', lineHeight: cssVars[p], fontSize: cssVars['type.body.md.size'] }}>
                {SAMPLE}. {SAMPLE}.
              </span>
            </Row>
          ))}
      </Section>
    </div>
  );
}

const meta = { title: 'Foundations/Typography', component: TypographyFoundations, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof TypographyFoundations>;
export default meta;
export const TypeScaleStory: StoryObj<typeof meta> = { name: 'Type scale' };
