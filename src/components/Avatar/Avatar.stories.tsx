import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, type AvatarProps } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarGuidelines } from './docs/AvatarGuidelines';
import { tones } from './tones';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Aarav Nair', userId: 'AARAV2026', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    status: { control: 'inline-radio', options: [undefined, 'active', 'idle', 'reconnecting', 'offline'] },
    tone: { control: 'select', options: [undefined, ...tones] },
    onClick: { control: false },
    style: { control: false },
  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Avatar page: anatomy, tones, types, sizes, initials, status, groups, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <AvatarGuidelines />,
};

/** One avatar with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  args: { status: undefined, muted: false },
  render: (args: AvatarProps) => <Avatar {...args} />,
};

/** The same ID always gives the same tone. */
export const EightTones: Story = {
  name: 'Eight tones',
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {tones.map((t) => <Avatar key={t} name="Aarav Nair" tone={t} size="lg" />)}
    </div>
  ),
};

/** A stack of people: four, then +N. */
export const Group: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <AvatarGroup
      size="sm"
      people={['Aarav Nair', 'Riya Kapoor', 'Meera Shah', 'Rohit Das', 'Inderjeet Singh', 'Nisha Kumar', 'Kabir Rao'].map((name) => ({ name, userId: name }))}
    />
  ),
};
