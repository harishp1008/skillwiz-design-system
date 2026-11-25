import { createContext, useContext, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { truncateLabel } from '../shared/truncate';
import { labelIcons } from '../shared/labelIcons';
import s from './Chip.module.css';

export const CHIP_MAX_LENGTH = 28;

type GroupCtx = {
  mode: 'single' | 'multi';
  size: 'md' | 'sm';
  has: (value: string) => boolean;
  toggle: (value: string) => void;
};
const Ctx = createContext<GroupCtx | null>(null);

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onToggle'> {
  label: string;
  /** Result count shown in a small pill. A count of 0 stays visible: a filter with no results stays enabled. */
  count?: number;
  /** Identifies the chip inside a ChipGroup. */
  value?: string;
  /** On or off, when used on its own (outside a ChipGroup). */
  selected?: boolean;
  size?: 'md' | 'sm';
  /** Standalone toggle callback; inside a ChipGroup use the group’s onValueChange. */
  onToggle?: (next: boolean) => void;
  /** Disable only when the filter cannot apply yet (for example while loading). */
  disabled?: boolean;
  /** Documentation only: draws a state without needing the pointer or keyboard. */
  forceState?: 'hover' | 'focus' | 'pressed';
}

/** A filter chip: an interactive, fully round control that toggles a view. Shape alone says “you can press this”. */
export function Chip({ label, count, value, selected, size, onToggle, disabled, forceState, className, onClick, onKeyDown, ...rest }: ChipProps) {
  const group = useContext(Ctx);
  const sz = size ?? group?.size ?? 'md';
  const on = group && value !== undefined ? group.has(value) : !!selected;
  const single = group?.mode === 'single';
  const { shown, cut } = truncateLabel(label, CHIP_MAX_LENGTH);

  const aria = single
    ? { role: 'radio' as const, 'aria-checked': on, tabIndex: on ? 0 : -1 }
    : { 'aria-pressed': on };

  return (
    <button
      type="button"
      {...rest}
      {...aria}
      className={[s.root, className].filter(Boolean).join(' ')}
      data-size={sz}
      data-on={on || undefined}
      data-affix={on || count !== undefined ? '' : undefined}
      data-force={forceState}
      disabled={disabled}
      aria-label={count !== undefined ? `${label}, ${count}` : cut ? label : undefined}
      title={cut ? label : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (group && value !== undefined) group.toggle(value);
        else onToggle?.(!on);
      }}
      onKeyDown={onKeyDown}
    >
      {on ? <span className={s.check}>{labelIcons.check}</span> : null}
      <span className={s.label}>{shown}</span>
      {count !== undefined ? (
        <span className={s.count} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export type ChipGroupProps =
  | { mode: 'single'; value: string; onValueChange: (value: string) => void; size?: 'md' | 'sm'; label: string; children: ReactNode; className?: string }
  | { mode: 'multi'; value: string[]; onValueChange: (value: string[]) => void; size?: 'md' | 'sm'; label: string; children: ReactNode; className?: string };

/** A set of chips. Single select is a radiogroup that always has one on; multi select is a set of toggle buttons where none means no filter. */
export function ChipGroup(props: ChipGroupProps) {
  const { mode, size = 'md', label, children, className } = props;
  const ref = useRef<HTMLDivElement>(null);

  const ctx: GroupCtx = {
    mode,
    size,
    has: (v) => (props.mode === 'single' ? props.value === v : props.value.includes(v)),
    toggle: (v) => {
      if (props.mode === 'single') props.onValueChange(v);
      else props.onValueChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    },
  };

  // Single select: arrow keys move inside the set and select, like a radio group.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== 'single') return;
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    const radios = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? []);
    const i = radios.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next = radios[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : radios.length - 1)) % radios.length];
    next?.focus();
    next?.click();
  };

  return (
    <Ctx.Provider value={ctx}>
      <div
        ref={ref}
        className={[s.group, className].filter(Boolean).join(' ')}
        role={mode === 'single' ? 'radiogroup' : 'group'}
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface InputChipProps {
  label: string;
  /** Initials in a small circle, for people. */
  initials?: string;
  onRemove: () => void;
  className?: string;
}

/** A chosen item in a field: the chip is text; the × is its own button. Backspace in the empty field removes the last chip (the field handles that). */
export function InputChip({ label, initials, onRemove, className }: InputChipProps) {
  return (
    <span className={[s.input, className].filter(Boolean).join(' ')}>
      {initials ? (
        <span className={s.avatar} aria-hidden="true">
          {initials}
        </span>
      ) : null}
      <span className={s.label}>{label}</span>
      <button type="button" className={s.remove} aria-label={`Remove ${label}`} onClick={onRemove}>
        <span className={s.removeIcon}>{labelIcons.close}</span>
      </button>
    </span>
  );
}
