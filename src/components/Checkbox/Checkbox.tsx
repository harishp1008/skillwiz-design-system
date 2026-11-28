import { useEffect, useId, useRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import s from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange' | 'children'> {
  /** Says what is true when it is ticked: “Send results by email”, not “Email”. Leave out only when `aria-label` names the box (table rows). */
  label?: ReactNode;
  /** One line under the label for consequences or details. When the box is disabled, say why. */
  description?: ReactNode;
  /** Only some children are checked. Shows a dash and exposes aria-checked="mixed". */
  indeterminate?: boolean;
  /** Message in red under the label. Say what to do. Sets aria-invalid. */
  error?: string;
  /** M 20 for forms and settings, S 16 for table rows and menus. */
  size?: 'md' | 'sm';
  /** `card` is an option card for multi-answer questions: the whole card is the hit area. */
  variant?: 'default' | 'card';
  /** Card only: the letter before the answer, “A”. */
  marker?: string;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Documentation only: hold a state for the figures. */
  forceState?: 'hover' | 'focus';
}

export function Checkbox({
  label, description, indeterminate = false, error, size = 'md', variant = 'default', marker, onChange, forceState,
  disabled, className, id, 'aria-describedby': describedBy, ...input
}: CheckboxProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const descId = description ? `${uid}-desc` : undefined;
  const errId = error ? `${uid}-err` : undefined;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate, input.checked]);

  return (
    <div className={`${s.wrap} ${className ?? ''}`} data-size={size} data-variant={variant}>
      <label className={s.root} htmlFor={inputId} data-disabled={disabled || undefined} data-error={error ? '' : undefined} data-force={forceState}>
        <span className={s.control}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={s.input}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={[descId, errId, describedBy].filter(Boolean).join(' ') || undefined}
            onChange={(e) => onChange?.(e.target.checked, e)}
            {...input}
          />
          <span className={s.box} aria-hidden="true">
            <svg className={s.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            <svg className={s.dash} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round"><path d="M5 12h14" /></svg>
          </span>
        </span>
        {marker ? <span className={s.marker} aria-hidden="true">{marker}</span> : null}
        {label || description ? (
          <span className={s.text}>
            {label ? <span className={s.label}>{label}</span> : null}
            {description ? <span id={descId} className={s.description}>{description}</span> : null}
          </span>
        ) : null}
      </label>
      {error ? (
        <p id={errId} className={s.error}>
          <Icon name="circle-alert" size="sm" className={s.errorIcon} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface CheckboxGroupProps {
  /** The group’s name for screen readers and the visible heading, “Review status”. */
  legend: ReactNode;
  /** Small count beside the heading, “3 of 4”. */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Several independent choices under one label. A fieldset with a legend. */
export function CheckboxGroup({ legend, meta, children, className }: CheckboxGroupProps) {
  return (
    <fieldset className={`${s.group} ${className ?? ''}`}>
      <legend className={s.legend}>
        {legend}
        {meta ? <span className={s.meta}>{meta}</span> : null}
      </legend>
      <div className={s.items}>{children}</div>
    </fieldset>
  );
}
