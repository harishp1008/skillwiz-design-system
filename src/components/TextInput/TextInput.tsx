import { useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import s from './TextInput.module.css';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'prefix'> {
  /** Always visible, above the field. A short noun phrase in sentence case. Leave out only for search fields that carry `aria-label`. */
  label?: ReactNode;
  /** Mark the few optional fields. Required is the default, so there is no star. */
  optional?: boolean;
  /** One line under the field. An error replaces it in the same spot. */
  helper?: ReactNode;
  /** Says how to fix it, “User IDs are 9 characters, like VK3456789”. Sets aria-invalid. */
  error?: string;
  /** S 28 toolbars and filters, M 36 default, L 44 sign-in and the student exam. */
  size?: 'sm' | 'md' | 'lg';
  /** Only when it says what the field is for: search, mail, lock. */
  leadingIcon?: IconName;
  /** Units after the value, “min”, “%”, “marks”, so people type only the number. */
  suffix?: ReactNode;
  /** Shows a clear button once there is a value. Clearing keeps focus in the field. */
  clearable?: boolean;
  /** Trim spaces from the ends on blur. For IDs and emails. */
  trim?: boolean;
  /** Called with the new value. Clearing and trimming call it without an event. */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  /** Documentation only: hold a state for the figures. */
  forceState?: 'hover' | 'focus';
}

export function TextInput({
  label, optional, helper, error, size = 'md', leadingIcon, suffix, clearable, trim, onChange, forceState,
  type = 'text', value, defaultValue, disabled, readOnly, id, className, onBlur, 'aria-describedby': describedBy, ...input
}: TextInputProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const helpId = `${uid}-help`;
  const ref = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const [shown, setShown] = useState(false);
  const current = value !== undefined ? String(value) : inner;
  const set = (v: string, e?: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(v);
    onChange?.(v, e);
  };
  const isPassword = type === 'password';
  const showClear = clearable && current !== '' && !disabled && !readOnly;
  const message = error || helper;

  return (
    <div className={`${s.field} ${className ?? ''}`} data-size={size}>
      {label ? (
        <label className={s.label} htmlFor={inputId}>
          {label}
          {optional ? <span className={s.optional}> (optional)</span> : null}
        </label>
      ) : null}
      <div className={s.box} data-error={error ? '' : undefined} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-force={forceState}>
        {leadingIcon ? <Icon name={leadingIcon} size="sm" className={s.icon} /> : null}
        <input
          ref={ref}
          id={inputId}
          className={s.input}
          type={isPassword && shown ? 'text' : type}
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={[message ? helpId : undefined, describedBy].filter(Boolean).join(' ') || undefined}
          onChange={(e) => set(e.target.value, e)}
          onBlur={(e) => {
            const t = e.target.value.trim();
            if (trim && t !== e.target.value) set(t);
            onBlur?.(e);
          }}
          {...input}
        />
        {suffix ? <span className={s.suffix}>{suffix}</span> : null}
        {showClear ? (
          <button type="button" className={s.action} aria-label="Clear" onClick={() => { set(''); ref.current?.focus(); }}>
            <Icon name="x" size="sm" />
          </button>
        ) : null}
        {isPassword && !disabled ? (
          <button type="button" className={s.action} aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown} onClick={() => setShown(!shown)}>
            <Icon name={shown ? 'eye-off' : 'eye'} size="sm" />
          </button>
        ) : null}
      </div>
      {/* The live region is always present so the error is announced once when it appears. */}
      <p id={helpId} className={s.help} data-error={error ? '' : undefined} aria-live="polite">
        {message ? (
          <>
            {error ? <Icon name="circle-alert" size="sm" className={s.errorIcon} /> : null}
            {message}
          </>
        ) : null}
      </p>
    </div>
  );
}
