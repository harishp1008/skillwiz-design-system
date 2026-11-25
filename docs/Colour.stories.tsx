import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, type TokenPath } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, grid, groupBy, hairline, pageStyle, pathsWhere } from './foundations';

function Swatch({ path }: { path: TokenPath }) {
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: cssVars['space.8'], minWidth: 0 }}>
      <div
        style={{
          height: cssVars['space.64'],
          borderRadius: cssVars['radius.control'],
          background: cssVars[path],
          border: hairline,
        }}
      />
      <TokenLabel path={path} />
    </figure>
  );
}

function ColourFoundations({ layer }: { layer: 'primitive' | 'semantic' }) {
  const groups = groupBy(pathsWhere('color.', layer), 1);
  return (
    <div style={pageStyle}>
      <StatusLegend />
      {groups.map(([group, paths]) => (
        <Section key={group} title={group}>
          <div style={grid}>
            {paths.map((p) => (
              <Swatch key={p} path={p} />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

const meta = { title: 'Foundations/Colour', component: ColourFoundations, parameters: { layout: 'fullscreen' }, argTypes: { layer: { table: { disable: true } } } } satisfies Meta<typeof ColourFoundations>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primitive: Story = { args: { layer: 'primitive' } };
export const Semantic: Story = { args: { layer: 'semantic' } };
