import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';
import { TextInputGuidelines } from './docs/TextInputGuidelines';

const meta = {
  title: 'Components/Text input',
  component: TextInput,
  args: { label: 'Student ID', placeholder: 'e.g. VK3456789', helper: '', error: '', suffix: '', size: 'md', optional: false, clearable: false, disabled: false, readOnly: false, trim: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    leadingIcon: { control: 'select', options: [undefined, 'search', 'mail', 'lock', 'user'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'tel'] },
    onChange: { control: false },
    forceState: { control: false },
  },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Text input page: anatomy, variants, states, sizes, behaviour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <TextInputGuidelines />,
};

/** One field with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args) => <div style={{ width: 320 }}><TextInput {...args} /></div>,
};

/** Search: leading icon, clear once filled, no visible label. */
export const Search: Story = {
  parameters: { layout: 'centered' },
  render: () => <div style={{ width: 320 }}><TextInput aria-label="Search students" leadingIcon="search" placeholder="Search students" clearable /></div>,
};

/** Password with the Show button. */
export const Password: Story = {
  parameters: { layout: 'centered' },
  render: () => <div style={{ width: 320 }}><TextInput size="lg" label="Password" type="password" leadingIcon="lock" autoComplete="current-password" /></div>,
};
