import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle, type ToggleProps } from './Toggle';
import { ToggleGuidelines } from './docs/ToggleGuidelines';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { label: 'Reduce motion', description: '', size: 'md', layout: 'inline', showState: false, saving: false, disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    layout: { control: 'inline-radio', options: ['inline', 'row'] },
    onChange: { control: false },
    forceState: { control: false },
  },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Toggle page: anatomy, variants, states, sizes, choosing a control, behaviour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <ToggleGuidelines />,
};

function Controlled(args: ToggleProps) {
  const [on, setOn] = useState(false);
  return <Toggle {...args} checked={on} onChange={setOn} />;
}
/** One switch with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args: ToggleProps) => <div style={{ width: 360 }}><Controlled {...args} /></div>,
};

/** A settings list: label and description left, On / Off and the switch right. */
export const SettingsList: Story = {
  name: 'Settings list',
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle layout="row" showState label="Reading spacing" description="Wider line, letter and word spacing" />
      <Toggle layout="row" showState label="Reduce motion" description="Stops press and hover animations" defaultChecked />
      <Toggle layout="row" showState label="Sound alert at 5 and 1 min left" description="Plays once, also announced to screen readers" defaultChecked />
    </div>
  ),
};
