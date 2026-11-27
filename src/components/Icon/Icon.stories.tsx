import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Icon, type IconProps } from './Icon';
import { iconNames } from './icons';
import { IconGuidelines } from './docs/IconGuidelines';

const meta = {
  title: 'Icons/Icon set',
  component: Icon,
  args: { name: 'book-open', size: 'md' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Icon set page: anatomy, every icon, sizes, colour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <IconGuidelines />,
};

/** One icon with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args: IconProps) => <Icon {...args} />,
};

function GalleryDemo({ size }: { size?: IconProps['size'] }) {
  const [q, setQ] = useState('');
  const shown = iconNames.filter((n) => n.includes(q.trim().toLowerCase()));
  return (
    <div style={{ fontFamily: 'var(--sw-font-family-base)', width: 640 }}>
      <input aria-label="Search icons" placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', height: 'var(--sw-size-control-md)', marginBottom: 'var(--sw-space-16)', padding: '0 var(--sw-space-12)', border: '1px solid var(--sw-color-border-control)', borderRadius: 'var(--sw-radius-control)', font: 'inherit' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--sw-space-12)' }}>
        {shown.map((n) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sw-space-8)', padding: 'var(--sw-space-16)', border: '1px solid var(--sw-color-border-default)', borderRadius: 'var(--sw-radius-card)', color: 'var(--sw-color-text-heading)' }}>
            <Icon name={n} size={size} />
            <code style={{ fontSize: 'var(--sw-type-caption-size)', color: 'var(--sw-color-text-muted)' }}>{n}</code>
          </div>
        ))}
        {shown.length === 0 ? <p>No icons match.</p> : null}
      </div>
    </div>
  );
}
/** Every icon, searchable. */
export const Gallery: Story = {
  parameters: { layout: 'centered' },
  render: (args: IconProps) => <GalleryDemo size={args.size} />,
};
