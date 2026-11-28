import { useState, type CSSProperties } from 'react';
import { Icon } from '../Icon';
import { initialsOf } from './initials';
import { toneArt, toneFor, type AvatarTone } from './tones';
import s from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'active' | 'idle' | 'reconnecting' | 'offline';

export interface AvatarProps {
  /** The person's full name. Drives the initials and the accessible name. */
  name?: string;
  /** Picks the tone (sum of character codes mod 8), so a person keeps their colour on every screen. */
  userId?: string;
  /** Photo URL. Shows over the initials once it loads; the initials stay if it fails. */
  src?: string;
  /** 24, 32, 40 (default), 56, 80 or 120. Art from 40 up, flat tone fill at 32 and below. */
  size?: AvatarSize;
  /** Presence, proctor screens only. */
  status?: AvatarStatus;
  /** Spoken with the name, e.g. “Idle 2 min”. */
  statusLabel?: string;
  /** Offline or not joined: grey fill, grey initials, photo in greyscale, no art. */
  muted?: boolean;
  /** Set when the name is written beside the avatar (tables, cards): the avatar is then hidden from screen readers. */
  decorative?: boolean;
  /** Makes the avatar a button, e.g. the account menu. Needs `buttonLabel`. */
  onClick?: () => void;
  buttonLabel?: string;
  /** Documentation only: force one tone. Real screens pass `userId`. */
  tone?: AvatarTone;
  className?: string;
  style?: CSSProperties;
}

export function Avatar({ name, userId, src, size = 'md', status, statusLabel, muted, decorative, onClick, buttonLabel, tone, className, style }: AvatarProps) {
  /* Keyed by the URL, so a new photo starts again and a cached image that loads before mount is not reset. */
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>();
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const loaded = Boolean(src) && loadedSrc === src;
  const failed = Boolean(src) && failedSrc === src;

  const initials = initialsOf(name);
  const t = tone ?? toneFor(userId);
  const hasName = initials !== '';
  const showArt = !muted && hasName && size !== 'xs' && size !== 'sm';
  const showPhoto = Boolean(src) && !failed;
  const full = [name?.trim() || 'No name set', statusLabel].filter(Boolean).join(', ');

  const body = (
    <>
      <span className={s.circle} data-tone={hasName && !muted ? t : undefined} data-muted={muted || !hasName ? '' : undefined}>
        {showArt ? <img className={s.art} src={toneArt[t]} alt="" draggable={false} /> : null}
        {hasName ? <span className={s.initials} aria-hidden="true">{initials}</span> : <Icon name="user" className={s.userIcon} />}
        {showPhoto ? (
          <img
            className={s.photo}
            data-loaded={loaded || undefined}
            data-muted={muted || undefined}
            ref={(el) => { if (el?.complete && el.naturalWidth > 0 && loadedSrc !== src) setLoadedSrc(src); }}
            src={src}
            alt=""
            draggable={false}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
          />
        ) : null}
        {showPhoto ? <span className={s.outline} data-loaded={loaded || undefined} aria-hidden="true" /> : null}
      </span>
      {status ? <span className={s.dot} data-status={status} aria-hidden="true" /> : null}
    </>
  );

  const common = { className: `${s.avatar} ${className ?? ''}`, 'data-size': size, style } as const;
  if (onClick) {
    return <button type="button" {...common} onClick={onClick} aria-label={buttonLabel ?? full}>{body}</button>;
  }
  return decorative ? (
    <span {...common} aria-hidden="true">{body}</span>
  ) : (
    <span {...common} role="img" aria-label={full}>{body}</span>
  );
}
