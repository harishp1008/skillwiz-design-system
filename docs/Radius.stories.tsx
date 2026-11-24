import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, type TokenPath } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, byNumericValue, grid, hairlineWidth, pageStyle, pathsWhere } from './foundations';

function Box({ path }: { path: TokenPath }) {
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: cssVars['space.8'], minWidth: 0 }}>
      <div
        style={{
          width: cssVars['space.64'],
          height: cssVars['space.64'],
          borderRadius: cssVars[path],
          background: cssVars['color.action.tint'],
          border: `${hairlineWidth} solid ${cssVars['color.action.default']}`,
        }}
      />
      <TokenLabel path={path} />
    </figure>
  );
}

function RadiusFoundations() {
  return (
    <div style={pageStyle}>
      <StatusLegend />
      <Section title="Primitive radius">
        <div style={grid}>
          {pathsWhere('radius.', 'primitive').sort(byNumericValue).map((p) => (
            <Box key={p} path={p} />
          ))}
        </div>
      </Section>
      <Section title="Semantic radius" note="The question strip cell radius is documented and rendered at different values; see the unresolved question-strip tokens below in the Tokens story.">
        <div style={grid}>
          {pathsWhere('radius.', 'semantic').map((p) => (
            <Box key={p} path={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}

const meta = { title: 'Foundations/Border radius', component: RadiusFoundations, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof RadiusFoundations>;
export default meta;
export const Radius: StoryObj<typeof meta> = {};
