import type { ReactNode } from 'react';

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  /** What people read and what the trigger shows. Sentence case. */
  label: string;
  /** One short line when the label alone is not enough: counts, dates. */
  description?: string;
  /** Unavailable options stay visible. Say why in `disabledReason`. */
  disabled?: boolean;
  disabledReason?: string;
  /** Group header. The headers show only when there are two or more groups. */
  group?: string;
}

export interface SelectAction {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export type MenuEntry =
  | {
      type?: 'item';
      id: string;
      label: string;
      icon?: ReactNode;
      /** Shown at the end, e.g. "⌘D". Display only. */
      shortcut?: string;
      /** Red, always last, after a divider. It opens a confirm dialog; it never acts directly. */
      destructive?: boolean;
      disabled?: boolean;
      /** Why the item is unavailable. Becomes its tooltip. */
      disabledReason?: string;
      /** One level only. */
      items?: Omit<Extract<MenuEntry, { type?: 'item' }>, 'items'>[];
      onSelect?: () => void;
    }
  | { type: 'divider' };
