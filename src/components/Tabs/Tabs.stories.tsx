import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs, type TabItem, type TabsProps } from './Tabs';
import { TabsGuidelines } from './docs/TabsGuidelines';

const body = (t: string) => <p style={{ margin: 0, fontFamily: 'var(--sw-font-family-base)' }}>{t} content.</p>;
const items: TabItem[] = [
  { id: 'overview', label: 'Overview', panel: body('Overview') },
  { id: 'answers', label: 'Answers', count: 24, panel: body('Answers') },
  { id: 'flags', label: 'Flags', count: 3, alert: true, panel: body('Flags') },
  { id: 'notes', label: 'Notes', panel: body('Notes') },
  { id: 'logs', label: 'Logs', disabled: true, disabledReason: 'No logs yet', panel: body('Logs') },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { label: 'Student activity', items, variant: 'underline', size: 'lg', activation: 'auto' },
  argTypes: {
    items: { control: false },
    value: { control: false },
    onValueChange: { control: false },
    forceState: { control: false },
    hidePanels: { control: false },
    variant: { control: 'inline-radio', options: ['underline', 'card', 'vertical', 'pill'] },
    size: { control: 'inline-radio', options: ['lg', 'sm'] },
    activation: { control: 'inline-radio', options: ['auto', 'manual'] },
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Tabs page: anatomy, variants, states, sizes, usage, behaviour, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <TabsGuidelines />,
};

/** One tab list with live controls. */
export const Playground: Story = {
  parameters: { layout: 'padded' },
  render: (args) => <div style={{ maxWidth: 560 }}><Tabs {...args} /></div>,
};

const pillItems: TabItem[] = ['All', 'Live', 'Upcoming', 'Ended'].map((l) => ({ id: l.toLowerCase(), label: l, panel: body(l) }));
/** Pill tabs filter one list. */
export const PillPlayground: Story = {
  name: 'Pill playground',
  args: { variant: 'pill', items: pillItems, label: 'Assessment status' },
  render: (args) => <div style={{ maxWidth: 560 }}><Tabs {...args} /></div>,
};

const cardItems: TabItem[] = [
  { id: 'a', label: 'Aptitude', count: 20, panel: body('Aptitude') },
  { id: 'v', label: 'Verbal', count: 15, panel: body('Verbal') },
  { id: 'c', label: 'Coding', count: 2, panel: body('Coding') },
];
/** Card tabs with a count each. */
export const CardPlayground: Story = {
  name: 'Card playground',
  args: { variant: 'card', items: cardItems, label: 'Sections' },
  render: (args) => <div style={{ maxWidth: 560 }}><Tabs {...args} /></div>,
};

const listItems: TabItem[] = [
  { id: 'mid', label: 'Midterm', description: '42 students', status: { label: 'Passed', tone: 'success' }, panel: body('Midterm') },
  { id: 'quiz', label: 'Quiz 3', description: '40 students', status: { label: 'Failed', tone: 'danger' }, panel: body('Quiz') },
  { id: 'lab', label: 'Lab', description: '42 students', status: { label: 'Pending' }, panel: body('Lab') },
];
/** Vertical list tabs sit beside the detail. */
export const VerticalPlayground: Story = {
  name: 'Vertical playground',
  args: { variant: 'vertical', items: listItems, label: 'Results' },
  render: (args: TabsProps) => <div style={{ maxWidth: 720 }}><Tabs {...args} /></div>,
};

function ControlledDemo() {
  const [v, setV] = useState('answers');
  return (
    <div style={{ maxWidth: 560, fontFamily: 'var(--sw-font-family-base)' }}>
      <Tabs label="Controlled" items={items} value={v} onValueChange={setV} />
      <p>Selected: {v}</p>
    </div>
  );
}
/** Controlled from outside. */
export const Controlled: Story = { render: () => <ControlledDemo /> };
