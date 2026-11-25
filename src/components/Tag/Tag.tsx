import type { ReactNode } from 'react';
import { truncateLabel } from '../shared/truncate';
import s from './Tag.module.css';

export const TAG_MAX_LENGTH = 20;

export interface TagProps {
  size?: 'md' | 'sm';
  /** Leading icon for categories with a well-known icon (camera sources). Decorative. */
  icon?: ReactNode;
  children: string;
  className?: string;
}

/** Says what something is: question type, difficulty, subject, camera source. Always neutral and outlined. Never colour by value, never interactive. */
export function Tag({ size = 'md', icon, children, className }: TagProps) {
  const { shown, cut } = truncateLabel(children, TAG_MAX_LENGTH);
  return (
    <span className={[s.root, className].filter(Boolean).join(' ')} data-size={size} title={cut ? children : undefined}>
      {icon ? <span className={s.icon}>{icon}</span> : null}
      <span aria-hidden={cut || undefined}>{shown}</span>
      {cut ? <span className={s.sr}>{children}</span> : null}
    </span>
  );
}
