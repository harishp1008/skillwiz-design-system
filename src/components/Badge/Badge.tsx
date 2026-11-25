import type { ReactNode } from 'react';
import { truncateLabel } from '../shared/truncate';
import s from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export const BADGE_MAX_LENGTH = 24;

export interface BadgeProps {
  /** Meaning: neutral, info, success, warning or danger. Always carried by words too, never colour alone. */
  tone?: BadgeTone;
  /** Subtle by default. Solid only for the one thing on a card that must be seen first. */
  emphasis?: 'subtle' | 'solid';
  size?: 'md' | 'sm';
  /** Leading icon. Decorative: the label carries the meaning. */
  icon?: ReactNode;
  /** Write the number inside the words: “4 passed”, “Looking away ×9”. */
  children: string;
  className?: string;
}

/** A read-only label that shows a state, a score or a number. Not interactive: no role, no tab stop, no hover. */
export function Badge({ tone = 'neutral', emphasis = 'subtle', size = 'md', icon, children, className }: BadgeProps) {
  const { shown, cut } = truncateLabel(children, BADGE_MAX_LENGTH);
  return (
    <span className={[s.root, className].filter(Boolean).join(' ')} data-tone={tone} data-emphasis={emphasis} data-size={size} title={cut ? children : undefined}>
      {icon ? <span className={s.icon}>{icon}</span> : null}
      <span aria-hidden={cut || undefined}>{shown}</span>
      {cut ? <span className={s.sr}>{children}</span> : null}
    </span>
  );
}
