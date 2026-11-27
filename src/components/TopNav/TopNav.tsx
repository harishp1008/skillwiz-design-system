import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { navIcons } from './icons';
import s from './TopNav.module.css';

/** Layout breakpoints from the spec. Media queries cannot read CSS variables, so they live here. */
export const TOP_NAV_BREAKPOINTS = { wide: 1440, medium: 1024 } as const;
export type TopNavMode = 'wide' | 'medium' | 'narrow';

export interface TopNavItem {
  id: string;
  label: string;
  href?: string;
}
export interface TopNavContext {
  id: string;
  label: string;
}
export interface TopNavUtility {
  /** Unread count. 0 or undefined shows no badge. */
  count?: number;
}
export interface TopNavAccountItem {
  id: string;
  label: string;
}

/** The SkillWiz mark: an inline SVG so a college can swap it for its own. Colours come from the logo tokens. */
export function SkillWizLogo() {
  return (
    <svg viewBox="0 0 75 24" role="img" aria-hidden="true" focusable="false" className={s.logoSvg}>
      <text x="0" y="18" textLength="75" lengthAdjust="spacingAndGlyphs">
        <tspan className={s.logoSkill}>Skill</tspan>
        <tspan className={s.logoWiz}>Wiz</tspan>
      </text>
    </svg>
  );
}

export interface TopNavProps {
  /** Top-level sections for the signed-in role, in order. */
  items: TopNavItem[];
  /** The one section the page belongs to. */
  currentId: string;
  /** Where the wordmark links to. Defaults to the first item's href. */
  logoHref?: string;
  /**
   * The logo, as an inline `<svg>` (or `<img>`). Omit for the SkillWiz mark. A college passes its own
   * to replace it; it is drawn at the wordmark's line height with automatic width, so use a horizontal
   * logo with a viewBox and no fixed size.
   */
  logo?: ReactNode;
  /** Name of the organisation the logo shows. Used in the link's accessible name. Default "SkillWiz". */
  logoLabel?: string;
  /** Location or class options. Omit (or pass one or none) for a single scope: the selector is hidden. */
  contexts?: TopNavContext[];
  /** The selected option. */
  contextId?: string;
  /** What the selector scopes the page to, e.g. "Class" or "Location". Used as its caption and accessible name. */
  contextKind?: string;
  onContextChange?: (id: string) => void;
  /** Utilities. Pass `false` to drop one (Proctor has no Mail). */
  mail?: TopNavUtility | false;
  messages?: TopNavUtility | false;
  notifications?: TopNavUtility | false;
  /** Initials of the signed-in user. */
  initials: string;
  accountItems?: TopNavAccountItem[];
  onAccountAction?: (id: string) => void;
  onNavigate?: (id: string) => void;
  /** Items in the row at the widest layout. The spec says up to 7. */
  maxVisible?: number;
  /** Force the sticky shadow (otherwise it follows page scroll). */
  scrolled?: boolean;
  /** Force a layout instead of measuring the bar's own width. Docs use this. */
  mode?: TopNavMode;
  /** Documentation only: hold one item in a state. */
  forceState?: { id: string; state: 'hover' | 'focus' | 'pressed' };
  /** Documentation only: show every item and skip the fit calculation (no More). */
  showAllItems?: boolean;
  /** Documentation only: start with a menu open. */
  defaultOpen?: 'more' | 'context' | 'account' | 'drawer';
  /** The id of the page's <main>, which the skip link jumps to. */
  skipTargetId?: string;
  className?: string;
}

const defaultAccount: TopNavAccountItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'switch-role', label: 'Switch role' },
  { id: 'help', label: 'Help' },
  { id: 'sign-out', label: 'Sign out' },
];

const badgeText = (n: number) => (n > 99 ? '99+' : String(n));

