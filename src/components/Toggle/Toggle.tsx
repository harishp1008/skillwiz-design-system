import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import s from './Toggle.module.css';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange' | 'children' | 'role'> {
  /** Names the setting, not the action: “Reduce motion”, not “Turn on reduced motion”. Stays the same in both states. */
  label?: ReactNode;
  /** One line under the label. When disabled, say why: “Set by your admin”. */
  description?: ReactNode;
  /** M 36 × 20 for settings and panels, S 28 × 16 inline next to 28px controls. */
  size?: 'md' | 'sm';
  /** `inline`: switch first, label after. `row`: label left, switch right, for settings lists. */
  layout?: 'inline' | 'row';
  /** Shows “On” / “Off” beside the switch (row layout). */
  showState?: boolean;
  /** Waiting for the server to confirm. Shows a spinner in the thumb and sets aria-busy. */
  saving?: boolean;
  /** Called with the new state. If saving fails, set `checked` back and show a toast with Retry. */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Documentation only: hold a state for the figures. */
  forceState?: 'hover' | 'focus';
}

export function Toggle({
  label, description, size = 'md', layout = 'inline', showState, saving, onChange, forceState,
  checked, defaultChecked, disabled, className, id, 'aria-describedby': describedBy, ...input
}: ToggleProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const descId = description ? `${uid}-desc` : undefined;
  const [inner, setInner] = useState(Boolean(defaultChecked));
  const on = checked !== undefined ? checked : inner;
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Space flips a checkbox natively; Enter does too here, without submitting the form.
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  const text = label || description ? (
    <span className={s.text}>
      {label ? <span className={s.label}>{label}</span> : null}
      {description ? <span id={descId} className={s.description}>{description}</span> : null}
    </span>
  ) : null;

  const control = (
    <span className={s.control}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        className={s.input}
        checked={on}
        disabled={disabled}
        aria-checked={on}
        aria-busy={saving || undefined}
        aria-describedby={[descId, describedBy].filter(Boolean).join(' ') || undefined}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          if (checked === undefined) setInner(e.target.checked);
          onChange?.(e.target.checked, e);
        }}
        {...input}
      />
      <span className={s.track} aria-hidden="true">
        <span className={s.thumb}>{saving ? <span className={s.spinner} /> : null}</span>
      </span>
    </span>
  );
  const state = showState ? <span className={s.state} aria-hidden="true">{on ? 'On' : 'Off'}</span> : null;

  return (
    <label className={`${s.root} ${className ?? ''}`} htmlFor={inputId} data-size={size} data-layout={layout} data-disabled={disabled || undefined} data-force={forceState}>
      {layout === 'row' ? (
        <>
          {text}
          {state}
          {control}
        </>
      ) : (
        <>
          {control}
          {text}
          {state}
        </>
      )}
    </label>
  );
}
