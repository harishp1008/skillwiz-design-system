import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, CheckboxGroup, type CheckboxProps } from './Checkbox';
import { CheckboxGuidelines } from './docs/CheckboxGuidelines';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Send results by email', description: '', error: '', size: 'md', variant: 'default', disabled: false, indeterminate: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    variant: { control: 'inline-radio', options: ['default', 'card'] },
    onChange: { control: false },
    forceState: { control: false },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Checkbox page: anatomy, variants, states, sizes, choosing a control, behaviour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <CheckboxGuidelines />,
};

function Controlled(args: CheckboxProps) {
  const [on, setOn] = useState(false);
  return <Checkbox {...args} checked={on} onChange={setOn} />;
}
/** One checkbox with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args: CheckboxProps) => <div style={{ width: 360 }}><Controlled {...args} /></div>,
};

function GroupDemo() {
  const items = ['To Review', 'Flagged', 'Cleared', 'No Review'];
  const [on, setOn] = useState<string[]>(['To Review', 'Flagged']);
  const all = on.length === items.length;
  return (
    <CheckboxGroup legend="Review status" meta={`${on.length} of ${items.length}`}>
      <Checkbox label="Select all" checked={all} indeterminate={on.length > 0 && !all} onChange={(c) => setOn(c ? items : [])} />
      <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((i) => <Checkbox key={i} label={i} checked={on.includes(i)} onChange={(c) => setOn(c ? [...on, i] : on.filter((x) => x !== i))} />)}
      </div>
    </CheckboxGroup>
  );
}
/** A group with select all: the parent shows a dash when only some are checked. */
export const GroupWithSelectAll: Story = {
  name: 'Group with select all',
  parameters: { layout: 'centered' },
  render: () => <div style={{ width: 320 }}><GroupDemo /></div>,
};

function CardsDemo() {
  const [on, setOn] = useState<string[]>(['A']);
  return (
    <div style={{ width: 360 }}>
      <CheckboxGroup legend="Select all that apply">
        {[['A', 'A stack is LIFO'], ['B', 'A queue is LIFO'], ['C', 'Both can be built on an array']].map(([k, t]) => (
          <Checkbox key={k} variant="card" marker={k} label={t} checked={on.includes(k as string)} onChange={(c) => setOn(c ? [...on, k as string] : on.filter((x) => x !== k))} />
        ))}
      </CheckboxGroup>
    </div>
  );
}
/** Option cards for a multi-answer exam question. */
export const OptionCards: Story = {
  name: 'Option cards',
  parameters: { layout: 'centered' },
  render: () => <CardsDemo />,
};