/** Closes on outside click and Escape; returns focus to the trigger. */
function useMenu(initial = false) {
  const [open, setOpen] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onArrow = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const els = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"], [role="option"]') ?? []);
      if (!els.length) return;
      e.preventDefault();
      const i = els.indexOf(document.activeElement as HTMLElement);
      els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus();
    };
    document.addEventListener('keydown', onArrow);
    const onDown = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector<HTMLElement>('[data-trigger]')?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    if (!initial) ref.current?.querySelector<HTMLElement>('[role="menuitem"], [role="option"]')?.focus();
    return () => {
      document.removeEventListener('keydown', onArrow);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

/** Rough width of a nav item, used to decide how many fit. Label text is bold 16px. */
const estimateItemWidth = (label: string) => label.length * 8.5 + 16 + 12;

export function TopNav({
  items,
  currentId,
  logoHref,
  logo,
  logoLabel = 'SkillWiz',
  contexts,
  contextId,
  contextKind = 'Class',
  onContextChange,
  mail,
  messages,
  notifications,
  initials,
  accountItems = defaultAccount,
  onAccountAction,
  onNavigate,
  maxVisible = 7,
  scrolled,
  mode: forcedMode,
  forceState,
  defaultOpen,
  showAllItems,
  skipTargetId = 'main',
  className,
}: TopNavProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number>(TOP_NAV_BREAKPOINTS.wide);
  const [pageScrolled, setPageScrolled] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width || TOP_NAV_BREAKPOINTS.wide);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const on = () => setPageScrolled(window.scrollY > 0);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const mode: TopNavMode = forcedMode ?? (width >= TOP_NAV_BREAKPOINTS.wide ? 'wide' : width >= TOP_NAV_BREAKPOINTS.medium ? 'medium' : 'narrow');

  const showContext = (contexts?.length ?? 0) > 1;
  const current = contexts?.find((c) => c.id === contextId) ?? contexts?.[0];

  const utilityList = [
    messages !== false && messages !== undefined ? ({ key: 'messages', name: 'Messages', icon: navIcons.message, u: messages } as const) : null,
    notifications !== false && notifications !== undefined ? ({ key: 'notifications', name: 'Notifications', icon: navIcons.bell, u: notifications } as const) : null,
    mode === 'wide' && mail !== false && mail !== undefined ? ({ key: 'mail', name: 'Mail', icon: navIcons.mail, u: mail } as const) : null,
  ].filter(Boolean) as { key: string; name: string; icon: ReactNode; u: TopNavUtility }[];
  const mailInMenu = mode !== 'wide' && mail !== false && mail !== undefined ? mail : null;

  /* How many items fit in the row. Current page is always visible. */
  const padX = mode === 'wide' ? 32 : mode === 'medium' ? 24 : 16;
  let visible = items;
  let overflow: TopNavItem[] = [];
  if (mode !== 'narrow' && !showAllItems) {
    const cap = mode === 'wide' ? maxVisible : items.length;
    const reserved = 2 * padX + 75 + 48 + (showContext ? 200 + 20 : 0) + utilityList.length * 52 + 60;
    const room = width - reserved;
    let used = 0;
    let n = 0;
    for (const it of items) {
      used += estimateItemWidth(it.label);
      if (used > room - 92 && n < items.length) break; // keep space for More
      n += 1;
    }
    if (n >= items.length && items.length <= cap) {
      visible = items;
    } else {
      n = Math.max(1, Math.min(n, cap));
      visible = items.slice(0, n);
      if (!visible.some((i) => i.id === currentId)) {
        const cur = items.find((i) => i.id === currentId);
        if (cur) visible = [...visible.slice(0, Math.max(0, n - 1)), cur];
      }
      overflow = items.filter((i) => !visible.some((v) => v.id === i.id));
    }
  }

  const more = useMenu(defaultOpen === 'more');
  const ctx = useMenu(defaultOpen === 'context');
  const account = useMenu(defaultOpen === 'account');
  const drawer = useMenu(defaultOpen === 'drawer');

  const go = (it: TopNavItem) => (e: MouseEvent) => {
    // Without a real href there is nowhere to go, so the click is swallowed (Storybook, prototypes).
    if (onNavigate || !it.href) e.preventDefault();
    onNavigate?.(it.id);
    more.setOpen(false);
    drawer.setOpen(false);
  };
  const home = logoHref ?? items[0]?.href ?? '#';

  return (
    <header
      ref={rootRef}
      className={`${s.root} ${className ?? ''}`}
      data-mode={mode}
      data-scrolled={scrolled ?? pageScrolled ? 'true' : undefined}
    >
      <a className={s.skip} href={`#${skipTargetId}`}>Skip to content</a>
      <nav className={s.bar} aria-label="Main">
        {mode === 'narrow' ? (
          <div className={s.menuWrap} ref={drawer.ref}>
            <button
              type="button"
              className={s.iconBtn}
              data-trigger
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawer.open}
              onClick={() => drawer.setOpen(!drawer.open)}
            >
              {navIcons.menu}
            </button>
            {drawer.open ? (
              <div className={s.drawer} role="dialog" aria-label="Main menu">
                <ul className={s.menuList}>
                  {items.map((it) => (
                    <li key={it.id}>
                      <a
                        role="menuitem"
                        className={s.menuItem}
                        href={it.href ?? '#'}
                        aria-current={it.id === currentId ? 'page' : undefined}
                        onClick={go(it)}
                      >
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <a className={s.logo} href={home} aria-label={`${logoLabel}, go to Dashboard`}>
          {logo ?? <SkillWizLogo />}
        </a>

        {mode !== 'narrow' ? (
          <ul className={s.items}>
            {visible.map((it) => (
              <li key={it.id}>
                <a
                  className={s.item}
                  href={it.href ?? '#'}
                  aria-current={it.id === currentId ? 'page' : undefined}
                  data-force={forceState?.id === it.id ? forceState.state : undefined}
                  onClick={go(it)}
                >
                  {it.label}
                </a>
              </li>
            ))}
            {overflow.length ? (
              <li>
              <div className={s.menuWrap} ref={more.ref}>
                <button
                  type="button"
                  className={s.item}
                  data-trigger
                  aria-haspopup="menu"
                  aria-expanded={more.open}
                  data-force={forceState?.id === 'more' ? forceState.state : undefined}
                  onClick={() => more.setOpen(!more.open)}
                >
                  More
                  <span className={s.chev} aria-hidden="true">{navIcons.chevronDown}</span>
                </button>
                {more.open ? (
                  <ul className={s.menu} role="menu" aria-label="More">
                    {overflow.map((it) => (
                      <li key={it.id} role="none">
                        <a role="menuitem" className={s.menuItem} href={it.href ?? '#'} onClick={go(it)}>
                          {it.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className={s.utilities}>
          {showContext && current ? (
            <div className={s.menuWrap} ref={ctx.ref}>
              <button
                type="button"
                className={s.selector}
                data-trigger
                data-open={ctx.open || undefined}
                aria-haspopup="listbox"
                aria-expanded={ctx.open}
                aria-label={`${contextKind}: ${current.label}`}
                title={current.label}
                onClick={() => ctx.setOpen(!ctx.open)}
              >
                <span className={`${s.selectorIcon} ${s.selectorPin}`} aria-hidden="true">{navIcons.pin}</span>
                <span className={s.selectorValue}>{current.label}</span>
                <span className={s.selectorIcon} aria-hidden="true">{navIcons.chevronDown}</span>
              </button>
              {ctx.open ? (
                <div className={`${s.menu} ${s.menuEnd}`}>
                  <p className={s.menuCaption}>{contextKind.toUpperCase()}</p>
                  <ul role="listbox" aria-label={contextKind} className={s.menuList}>
                    {contexts!.map((c) => (
                      <li key={c.id} role="none">
                        <button
                          type="button"
                          role="option"
                          aria-selected={c.id === current.id}
                          className={s.menuItem}
                          onClick={() => {
                            onContextChange?.(c.id);
                            ctx.setOpen(false);
                          }}
                        >
                          <span>{c.label}</span>
                          {c.id === current.id ? <span className={s.tick} aria-hidden="true">{navIcons.check}</span> : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={s.iconGroup}>
          {utilityList.map(({ key, name, icon, u }) => {
            const n = u.count ?? 0;
            return (
              <button
                key={key}
                type="button"
                className={s.iconBtn}
                aria-label={n > 0 ? `${name}, ${n} unread` : name}
                title={name}
              >
                {icon}
                {n > 0 ? (
                  <span className={s.badge} aria-hidden="true">
                    {badgeText(n)}
                  </span>
                ) : null}
              </button>
            );
          })}
          </div>

          {initials ? (
          <div className={s.menuWrap} ref={account.ref}>
            <button
              type="button"
              className={s.avatar}
              data-trigger
              data-open={account.open || undefined}
              aria-haspopup="menu"
              aria-expanded={account.open}
              aria-label="Account menu"
              title="Account"
              onClick={() => account.setOpen(!account.open)}
            >
              <span className={s.avatarInner}>{initials}</span>
            </button>
            {account.open ? (
              <ul className={`${s.menu} ${s.menuEnd}`} role="menu" aria-label="Account">
                {mailInMenu ? (
                  <li role="none">
                    <button type="button" role="menuitem" className={s.menuItem} onClick={() => account.setOpen(false)}>
                      <span>Mail</span>
                      {(mailInMenu.count ?? 0) > 0 ? <span className={s.menuCount}>{badgeText(mailInMenu.count!)}</span> : null}
                    </button>
                  </li>
                ) : null}
                {accountItems.map((a) => (
                  <li key={a.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={s.menuItem}
                      onClick={() => {
                        onAccountAction?.(a.id);
                        account.setOpen(false);
                      }}
                    >
                      {a.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
