import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { TextareaGuidelines } from './docs/TextareaGuidelines';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { label: 'Describe the issue', placeholder: 'e.g. Question 6 won’t load', helper: 'Our team reads every report.', error: '', optional: false, disabled: false, readOnly: false, variant: 'default', limit: 500 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'composer'] },
    onChange: { control: false },
    onSend: { control: false },
    forceState: { control: false },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Textarea page: anatomy, variants, states, growth, behaviour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <TextareaGuidelines />,
};

/** One field with live controls. Type past 500 to see the count turn red. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args) => <div style={{ width: 360 }}><Textarea {...args} /></div>,
};

/** Message composer: one line growing to six, send button inside. */
export const Composer: Story = {
  parameters: { layout: 'centered' },
  render: () => <div style={{ width: 360 }}><Textarea variant="composer" aria-label="Message to Achintya" placeholder="Write a message to Achintya…" helper="Enter to send · Shift + Enter for a new line" onSend={(m) => window.alert(m)} /></div>,
};
