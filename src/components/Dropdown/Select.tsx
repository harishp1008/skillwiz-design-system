import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { dropdownIcons } from './icons';
import { usePopover } from './usePopover';
import { MULTI_CHIPS_SHOWN } from './constants';
import type { DropdownSize, SelectAction, SelectOption } from './types';
import d from './Dropdown.module.css';
import s from './Select.module.css';

interface SelectBaseProps {
  /** Above the trigger, like every field. Also part of the trigger's accessible name. */
  label: string;
  options: SelectOption[];
  /** "Select…" or a real default such as "All classrooms". Never "-- Select --". */
  placeholder?: string;
  size?: DropdownSize;
  disabled?: boolean;
  /** Helper text under the trigger. When the select is disabled, say why. */
  helper?: string;
  /** Marks the value as wrong. The message says what to pick. */
  error?: string;
  /** Spinner and words in the panel. The trigger stays usable. */
  loading?: boolean;
  loadingLabel?: string;
  /** A leading icon in the trigger, e.g. the pin on the location selector. */
  leadingIcon?: ReactNode;
  /** A related command after a divider, e.g. "Manage classrooms". */
  action?: SelectAction;
  /** Typing filters the list. Use over 15 options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Searchable only: all matches, for "2 of 120 students". Defaults to the number of options passed in. */
  totalCount?: number;
  /** Searchable only: the noun in the count, e.g. "students". */
  countNoun?: string;
  /** Searchable only: called as people type, for lists loaded from a server. */
  onQueryChange?: (query: string) => void;
  /** Where the panel's left edge sits. Menus on the far right use "end". */
  align?: 'start' | 'end';
  id?: string;
  className?: string;
  /** Documentation only: hold the panel open. */
  open?: boolean;
  /** Documentation only: draw the panel in the flow, under the trigger, instead of floating. */
  staticPanel?: boolean;
  /** Documentation only: hold the trigger in a state. `focus` also shows the chevron up. */
  forceState?: 'hover' | 'focus';
  /** Documentation only: value of the option shown as the active one. */
  forceActive?: string;
  /** Documentation only: start with this text typed in a searchable select. */
  defaultQuery?: string;
}

export interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  value: string | null;
  onChange?: (value: string) => void;
}
export interface MultiSelectProps extends SelectBaseProps {
  multiple: true;
  value: string[];
  onChange?: (values: string[]) => void;
}
export type SelectProps = SingleSelectProps | MultiSelectProps;

