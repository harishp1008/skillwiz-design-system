import { useCallback, useId, useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import s from './Textarea.module.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'rows' | 'maxLength'> {
  /** Always visible, above the field. The composer uses `aria-label` instead. */
  label?: ReactNode;
  /** Mark the few optional fields. Required is the default, so there is no star. */
  optional?: boolean;
  /** Who reads it or what to include. An error replaces it in the same spot. */
  helper?: ReactNode;
  /** Says what to write or how to fix it. Sets aria-invalid. */
  error?: string;
  /** Character limit. The text is kept past it: the count turns red and submit explains. Never a hard maxlength. */
  limit?: number;
  /** Force the count on or off. By default it shows from the start for limits of 200 or less, and from 80% for longer ones. */
  showCount?: boolean;
  /** `composer`: one line (44px) growing to six, send button inside, Enter sends and Shift + Enter breaks the line. */
  variant?: 'default' | 'composer';
  /** Composer only: called with the trimmed message when Enter or the send button is used. */
  onSend?: (message: string) => void;
  /** Composer only: why the send button is disabled while empty. */
  sendHint?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Documentation only: hold a state for the figures. */
  forceState?: 'hover' | 'focus';
}

export function Textarea({
  label, optional, helper, error, limit, showCount, variant = 'default', onSend, sendHint = 'Write a message to send', onChange, forceState,
  value, defaultValue, disabled, readOnly, id, className, 'aria-describedby': describedBy, 'aria-label': ariaLabel, ...input
}: TextareaProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const helpId = `${uid}-help`;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const [announce, setAnnounce] = useState('');
  const composer = variant === 'composer';
  const current = value !== undefined ? String(value) : inner;

  /** Grow with the text, between the minimum and maximum height, then scroll inside. */
  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const cs = getComputedStyle(el);
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const max = parseFloat(cs.maxHeight);
    const next = el.scrollHeight + border;
    el.style.height = `${Number.isFinite(max) ? Math.min(next, max) : next}px`;
    el.style.overflowY = Number.isFinite(max) && next > max ? 'auto' : 'hidden';
  }, []);
  useLayoutEffect(fit, [current, fit]);

  const set = (v: string, e?: ChangeEvent<HTMLTextAreaElement>) => {
    if (limit !== undefined) {
      const before = limit - current.length;
      const left = limit - v.length;
      // Announce once when 20 are left and when the limit is reached or passed, not on every key.
      if (left <= 20 && left > 0 && before > 20) setAnnounce(`${left} characters left`);
      else if (left <= 0 && before > 0) setAnnounce(left === 0 ? 'Character limit reached' : `${-left} characters over the limit`);
      else if (left > 20) setAnnounce('');
    }
    if (value === undefined) setInner(v);
    if (e) onChange?.(v, e);
  };
  const send = () => {
    const msg = current.trim();
    if (!msg || disabled || readOnly) return;
    onSend?.(msg);
    if (value === undefined) setInner('');
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    input.onKeyDown?.(e);
    if (composer && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const count = current.length;
  const over = limit !== undefined && count > limit;
  const countShown = limit !== undefined && (showCount ?? (limit <= 200 || count >= limit * 0.8));
  const message = error || helper;

  return (
    <div className={`${s.field} ${className ?? ''}`} data-variant={variant}>
      {label ? (
        <label className={s.label} htmlFor={inputId}>
          {label}
          {optional ? <span className={s.optional}> (optional)</span> : null}
        </label>
      ) : null}
      <div className={s.wrap}>
        <textarea
          {...input}
          ref={ref}
          id={inputId}
          className={s.input}
          rows={1}
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={[message ? helpId : undefined, describedBy].filter(Boolean).join(' ') || undefined}
          data-error={error ? '' : undefined}
          data-force={forceState}
          onKeyDown={onKeyDown}
          onChange={(e) => set(e.target.value, e)}
        />
        {composer ? (
          <button type="button" className={s.send} aria-label="Send message" disabled={!current.trim() || disabled || readOnly} title={!current.trim() ? sendHint : undefined} onClick={send}>
            <Icon name="send" size="md" />
          </button>
        ) : null}
      </div>
      {message || countShown ? (
        <div className={s.foot}>
          <p id={helpId} className={s.help} data-error={error ? '' : undefined} aria-live="polite">
            {message ? (
              <>
                {error ? <Icon name="circle-alert" size="sm" className={s.errorIcon} /> : null}
                {message}
              </>
            ) : null}
          </p>
          {countShown ? <span className={s.count} data-over={over || undefined} aria-hidden="true">{count} / {limit}</span> : null}
        </div>
      ) : null}
      <span className={s.sr} role="status" aria-live="polite">{announce}</span>
    </div>
  );
}
