import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, type TokenPath } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, allPaths, byNumericValue, pageStyle, pathsWhere } from './foundations';

const SAMPLE = 'Student risk at a glance';

function Row({ children, label }: { children: ReactNode; label: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(14rem, 1fr) 2fr', gap: cssVars['space.24'], alignItems: 'baseline' }}>
      {label}
      <div style={{ color: cssVars['color.text.heading'] }}>{children}</div>
    </div>
  );
}

function TypographyFoundations() {
  const roles = [...new Set(pathsWhere('type.', 'semantic').map((p) => p.split('.')[1] ?? ''))];
  return (
    <div style={pageStyle}>
      <StatusLegend />
      <Section title="Font family">
        {pathsWhere('font', 'primitive').map((p) => (
          <Row key={p} label={<TokenLabel path={p} />}>
            <span style={{ fontFamily: cssVars[p], fontSize: cssVars['font-size.32'] }}>Aa {SAMPLE}</span>
          </Row>
        ))}
      </Section>

      <Section title="Font weights" note="Primitive weights. Line-heights are not defined in the style guide, so none are shown.">
        {pathsWhere('font-weight.', 'primitive').map((p) => (
          <Row key={p} label={<TokenLabel path={p} />}>
            <span style={{ fontWeight: cssVars[p], fontSize: cssVars['font-size.24'] }}>{SAMPLE}</span>
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

      <Section title="Type roles" note="Semantic roles combine a size and a weight.">
        {roles.flatMap((role) => {
          const sizePath = `type.${role}.size` as TokenPath;
          if (!allPaths.includes(sizePath)) return [];
          return pathsWhere(`type.${role}.weight`, 'semantic').map((w) => (
            <Row
              key={w}
              label={
                <div style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.8'] }}>
                  <TokenLabel path={sizePath} />
                  <TokenLabel path={w} />
                </div>
              }
            >
              <span style={{ fontSize: cssVars[sizePath], fontWeight: cssVars[w] }}>{SAMPLE}</span>
            </Row>
          ));
        })}
      </Section>
    </div>
  );
}

const meta = { title: 'Foundations/Typography', component: TypographyFoundations, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof TypographyFoundations>;
export default meta;
export const TypeScale: StoryObj<typeof meta> = {};
