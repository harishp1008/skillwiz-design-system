import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select, type SelectProps } from './Select';
import { Menu } from './Menu';
import { dropdownIcons as ic } from './icons';
import type { MenuEntry, SelectOption } from './types';
import { DropdownGuidelines } from './docs/DropdownGuidelines';

const options: SelectOption[] = [
  { value: 'all', label: 'All classrooms', group: 'Your classrooms' },
  { value: 'lpu-class', label: 'LPU_Class', group: 'Your classrooms' },
  { value: 'lpu', label: 'LPU_', description: '200 students', group: 'Your classrooms' },
  { value: 'lpu-b', label: 'LPU_Batch_B', description: '42 students', group: 'Your classrooms' },
  { value: 'arch', label: 'LPU_Archived', description: 'Ended 2025', disabled: true, disabledReason: 'This class has ended', group: 'Archived' },
];
const entries: MenuEntry[] = [
  { id: 'message', label: 'Message student', icon: ic.message },
  { id: 'csv', label: 'Download CSV', icon: ic.download, shortcut: '⌘D' },
  { id: 'dup', label: 'Duplicate assessment', icon: ic.copy },
  { id: 'export', label: 'Export', icon: ic.download, items: [{ id: 'pdf', label: 'PDF report' }, { id: 'xlsx', label: 'Excel (.xlsx)' }] },
  { type: 'divider' },
  { id: 'delete', label: 'Delete assessment', icon: ic.trash, destructive: true },
];

const meta = {
  title: 'Components/Select, dropdown & menu',
  component: Select,
  args: { label: 'Classroom', options, value: 'lpu-class', size: 'md' },
  argTypes: {
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    action: { control: false },
    leadingIcon: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    open: { control: false },
    staticPanel: { control: false },
    forceState: { control: false },
    forceActive: { control: false },
    defaultQuery: { control: false },
    multiple: { control: false },
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The full Select, dropdown & menu page: anatomy, variants, states, behaviour, usage, accessibility, tokens and the code spec. */
export const Guidelines: Story = {
  tags: ['guidelines'], // hides the addon panel (see .storybook/manager.ts)
  parameters: { layout: 'fullscreen' },
  render: () => <DropdownGuidelines />,
};

function Controlled(args: SelectProps) {
  const [v, setV] = useState<string | null>(typeof args.value === 'string' ? args.value : null);
  return (
    <div style={{ width: 320, minHeight: 360 }}>
      <Select {...(args as SelectProps & { multiple?: false })} multiple={false} value={v} onChange={setV} action={{ label: 'Manage classrooms', icon: ic.plus, onSelect: () => undefined }} />
    </div>
  );
}
/** One select with live controls. */
export const SelectPlayground: Story = {
  name: 'Select playground',
  parameters: { layout: 'centered' },
  args: { placeholder: 'Select…', disabled: false, loading: false, helper: '', error: '' },
  render: (args) => <Controlled {...args} />,
};

function MultiDemo({ size, disabled }: { size?: 'sm' | 'md' | 'lg'; disabled?: boolean }) {
  const [v, setV] = useState<string[]>(['to-review', 'flagged']);
  const opts: SelectOption[] = ['To review', 'Flagged', 'Cleared', 'No review'].map((l) => ({ value: l.toLowerCase().replace(' ', '-'), label: l }));
  return (
    <div style={{ width: 320, minHeight: 360 }}>
      <Select multiple label="Review status" size={size} disabled={disabled} options={opts} value={v} onChange={setV} />
    </div>
  );
}
/** Multi-select with live controls. */
export const MultiSelectPlayground: Story = {
  name: 'Multi-select playground',
  parameters: { layout: 'centered' },
  render: (args) => <MultiDemo size={args.size} disabled={args.disabled} />,
};

function SearchDemo({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const [v, setV] = useState<string | null>(null);
  const people: SelectOption[] = [
    { value: 'a', label: 'Achintya Sharma', description: 'VK3456789 · LPU_Class' },
    { value: 'b', label: 'Achal Verma', description: 'VK3456712 · LPU_Batch_B' },
    { value: 'c', label: 'Riya Kapoor', description: 'VK3456750 · LPU_Class' },
    { value: 'd', label: 'Aarav Nair', description: 'VK3456701 · LPU_Batch_B' },
  ];
  return (
    <div style={{ width: 320, minHeight: 360 }}>
      <Select searchable label="Student" size={size} options={people} value={v} onChange={setV} searchPlaceholder="Search by name or ID" countNoun="students" totalCount={120} />
    </div>
  );
}
/** Searchable select with live controls. */
export const SearchablePlayground: Story = {
  name: 'Searchable select playground',
  parameters: { layout: 'centered' },
  render: (args) => <SearchDemo size={args.size} />,
};

/** Action menu. Open it with the mouse or the keyboard. */
export const MenuPlayground: Story = {
  name: 'Menu playground',
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ minHeight: 320, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Menu label="Actions" entries={entries} />
      <Menu iconLabel="More actions for Achintya Sharma" entries={entries} align="end" />
    </div>
  ),
};
