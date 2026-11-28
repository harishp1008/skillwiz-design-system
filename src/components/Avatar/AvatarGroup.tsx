import { Avatar, type AvatarProps } from './Avatar';
import s from './Avatar.module.css';

export interface AvatarGroupProps {
  people: Pick<AvatarProps, 'name' | 'userId' | 'src'>[];
  /** Group stacks are 32 or 40 across the product. */
  size?: 'sm' | 'md';
  /** Most avatars shown before “+N”. Default 4. */
  max?: number;
  className?: string;
}

/** Up to four avatars overlapping by 8, left-most on top, then a grey “+N”. The group has one name. */
export function AvatarGroup({ people, size = 'sm', max = 4, className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const names = shown.map((p) => p.name ?? 'Unnamed');
  const label = rest > 0 ? `${names.join(', ')} and ${rest} more` : names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : (names[0] ?? '');
  return (
    <span className={`${s.group} ${className ?? ''}`} data-size={size} role="img" aria-label={label}>
      {shown.map((p, i) => (
        <span key={i} className={s.groupItem} style={{ zIndex: shown.length - i }}>
          <Avatar {...p} size={size} decorative />
        </span>
      ))}
      {rest > 0 ? (
        <span className={s.more} data-size={size} aria-hidden="true">+{rest}</span>
      ) : null}
    </span>
  );
}
