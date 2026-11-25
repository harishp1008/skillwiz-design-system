import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge, CountBadge, type BadgeProps, type CountBadgeProps } from '../Badge';
import { Tag, type TagProps } from '../Tag';
import { Chip, ChipGroup, InputChip, type ChipProps } from '../Chip';
import { labelIcons } from '../shared/labelIcons';
import { ChipTagBadgeGuidelines } from './docs/ChipTagBadgeGuidelines';

const meta = {
  title: 'Components/Chip, tag & badge',
  parameters: { layout: 'centered' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Chip, tag & badge page: which one, anatomy, badge, tag, chip, in context, usage, accessibility and tokens. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <ChipTagBadgeGuidelines />,
};

type BadgeArgs = BadgeProps & { withIcon: boolean };
/** One badge with live controls. */
export const BadgePlayground: StoryObj<BadgeArgs> = {
  name: 'Badge playground',
  args: { children: 'Looking away ×9', tone: 'warning', emphasis: 'subtle', size: 'md', withIcon: true },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    emphasis: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    icon: { control: false },
    className: { control: false },
    children: { control: 'text', name: 'label' },
  },
  render: ({ withIcon, ...args }) => <Badge {...args} icon={withIcon ? labelIcons.alert : undefined} />,
};

/** The round count that sits on an icon or next to a label. Hidden at 0, “99+” above 99. */
export const CountBadgePlayground: StoryObj<CountBadgeProps> = {
  name: 'Count badge playground',
  args: { count: 3, tone: 'danger', placement: 'icon' },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 150 } },
    tone: { control: 'inline-radio', options: ['danger', 'neutral', 'info'] },
    placement: { control: 'inline-radio', options: ['icon', 'label'] },
    className: { control: false },
  },
  render: (args) => <CountBadge {...args} />,
};

type TagArgs = TagProps & { withIcon: boolean };
/** One tag with live controls. */
export const TagPlayground: StoryObj<TagArgs> = {
  name: 'Tag playground',
  args: { children: 'Webcam', size: 'md', withIcon: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    icon: { control: false },
    className: { control: false },
    children: { control: 'text', name: 'label' },
  },
  render: ({ withIcon, ...args }) => <Tag {...args} icon={withIcon ? labelIcons.video : undefined} />,
};

/** One filter chip with live controls. The state buttons are for the docs; real chips use the pointer and keyboard. */
export const ChipPlayground: StoryObj<ChipProps> = {
  name: 'Chip playground',
  args: { label: 'Flagged', count: 3, size: 'md', selected: false, disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    count: { control: { type: 'number', min: 0 } },
    forceState: { control: 'inline-radio', options: [undefined, 'hover', 'focus', 'pressed'] },
    onToggle: { control: false },
    onClick: { control: false },
  },
  render: function Render(args) {
    const [on, setOn] = useState(!!args.selected);
    return <Chip {...args} selected={args.selected || on} onToggle={setOn} />;
  },
};

/** A set of chips. Single select always has one on; multi select can have none. */
export const ChipGroupPlayground: StoryObj<{ mode: 'single' | 'multi'; size: 'md' | 'sm' }> = {
  name: 'Chip group playground',
  args: { mode: 'single', size: 'md' },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'multi'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
  render: function Render({ mode, size }) {
    const [one, setOne] = useState('all');
    const [many, setMany] = useState<string[]>([]);
    const chips = (
      <>
        <Chip value="all" label="All" count={9} />
        <Chip value="replies" label="Replies pending" count={6} />
        <Chip value="flagged" label="Flagged" count={3} />
      </>
    );
    return mode === 'single' ? (
      <ChipGroup key="s" mode="single" label="Filter conversations" value={one} onValueChange={setOne} size={size}>{chips}</ChipGroup>
    ) : (
      <ChipGroup key="m" mode="multi" label="Filter conversations" value={many} onValueChange={setMany} size={size}>{chips}</ChipGroup>
    );
  },
};

/** Chosen items in a field: the × removes one. */
export const InputChipPlayground: StoryObj = {
  name: 'Input chip playground',
  render: function Render() {
    const [people, setPeople] = useState(['Aarav Nair', 'Riya Kapoor', 'Meera Das']);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sw-space-8)', width: 420, padding: 'var(--sw-space-8)', border: '1px solid var(--sw-color-border-control)', borderRadius: 'var(--sw-radius-control)' }}>
        {people.map((p) => (
          <InputChip key={p} label={p} initials={p.split(' ').map((w) => w[0]).join('')} onRemove={() => setPeople(people.filter((x) => x !== p))} />
        ))}
      </div>
    );
  },
};
