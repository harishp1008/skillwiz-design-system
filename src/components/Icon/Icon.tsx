import { iconPaths, type IconName } from './icons';
import s from './Icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  name: IconName;
  /** Small 16, medium 20 (default), large 24. */
  size?: IconSize;
  /** Accessible name. Leave out when the icon sits beside text that says the same thing: it is then hidden from screen readers. */
  label?: string;
  className?: string;
}

/** A line icon from the shared set. Colour follows the surrounding text colour. */
export function Icon({ name, size = 'md', label, className }: IconProps) {
  return (
    <svg
      className={`${s.icon} ${className ?? ''}`}
      data-size={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
