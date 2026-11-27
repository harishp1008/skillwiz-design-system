import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import s from './Tabs.module.css';

export type TabsVariant = 'underline' | 'card' | 'vertical' | 'pill';
export type TabsSize = 'lg' | 'sm';
export type TabStatusTone = 'success' | 'danger' | 'neutral';

export interface TabItem {
  id: string;
  /** Short noun, sentence case, 1–2 words. Never a sentence, a verb or ALL CAPS. */
  label: string;
  /** Optional number after the label. Card tabs always have one; pill tabs never do. */
  count?: number;
  /** Red count: only while alerts are new. Turn it off once the tab has been opened. */
  alert?: boolean;
  /** Unavailable. The tab stays, is announced, and arrow keys skip it. Say why in `disabledReason`. */
  disabled?: boolean;
  disabledReason?: string;
  /** Vertical list tabs only: a short caption under the label. */
  description?: string;
  /** Vertical list tabs only: each row's own status, e.g. “Passed”. */
  status?: { label: string; tone?: TabStatusTone };
  /** What this tab shows. */
  panel?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled selected tab id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Where the tabs live, not how they look. See the decision order in the Tabs docs. */
  variant?: TabsVariant;
  /** Underline tabs only. Large for the main sections of a page, small inside a drawer, card or panel. */
  size?: TabsSize;
  /** Accessible name of the tab list, e.g. “Student activity”. Required. */
  label: string;
  /** Auto selects on arrow. Manual moves focus only; Enter or Space selects. Use manual when the panel fetches data. */
  activation?: 'auto' | 'manual';
  className?: string;
  /** Documentation only: hold one tab in a state. */
  forceState?: { id: string; state: 'hover' | 'focus' };
  /** Documentation only: leave the panels out and show only the tab list. */
  hidePanels?: boolean;
}

type Fade = 'none' | 'start' | 'end' | 'both';

export function Tabs({
  items, value, defaultValue, onValueChange, variant = 'underline', size = 'lg', label,
  activation = 'auto', className, forceState, hidePanels,
}: TabsProps) {
  const uid = useId();
  const firstEnabled = items.find((i) => !i.disabled)?.id ?? items[0]?.id;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? inner;
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState<Fade>('none');
  const vertical = variant === 'vertical';
  const rovingId = focusId ?? selected;

  const select = (id: string) => {
    const it = items.find((i) => i.id === id);
    if (!it || it.disabled) return;
    if (value === undefined) setInner(id);
    onValueChange?.(id);
  };

  /* Edge fade while the list scrolls sideways. */
  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el || vertical) return setFade('none');
    const more = el.scrollWidth - el.clientWidth > 1;
    if (!more) return setFade('none');
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setFade(atStart ? 'end' : atEnd ? 'start' : 'both');
  }, [vertical]);
  useLayoutEffect(() => {
    measure();
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, items]);

  /* The selected tab is always scrolled into view. */
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !tab || vertical) return;
    if (tab.offsetLeft < list.scrollLeft) list.scrollLeft = tab.offsetLeft;
    else if (tab.offsetLeft + tab.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = tab.offsetLeft + tab.offsetWidth - list.clientWidth;
  }, [selected, vertical]);

  const move = (from: number, step: 1 | -1) => {
    for (let n = 1; n <= items.length; n++) {
      const i = (from + step * n + items.length * n) % items.length;
      if (!items[i]?.disabled) return items[i];
    }
    return undefined;
  };
  const focusTab = (id: string) => {
    setFocusId(id);
    listRef.current?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(id)}"]`)?.focus();
    if (activation === 'auto') select(id);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const idx = items.findIndex((i) => i.id === rovingId);
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    let target: TabItem | undefined;
    if (e.key === next) target = move(idx, 1);
    else if (e.key === prev) target = move(idx, -1);
    else if (e.key === 'Home') target = items.find((i) => !i.disabled);
    else if (e.key === 'End') target = [...items].reverse().find((i) => !i.disabled);
    else return;
    e.preventDefault();
    if (target) focusTab(target.id);
  };

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  return (
    <div className={`${s.root} ${className ?? ''}`} data-variant={variant} data-size={size}>
      <div className={s.listWrap} data-fade={fade}>
        <div
          ref={listRef}
          role="tablist"
          aria-label={label}
          aria-orientation={vertical ? 'vertical' : 'horizontal'}
          className={s.list}
          onKeyDown={onKeyDown}
          onScroll={measure}
        >
          {items.map((it) => {
            const isSel = it.id === selected;
            const name = it.count !== undefined ? `${it.label}, ${it.count}` : it.label;
            return (
              <button
                key={it.id}
                type="button"
                role="tab"
                id={tabId(it.id)}
                data-tab-id={it.id}
                aria-selected={isSel}
                aria-controls={panelId(it.id)}
                aria-disabled={it.disabled || undefined}
                aria-label={vertical && (it.description || it.status) ? undefined : name}
                tabIndex={it.id === rovingId ? 0 : -1}
                title={it.disabled ? it.disabledReason : undefined}
                className={s.tab}
                data-selected={isSel || undefined}
                data-force={forceState?.id === it.id ? forceState.state : undefined}
                onClick={() => { setFocusId(it.id); select(it.id); }}
                onFocus={() => setFocusId(it.id)}
              >
                {vertical ? (
                  <>
                    <span className={s.text}>
                      <span className={s.title}>{it.label}</span>
                      {it.description ? <span className={s.caption}>{it.description}</span> : null}
                    </span>
                    {it.status ? <span className={s.status} data-tone={it.status.tone ?? 'neutral'}>{it.status.label}</span> : null}
                  </>
                ) : (
                  <>
                    <span className={s.label} data-text={it.label}>{it.label}</span>
                    {it.count !== undefined ? (
                      <span className={s.count} data-alert={it.alert || undefined} aria-hidden="true">{it.count}</span>
                    ) : null}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {hidePanels
        ? null
        : items.map((it) => (
            <div
              key={it.id}
              role="tabpanel"
              id={panelId(it.id)}
              aria-labelledby={tabId(it.id)}
              hidden={it.id !== selected}
              tabIndex={0}
              className={s.panel}
            >
              {it.panel}
            </div>
          ))}
    </div>
  );
}
