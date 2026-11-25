import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssVars, tokenMeta, type TokenPath } from '../src/tokens/tokens.generated';
import { Section, StatusLegend, TokenLabel, allPaths, grid, groupBy, hairline, pageStyle, pathsWhere } from './foundations';

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

/** Semantic swatch: shows the primitive token it is mapped to, with that primitive's ramp step and hex. */
function MappedSwatch({ path }: { path: TokenPath }) {
  const target = tokenMeta[path].references?.[0];
  const targetMeta = target ? tokenMeta[target] : undefined;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.8'], minWidth: 0 }}>
      <Swatch path={path} />
      {target ? (
        <div
          data-mapped-to={target}
          style={{ display: 'flex', alignItems: 'center', gap: cssVars['space.8'], fontSize: cssVars['type.caption.size'], color: cssVars['color.text.muted'] }}
        >
          <span
            aria-hidden="true"
            style={{ flex: 'none', width: cssVars['space.16'], height: cssVars['space.16'], borderRadius: cssVars['radius.control'], background: cssVars[target], border: hairline }}
          />
          <span style={{ overflowWrap: 'anywhere' }}>
            {`→ ${target}`}
            {targetMeta?.ramp ? ` (${targetMeta.ramp}-${targetMeta.scale})` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function ColourFoundations({ layer }: { layer: 'primitive' | 'semantic' }) {
  if (layer === 'primitive') return <PrimitiveColours />;
  const groups = groupBy(pathsWhere('color.', layer), 1);
  return (
    <div style={pageStyle}>
      <StatusLegend />
      {groups.map(([group, paths]) => (
        <Section key={group} title={group}>
          <div style={grid}>
            {paths.map((p) => (
              <MappedSwatch key={p} path={p} />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

/** Primitive colours: the style guide's scale (grouped by ramp, ordered by step), then any primitive colour that is not on the scale. */
function PrimitiveColours() {
  const offScale = pathsWhere('color.', 'primitive').filter((p) => !tokenMeta[p].ramp);
  const ramps = new Map<string, { path: TokenPath; step: number; scale: string }[]>();
  for (const path of allPaths) {
    const m = tokenMeta[path];
    if (m.layer !== 'primitive' || !m.ramp || !m.scale) continue;
    const list = ramps.get(m.ramp) ?? [];
    list.push({ path, step: Number(m.scale), scale: m.scale });
    ramps.set(m.ramp, list);
  }
  return (
    <div style={pageStyle}>
      <StatusLegend />
      {[...ramps].map(([ramp, steps]) => (
        <Section key={ramp} title={ramp} note="Ordered by scale step.">
          <div style={grid}>
            {steps
              .sort((a, b) => a.step - b.step)
              .map(({ path, scale }) => (
                <div key={path} style={{ display: 'flex', flexDirection: 'column', gap: cssVars['space.8'], minWidth: 0 }}>
                  <strong data-scale={`${ramp}-${scale}`}>{`${ramp}-${scale}`}</strong>
                  <Swatch path={path} />
                </div>
              ))}
          </div>
        </Section>
      ))}
      {offScale.length > 0 ? (
        <Section title="Off-scale" note="Primitive colours that are not steps on the style guide scale.">
          <div style={grid}>
            {offScale.map((p) => (
              <Swatch key={p} path={p} />
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

const meta = { title: 'Foundations/Colour', component: ColourFoundations, parameters: { layout: 'fullscreen' }, argTypes: { layer: { table: { disable: true } } } } satisfies Meta<typeof ColourFoundations>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primitive: Story = { args: { layer: 'primitive' } };
export const Semantic: Story = { args: { layer: 'semantic' } };
