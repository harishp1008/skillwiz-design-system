import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { ButtonGuidelines } from './docs/ButtonGuidelines';
import { icons } from './docs/icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'Review', variant: 'secondary', size: 'md' },
  argTypes: {
    icon: { control: false },
    onClick: { control: false },
    variant: { control: 'select', options: ['primary', 'secondary', 'accent', 'ghost', 'link', 'danger', 'danger-secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconPosition: { control: 'inline-radio', options: ['leading', 'trailing'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Buttons page: anatomy, variants, states, sizes, icons, usage, placement, labels, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <ButtonGuidelines />,
};

/** One button with live controls. */
export const Playground: Story = {
  parameters: { layout: 'centered' }, // addon panel visible, component centred
  args: { icon: icons.message },
};
