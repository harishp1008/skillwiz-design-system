import s from './CountBadge.module.css';

export type CountBadgeTone = 'danger' | 'neutral' | 'info';

export interface CountBadgeProps {
  count: number;
  /** Red for unread on an icon, grey next to a label or tab. Blue is the top navigation bar as drawn. */
  tone?: CountBadgeTone;
  /** `icon`: 18px with a white ring, sits on an icon. `label`: 20px, sits next to a label or tab. */
  placement?: 'icon' | 'label';
  className?: string;
}

/** Round, number only. Hidden at 0 and “99+” above 99. Not read on its own: put the count in the button’s accessible name (“Messages, 3 unread”). */
export function CountBadge({ count, tone = 'danger', placement = 'icon', className }: CountBadgeProps) {
  if (!count || count < 1) return null;
  return (
    <span className={[s.root, className].filter(Boolean).join(' ')} data-tone={tone} data-placement={placement} aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  );
}