function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className={d.match}>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function Select(props: SelectProps) {
  const {
    label, options, placeholder = 'Select…', size = 'md', disabled = false, helper, error, loading = false,
    loadingLabel = 'Loading', leadingIcon, action, searchable = false, searchPlaceholder = 'Search', totalCount,
    countNoun = 'results', onQueryChange, align = 'start', id, className, open: forceOpen, staticPanel, forceState, forceActive, defaultQuery,
  } = props;
  const multiple = props.multiple === true;
  const values: string[] = multiple ? (props.value as string[]) : props.value ? [props.value as string] : [];

  const uid = useId();
  const baseId = id ?? uid;
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const listId = `${baseId}-list`;
  const helperId = `${baseId}-helper`;
  const pop = usePopover(forceOpen);
  const [query, setQuery] = useState(defaultQuery ?? '');
  const [active, setActive] = useState(-1);
  const typed = useRef({ text: '', at: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q) || (o.description ?? '').toLowerCase().includes(q)) : options;
  }, [options, query]);
  const groups = useMemo(() => {
    const names: string[] = [];
    visible.forEach((o) => { if (o.group && !names.includes(o.group)) names.push(o.group); });
    return names;
  }, [visible]);
  const showGroups = groups.length >= 2;

  const enabledIdx = (from: number, step: 1 | -1) => {
    for (let i = from; i >= 0 && i < visible.length; i += step) if (!visible[i]?.disabled) return i;
    return -1;
  };

  /* The chosen option is active and scrolled into view on open. */
  useEffect(() => {
    if (!pop.open) { setQuery(''); return; }
    const forced = forceActive ? visible.findIndex((o) => o.value === forceActive) : -1;
    const sel = forced >= 0 ? forced : visible.findIndex((o) => values.includes(o.value) && !o.disabled);
    setActive(sel >= 0 ? sel : enabledIdx(0, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop.open]);
  useEffect(() => {
    if (searchable && pop.open) setActive(enabledIdx(0, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  useEffect(() => {
    if (!pop.open || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, pop.open]);

  const close = (refocus = true) => {
    pop.setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    if (multiple) {
      const next = values.includes(o.value) ? values.filter((v) => v !== o.value) : [...values, o.value];
      (props as MultiSelectProps).onChange?.(next);
    } else {
      (props as SingleSelectProps).onChange?.(o.value);
      close();
    }
  };
  const enabledAll = options.filter((o) => !o.disabled).map((o) => o.value);

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    const k = e.key;
    if (!pop.open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || (k === ' ' && !searchable)) { e.preventDefault(); pop.setOpen(true); }
      return;
    }
    if (k === 'Escape') { e.preventDefault(); close(); return; }
    if (k === 'Tab') { close(false); return; }
    if (k === 'ArrowDown') { e.preventDefault(); const n = enabledIdx(active + 1, 1); if (n >= 0) setActive(n); return; }
    if (k === 'ArrowUp') { e.preventDefault(); const n = enabledIdx(active - 1, -1); if (n >= 0) setActive(n); return; }
    if (k === 'Home' && !searchable) { e.preventDefault(); setActive(enabledIdx(0, 1)); return; }
    if (k === 'End' && !searchable) { e.preventDefault(); setActive(enabledIdx(visible.length - 1, -1)); return; }
    if (k === 'Enter' || (k === ' ' && multiple && !searchable)) {
      e.preventDefault();
      const cur = visible[active];
      if (cur) choose(cur);
      return;
    }
    /* Typing a letter jumps to the next match. The list does not wrap. */
    if (!searchable && k.length === 1 && !e.metaKey && !e.ctrlKey && k !== ' ') {
      const now = Date.now();
      typed.current = { text: now - typed.current.at > 600 ? k.toLowerCase() : typed.current.text + k.toLowerCase(), at: now };
      const from = typed.current.text.length === 1 ? active + 1 : active;
      const n = visible.findIndex((o, i) => i >= Math.max(from, 0) && !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (n >= 0) setActive(n);
    }
  };

  const selectedOptions = values.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOption[];
  const valueText = selectedOptions.map((o) => o.label).join(', ');
  const countText = searchable ? `${visible.length} of ${totalCount ?? options.length} ${countNoun}` : '';
  const chevron = pop.open || forceState === 'focus' ? dropdownIcons.chevronUp : dropdownIcons.chevronDown;
  const describedBy = error || helper ? helperId : undefined;
  const activeId = pop.open && active >= 0 ? `${baseId}-opt-${active}` : undefined;

  const renderOption = (o: SelectOption, i: number) => {
    const isSel = values.includes(o.value);
    return (
      <div
        key={o.value}
        id={`${baseId}-opt-${i}`}
        role="option"
        aria-selected={isSel}
        aria-disabled={o.disabled || undefined}
        data-index={i}
        data-active={i === active || undefined}
        data-selected={isSel || undefined}
        title={o.disabled ? o.disabledReason : undefined}
        className={d.option}
        onMouseMove={() => { if (!o.disabled && active !== i) setActive(i); }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(o)}
      >
        {multiple ? (
          <span className={d.checkbox} data-checked={isSel || undefined} aria-hidden="true">{isSel ? dropdownIcons.check : null}</span>
        ) : null}
        <span className={d.body}>
          <span className={d.label}>{highlight(o.label, searchable ? query.trim() : '')}</span>
          {o.description ? <span className={d.desc}>{o.description}</span> : null}
        </span>
        {!multiple && isSel ? <span className={`${d.trail} ${d.check}`} aria-hidden="true">{dropdownIcons.check}</span> : null}
      </div>
    );
  };

  let lastGroup: string | undefined;
  const rows: ReactNode[] = [];
  visible.forEach((o, i) => {
    if (showGroups && o.group !== lastGroup) {
      lastGroup = o.group;
      if (o.group) rows.push(<div key={`g-${o.group}`} role="presentation" className={d.group}>{o.group}</div>);
    }
    rows.push(renderOption(o, i));
  });

  const allOn = enabledAll.length > 0 && enabledAll.every((v) => values.includes(v));
  const panel = pop.open ? (
    <div
      className={d.panel}
      data-placement={pop.placement}
      data-size={size}
      data-align={align === 'end' ? 'end' : undefined}
      data-static={staticPanel || undefined}
    >
      {searchable && !loading && visible.length > 0 ? <div className={s.count} role="status" aria-live="polite">{countText}</div> : null}
      {loading ? (
        <div className={d.message} role="status">
          <span className={d.spinner} aria-hidden="true" />
          <span className={d.messageTitle}>{loadingLabel}</span>
        </div>
      ) : visible.length === 0 ? (
        <div className={d.message}>
          <span className={d.messageTitle}>No {countNoun} match “{query}”</span>
          <span>Check the spelling and try again.</span>
        </div>
      ) : (
        <div id={listId} role="listbox" aria-multiselectable={multiple || undefined} aria-labelledby={labelId} ref={listRef}>
          {rows}
        </div>
      )}
      {multiple && !loading && options.length > 0 ? (
        <>
          <hr className={d.divider} />
          <div className={s.actionRow}>
            <button
              type="button"
              className={`${d.option} ${s.rowOption}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => (props as MultiSelectProps).onChange?.(allOn ? [] : enabledAll)}
            >
              <span className={d.checkbox} data-checked={allOn || undefined} aria-hidden="true">{allOn ? dropdownIcons.check : null}</span>
              <span className={d.label}>Select all</span>
            </button>
            <button type="button" className={s.clear} disabled={values.length === 0} onMouseDown={(e) => e.preventDefault()} onClick={() => (props as MultiSelectProps).onChange?.([])}>
              Clear
            </button>
          </div>
        </>
      ) : null}
      {action ? (
        <>
          <hr className={d.divider} />
          <button
            type="button"
            className={`${d.option} ${s.footer}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { action.onSelect(); close(); }}
          >
            {action.icon ? <span className={s.footerIcon} aria-hidden="true">{action.icon}</span> : null}
            <span className={d.label}>{action.label}</span>
          </button>
        </>
      ) : null}
    </div>
  ) : null;

  const triggerAria = {
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': pop.open,
    'aria-controls': pop.open ? listId : undefined,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    'aria-activedescendant': activeId,
  };

  return (
    <div className={`${s.root} ${className ?? ''}`} data-size={size} ref={pop.wrap}>
      <span id={labelId} className={s.label}>{label}</span>
      <div className={s.field}>
        <div
          className={s.trigger}
          data-open={pop.open || undefined}
          data-error={error ? true : undefined}
          data-disabled={disabled || undefined}
          data-force={forceState}
          onClick={() => { if (!disabled && multiple) pop.setOpen(!pop.open); }}
        >
          {leadingIcon || searchable ? <span className={s.icon} aria-hidden="true">{searchable ? dropdownIcons.search : leadingIcon}</span> : null}
          {searchable ? (
            <input
              ref={triggerRef as React.RefObject<HTMLInputElement>}
              className={s.input}
              role="combobox"
              aria-labelledby={labelId}
              aria-autocomplete="list"
              {...triggerAria}
              value={pop.open ? query : valueText}
              placeholder={searchPlaceholder}
              disabled={disabled}
              onFocus={() => { if (!disabled && forceOpen === undefined) pop.setOpen(true); }}
              onChange={(e) => { setQuery(e.target.value); onQueryChange?.(e.target.value); if (!pop.open) pop.setOpen(true); }}
              onKeyDown={onKeyDown}
            />
          ) : (
            <button
              ref={triggerRef as React.RefObject<HTMLButtonElement>}
              type="button"
              className={s.main}
              aria-label={`${label}, ${valueText || placeholder}`}
              {...triggerAria}
              disabled={disabled}
              onClick={(e) => { if (multiple) return; e.stopPropagation(); pop.setOpen(!pop.open); }}
              onKeyDown={onKeyDown}
              title={!multiple && valueText.length > 28 ? valueText : undefined}
            >
              {multiple && selectedOptions.length ? (
                <span className={s.chips} id={valueId}>
                  {selectedOptions.slice(0, MULTI_CHIPS_SHOWN).map((o) => (
                    <span key={o.value} className={s.chip}>
                      {o.label}
                      <span
                        role="button"
                        tabIndex={-1}
                        aria-label={`Remove ${o.label}`}
                        className={s.chipRemove}
                        onClick={(e) => { e.stopPropagation(); (props as MultiSelectProps).onChange?.(values.filter((v) => v !== o.value)); }}
                      >
                        {dropdownIcons.close}
                      </span>
                    </span>
                  ))}
                  {selectedOptions.length > MULTI_CHIPS_SHOWN ? <span className={s.more}>+{selectedOptions.length - MULTI_CHIPS_SHOWN}</span> : null}
                </span>
              ) : (
                <span id={valueId} className={`${s.value} ${valueText ? '' : s.placeholder}`}>{valueText || placeholder}</span>
              )}
            </button>
          )}
          <span className={s.icon} aria-hidden="true">{chevron}</span>
        </div>
        {panel}
      </div>
      {error || helper ? (
        <p id={helperId} className={s.helper} data-error={error ? true : undefined} role={error ? 'alert' : undefined}>
          {error ? <span className={s.icon} aria-hidden="true">{dropdownIcons.alert}</span> : null}
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}
