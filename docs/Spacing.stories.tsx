import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, byNumericValue, pageStyle, pathsWhere } from './foundations';

function SpacingFoundations() {
  return (
    <div style={pageStyle}>
      <StatusLegend />
      <Section title="Spacing scale" note="Primitive spacing. Provisional entries are documented values that are not on the scale.">
        {pathsWhere('space.', 'primitive')
          .sort(byNumericValue)
          .map((p) => (
            <div key={p} style={{ display: 'grid', gridTemplateColumns: 'minmax(14rem, 1fr) 2fr', gap: cssVars['space.24'], alignItems: 'center' }}>
              <TokenLabel path={p} />
              <div style={{ width: cssVars[p], height: cssVars['space.16'], background: cssVars['color.action.default'], borderRadius: cssVars['radius.chip'] }} />
            </div>
          ))}
      </Section>
      <Section title="Spacing roles" note="Semantic spacing.">
        {pathsWhere('space.', 'semantic').map((p) => (
          <div key={p} style={{ display: 'grid', gridTemplateColumns: 'minmax(14rem, 1fr) 2fr', gap: cssVars['space.24'], alignItems: 'center' }}>
            <TokenLabel path={p} />
            <div style={{ width: cssVars[p], height: cssVars['space.16'], background: cssVars['color.brand.indigo'], borderRadius: cssVars['radius.chip'] }} />
          </div>
        ))}
      </Section>
    </div>
  );
}

const meta = { title: 'Foundations/Spacing', component: SpacingFoundations, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof SpacingFoundations>;
export default meta;
export const Scale: StoryObj<typeof meta> = {};
