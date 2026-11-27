import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../Button';
import { dropdownIcons } from './icons';
import { usePopover } from './usePopover';
import type { MenuEntry } from './types';
import d from './Dropdown.module.css';
import m from './Menu.module.css';

type MenuItem = Extract<MenuEntry, { type?: 'item' }>;
type SubItem = NonNullable<MenuItem['items']>[number];

interface MenuBaseProps {
  /** Commands, in order. Destructive last, after a divider. */
  entries: MenuEntry[];
  align?: 'start' | 'end';
  className?: string;
  /** Documentation only: hold the menu open. */
  open?: boolean;
  /** Documentation only: draw the panel in the flow, under the trigger. */
  staticPanel?: boolean;
  /** Documentation only: the item id shown as hovered or focused. */
  forceActive?: string;
  /** Documentation only: open the submenu of this item id. */
  openSubmenu?: string;
}
export interface MenuTextProps extends MenuBaseProps {
  /** Text trigger, e.g. "Actions". A chevron follows it. */
  label: string;
  iconLabel?: undefined;
}
export interface MenuIconProps extends MenuBaseProps {
  /** The more-actions (⋯) button needs a specific name: "More actions for Achintya Sharma". */
  iconLabel: string;
  label?: undefined;
}
export type MenuProps = MenuTextProps | MenuIconProps;

export function Menu(props: MenuProps) {
  const { entries, align = 'start', className, open: forceOpen, staticPanel, openSubmenu, forceActive } = props;
  const uid = useId();
  const pop = usePopover(forceOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const [subOpen, setSubOpen] = useState<string | null>(openSubmenu ?? null);

  const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);
  const close = () => { pop.setOpen(false); setSubOpen(null); triggerRef.current?.focus(); };

  /* Focus moves into the menu on open, to the first item. */
  useEffect(() => {
    if (pop.open && forceOpen === undefined) focusables()[0]?.focus();
  }, [pop.open, forceOpen]);

  const run = (it: MenuItem | SubItem) => {
    if (it.disabled) return;
    it.onSelect?.();
    close();
  };

  const onPanelKey = (e: KeyboardEvent) => {
    const items = focusables();
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(i - 1, 0)]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); if (subOpen) setSubOpen(null); else close(); }
    else if (e.key === 'Tab') { pop.setOpen(false); setSubOpen(null); }
  };

  const itemBody = (it: MenuItem | SubItem, hasSub: boolean): ReactNode => (
    <>
      {it.icon ? <span className={d.lead} aria-hidden="true">{it.icon}</span> : null}
      <span className={d.label}>{it.label}</span>
      {it.shortcut ? <span className={d.shortcut} aria-hidden="true">{it.shortcut}</span> : null}
      {hasSub ? <span className={m.arrow} aria-hidden="true">{dropdownIcons.arrowRight}</span> : null}
    </>
  );

  const itemProps = (it: MenuItem | SubItem) => ({
    role: 'menuitem' as const,
    tabIndex: -1,
    'aria-disabled': it.disabled || undefined,
    title: it.disabled ? it.disabledReason : undefined,
    'data-destructive': it.destructive || undefined,
  });

  const trigger =
    props.label !== undefined ? (
      <Button
        ref={triggerRef as React.Ref<HTMLElement>}
        variant="secondary"
        label={props.label}
        icon={dropdownIcons.chevronDown}
        iconPosition="trailing"
        aria-haspopup="menu"
        aria-expanded={pop.open}
        onClick={() => pop.setOpen(!pop.open)}
      />
    ) : (
      <Button
        ref={triggerRef as React.Ref<HTMLElement>}
        variant="secondary"
        iconOnly
        icon={dropdownIcons.more}
        ariaLabel={props.iconLabel}
        aria-haspopup="menu"
        aria-expanded={pop.open}
        onClick={() => pop.setOpen(!pop.open)}
      />
    );

  return (
    <div className={`${m.root} ${className ?? ''}`} ref={pop.wrap} data-align={align === 'end' ? 'end' : undefined}>
      {trigger}
      {pop.open ? (
        <div
          ref={panelRef}
          role="menu"
          aria-labelledby={uid}
          className={d.panel}
          data-menu
          data-size="md"
          data-placement={pop.placement}
          data-align={align === 'end' ? 'end' : undefined}
          data-static={staticPanel || undefined}
          onKeyDown={onPanelKey}
        >
          <span id={uid} hidden>{props.label ?? props.iconLabel}</span>
          {entries.map((en, idx) => {
            if (en.type === 'divider') return <hr key={`d${idx}`} className={d.divider} role="separator" />;
            const hasSub = !!en.items?.length;
            if (!hasSub) {
              return (
                <div key={en.id} className={d.option} {...itemProps(en)} onClick={() => run(en)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(en); } }} data-active={forceActive === en.id || undefined}>
                  {itemBody(en, false)}
                </div>
              );
            }
            const isOpen = subOpen === en.id;
            return (
              <div key={en.id} className={m.sub} onMouseEnter={() => setSubOpen(en.id)} onMouseLeave={() => { if (openSubmenu === undefined) setSubOpen(null); }}>
                <div
                  className={d.option}
                  {...itemProps(en)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  data-active={isOpen || undefined}
                  onClick={() => setSubOpen(isOpen ? null : en.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setSubOpen(en.id); }
                  }}
                >
                  {itemBody(en, true)}
                </div>
                {isOpen ? (
                  <div role="menu" aria-label={en.label} className={`${d.panel} ${m.subPanel}`} data-menu data-size="md" onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); setSubOpen(null); }
                  }}>
                    {en.items!.map((sub) => (
                      <div key={sub.id} className={d.option} {...itemProps(sub)} onClick={() => run(sub)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(sub); } }}>
                        {itemBody(sub, false)}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
