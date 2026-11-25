import { forwardRef, useId, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'danger' | 'danger-secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'leading' | 'trailing';

interface ButtonBaseProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onClick' | 'aria-label' | 'aria-pressed' | 'aria-busy' | 'aria-disabled'> {
  /** Choose by importance, not looks. See the decision order in the Button docs. */
  variant?: ButtonVariant;
  /** Change size for the context, never for emphasis. */
  size?: ButtonSize;
  /** A decorative icon (an inline SVG using currentColor). The label carries the meaning. */
  icon?: ReactNode;
  /** Trailing is for the arrow on navigation and for menu chevrons. */
  iconPosition?: ButtonIconPosition;
  /** Toggles only. Sets aria-pressed; the label does not change, the state does. */
  pressed?: boolean | null;
  /** Spinner replaces the icon, sets aria-busy and blocks clicks. */
  loading?: boolean;
  /** Why the action is unavailable. Sets aria-disabled (never the disabled attribute), a tooltip and a description. */
  disabledReason?: string | null;
  /** Only in narrow panels, on mobile and in single-action forms. */
  fullWidth?: boolean;
  /** A running, ongoing-state action such as an active Talk: primary fill with a ring. */
  live?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  /** Navigation renders an anchor. Actions render a button. */
  href?: string;
  target?: string;
  rel?: string;
}

export interface ButtonTextProps extends ButtonBaseProps {
  /** Sentence case, starts with a verb, one to three words. */
  label: string;
  iconOnly?: false;
  ariaLabel?: undefined;
}

export interface ButtonIconOnlyProps extends ButtonBaseProps {
  /** Icon-only needs an icon, an accessible name and a matching tooltip. */
  iconOnly: true;
  icon: ReactNode;
  ariaLabel: string;
  label?: undefined;
}

export type ButtonProps = ButtonTextProps | ButtonIconOnlyProps;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'secondary',
    size = 'md',
    label,
    icon,
    iconPosition = 'leading',
    iconOnly = false,
    ariaLabel,
    pressed = null,
    loading = false,
    disabledReason = null,
    fullWidth = false,
    live = false,
    onClick,
    type = 'button',
    href,
    target,
    rel,
    className,
    title,
    ...rest
  } = props;

  const reasonId = useId();
  const unavailable = Boolean(disabledReason);
  const blocked = unavailable || loading;
  const hasTrailingIcon = Boolean(icon) && iconPosition === 'trailing' && !iconOnly;
  const hasLeadingIcon = (Boolean(icon) && !hasTrailingIcon) || (loading && !hasTrailingIcon);

  const iconNode = icon ? (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  ) : null;
  const spinner = <span className={styles.spinner} aria-hidden="true" />;

  const content = iconOnly ? (
    loading ? spinner : iconNode
  ) : (
    <>
      {hasLeadingIcon ? (loading ? spinner : iconNode) : null}
      <span className={styles.label}>{label}</span>
      {hasTrailingIcon ? (loading ? spinner : iconNode) : null}
    </>
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const common = {
    ...rest,
    className: className ? `${styles.root} ${className}` : styles.root,
    onClick: handleClick,
    title: iconOnly ? ariaLabel : unavailable ? (disabledReason ?? undefined) : title,
    'aria-label': iconOnly ? ariaLabel : undefined,
    'aria-pressed': pressed === null ? undefined : pressed,
    'aria-busy': loading || undefined,
    'aria-disabled': unavailable || undefined,
    'aria-describedby': unavailable ? reasonId : rest['aria-describedby'],
    'data-variant': variant,
    'data-size': size,
    'data-icon': iconOnly ? 'only' : hasTrailingIcon ? 'trailing' : hasLeadingIcon ? 'leading' : 'none',
    'data-live': live || undefined,
    'data-full-width': fullWidth || undefined,
  };

  const reason = unavailable ? (
    <span id={reasonId} hidden>
      {disabledReason}
    </span>
  ) : null;

  if (href !== undefined) {
    return (
      <a ref={ref as unknown as Ref<HTMLAnchorElement>} href={href} target={target} rel={rel} {...common}>
        {content}
        {reason}
      </a>
    );
  }
  return (
    <button ref={ref as unknown as Ref<HTMLButtonElement>} type={type} {...common}>
      {content}
      {reason}
    </button>
  );
});
