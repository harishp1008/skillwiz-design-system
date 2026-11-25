import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopNav, type TopNavProps } from './TopNav';
import { TopNavGuidelines } from './docs/TopNavGuidelines';

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'course', label: 'Course' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'classroom', label: 'Classroom' },
  { id: 'live-board', label: 'Live Board' },
  { id: 'content', label: 'Content' },
  { id: 'question-bank', label: 'Question Bank' },
];
const contexts = [
  { id: 'lpu-class', label: 'LPU_Class' },
  { id: 'lpu-batch-b', label: 'LPU_Batch_B' },
  { id: 'all', label: 'All classes' },
];

const meta = {
  title: 'Components/Top navigation bar',
  component: TopNav,
  args: {
    items,
    currentId: 'live-board',
    contexts,
    contextId: 'lpu-class',
    contextKind: 'Class',
    mail: { count: 3 },
    messages: { count: 3 },
    notifications: { count: 3 },
    initials: 'AN',
    maxVisible: 5,
  },
  argTypes: {
    items: { control: false },
    contexts: { control: false },
    forceState: { control: false },
    onNavigate: { control: false },
    onContextChange: { control: false },
    onAccountAction: { control: false },
    mode: { control: 'inline-radio', options: [undefined, 'wide', 'medium', 'narrow'] },
    currentId: { control: 'select', options: items.map((i) => i.id) },
  },
} satisfies Meta<typeof TopNav>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Top navigation bar page: anatomy, variants, states, widths, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <TopNavGuidelines />,
};

function Live(args: TopNavProps) {
  const [current, setCurrent] = useState(args.currentId);
  const [ctx, setCtx] = useState(args.contextId);
  return (
    <div style={{ width: '100%', minHeight: 360 }}>
      <TopNav {...args} currentId={current} contextId={ctx} onNavigate={setCurrent} onContextChange={setCtx} />
    </div>
  );
}

/** One live bar with controls. Resize the canvas to see items move into More and the drawer. */
export const Playground: Story = {
  parameters: { layout: 'centered' }, // addon panel visible, component centred
  decorators: [(Story) => <div style={{ width: 'min(1200px, 92vw)' }}><Story /></div>],
  render: (args) => <Live {...args} />,
};
