import type { ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Button, type ButtonVariant } from '../Button';
import { icons } from './icons';
import s from './ButtonGuidelines.module.css';
import { SourceLinks } from '../../shared/docs/SourceLinks';

/* ---------- helpers ---------- */

/** A token as written in code, with the semantic token it is mapped to underneath. */
function Tok({ path }: { path: TokenPath }) {
  const meta = tokenMeta[path];
  const ref = meta.references?.[0];
  return (
    <>
      <code>{meta.cssVar}</code>
      <span className={s.mapped}>{ref ? `→ ${ref}` : String(tokenValues[path])}</span>
    </>
  );
}
const varName = (p: TokenPath) => <code>{tokenMeta[p].cssVar}</code>;

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={s.section} aria-labelledby={`btn-${n}`}>
      <h2 id={`btn-${n}`} className={s.h2}>
        <span>{n}</span>
        {title}
      </h2>
      {intro ? <p className={s.intro}>{intro}</p> : null}
      {children}
    </section>
  );
}

function Table({ head, rows, className }: { head: ReactNode[]; rows: ReactNode[][]; className?: string }) {
  return (
    <div className={s.tableWrap}>
      <table className={`${s.table} ${className ?? ''}`}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Chip = ({ children }: { children: ReactNode }) => <span className={s.chip}>{children}</span>;

/* ---------- 01 Anatomy ---------- */

function Anatomy() {
  return (
    <div className={s.anatomy}>
      <div className={s.anatomyBox}>
        <svg viewBox="0 0 763 321" role="img" aria-label="Anatomy of a button: 1 container, 2 leading icon, 3 label, 4 border">
          <path className={s.guide} d="M223 58H266V114" />
          <circle className={s.dot} cx="266" cy="114" r="5" />
          <circle className={s.badge} cx="138" cy="58" r="12" />
          <text className={s.badgeText} x="138" y="62">1</text>
          <text x="158" y="62">Container</text>

          <path className={s.guide} d="M520 58H404V135" />
          <circle className={s.dot} cx="404" cy="135" r="5" />
          <circle className={s.badge} cx="537" cy="58" r="12" />
          <text className={s.badgeText} x="537" y="62">3</text>
          <text x="557" y="62">Label</text>

          <path className={s.guide} d="M295 185V243" />
          <circle className={s.dot} cx="295" cy="180" r="5" />
          <circle className={s.badge} cx="248" cy="257" r="12" />
          <text className={s.badgeText} x="248" y="261">2</text>
          <text x="268" y="261">Leading icon</text>

          <path className={s.guide} d="M533 160H616V243" />
          <circle className={s.dot} cx="528" cy="160" r="5" />
          <circle className={s.badge} cx="591" cy="257" r="12" />
          <text className={s.badgeText} x="591" y="261">4</text>
          <text x="611" y="261">Border</text>
        </svg>
        <div className={s.anatomyButton}>
          <Button variant="accent" label="Message" icon={icons.message} />
        </div>
      </div>
      <ol className={s.legend}>
        <li>
          <span className={s.num}>1</span>
          <span>
            <b className={s.strong}>Container</b> — height {varName('button.height')} (36px), radius {varName('button.radius')}, 16px side padding. Never set a fixed width; let the label size it. Min width 64px.
          </span>
        </li>
        <li>
          <span className={s.num}>2</span>
          <span>
            <b className={s.strong}>Icon</b> — 16px line icon, 2px stroke, <code>currentColor</code>. 6px gap to the label. The icon side gets 4px less padding (12px) so it looks optically centred.
          </span>
        </li>
        <li>
          <span className={s.num}>3</span>
          <span>
            <b className={s.strong}>Label</b> — Karla 14px bold ({varName('button.font-size')}, {varName('button.font-weight')}), sentence case, never wraps.
          </span>
        </li>
        <li>
          <span className={s.num}>4</span>
          <span>
            <b className={s.strong}>Border</b> — 1px. Filled variants keep a transparent border so every variant has the same height and edge in high-contrast mode.
          </span>
        </li>
      </ol>
    </div>
  );
}

/* ---------- 02 Variants ---------- */

function VariantCard({ stage, name, text, examples, chip }: { stage: ReactNode; name: string; text: string; examples: string; chip: string }) {
  return (
    <div className={s.card}>
      <div className={s.stage}>{stage}</div>
      <div className={s.cardBody}>
        <h3 className={s.cardTitle}>{name}</h3>
        <p className={s.cardText}>{text}</p>
        <span className={s.muted}>{examples}</span>
        <Chip>{chip}</Chip>
      </div>
    </div>
  );
}

function Variants() {
  return (
    <div className={`${s.cards} ${s.cols4}`}>
      <VariantCard stage={<Button variant="primary" label="Open Live Board" />} name="Primary" text="The one main action of a view, card or dialog." examples="Submit test · Open Live Board · Talk · Upload" chip="Max 1 per region" />
      <VariantCard stage={<Button variant="secondary" label="Review" />} name="Secondary" text="Supporting or neutral actions. The default when unsure." examples="Cancel · Review · Get template · Report PDF" chip="Unlimited" />
      <VariantCard stage={<Button variant="accent" label="Message" icon={icons.message} />} name="Accent outline" text="A frequent action repeated on every row or card that must still stand out." examples="Message (to-do rows, live-wall cards)" chip="Lists & cards" />
      <VariantCard stage={<Button variant="ghost" iconOnly icon={icons.more} ariaLabel="More" />} name="Ghost" text="Low-emphasis actions in toolbars, headers and icon-only controls." examples="Previous / Next · More (⋯) · Close" chip="Toolbars" />
      <VariantCard stage={<Button variant="link" label="View results" icon={icons.arrowRight} iconPosition="trailing" href="#results" />} name="Link" text="Navigation inside text, card footers and empty states." examples="View results → · Show all 9 → · How to allow" chip="Navigation only" />
      <VariantCard
        stage={
          <>
            <Button variant="primary" live label="0:12" icon={icons.mic} />
            <Button variant="accent" label="Mute" icon={icons.micOff} pressed />
          </>
        }
        name="Live / toggle"
        text="Shows an ongoing state the user started; pressing it ends or toggles it."
        examples="Talking 0:12 · Mute (pressed)"
        chip="Stateful"
      />
      <VariantCard stage={<Button variant="danger" label="Reset code" />} name="Danger" text="A destructive action that can't be undone. Mostly the confirm button inside a dialog." examples="Reset code · End talk · Delete template" chip="Confirm step only" />
      <VariantCard stage={<Button variant="danger-secondary" label="Pause exam…" />} name="Danger secondary" text="A risky action shown next to others. It opens a confirmation instead of acting straight away." examples="Talking 0:12 · Mute (pressed)" chip="Stateful" />
    </div>
  );
}

/* ---------- 03 States ---------- */

type StateKey = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'loading';
const states: StateKey[] = ['default', 'hover', 'focus', 'pressed', 'disabled', 'loading'];
const matrix: { variant: ButtonVariant; name: string; sub: string; label: string; icon?: ReactNode }[] = [
  { variant: 'primary', name: 'Primary', sub: 'action-primary', label: 'Submit test' },
  { variant: 'secondary', name: 'Secondary', sub: 'bg-surface · border-default', label: 'Review' },
  { variant: 'accent', name: 'Accent outline', sub: 'text-link · action-primary', label: 'Message', icon: icons.message },
  { variant: 'ghost', name: 'Ghost', sub: 'transparent', label: 'Previous' },
  { variant: 'danger', name: 'Danger', sub: 'action-danger', label: 'Reset code' },
  { variant: 'danger-secondary', name: 'Danger secondary', sub: 'status-error-text', label: 'Pause exam…' },
  { variant: 'link', name: 'Link', sub: 'text-link', label: 'View results' },
];

function States() {
  return (
    <div className={s.statesWrap}>
      <table className={`${s.table} ${s.statesTable}`}>
        <thead>
          <tr>
            <th>Variant</th>
            {states.map((st) => (
              <th key={st}>{st}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((m) => (
            <tr key={m.variant}>
              <td>
                <span className={s.variantName}>
                  {m.name}
                  <small>{m.sub}</small>
                </span>
              </td>
              {states.map((st) => (
                <td key={st}>
                  <Button
                    variant={m.variant}
                    label={m.label}
                    icon={st === 'loading' ? undefined : m.icon}
                    loading={st === 'loading'}
                    disabledReason={st === 'disabled' ? 'Unavailable right now' : null}
                    data-force={st === 'hover' || st === 'focus' || st === 'pressed' ? st : undefined}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- 04 Sizes ---------- */

function Sizes() {
  const rows: { size: 'sm' | 'md' | 'lg'; name: string; h: TokenPath; label: string; pad: string; icon: string; gap: string; use: string }[] = [
    { size: 'sm', name: 'Small', h: 'button.sm.height', label: '12px', pad: '12px (8 icon side)', icon: '14px', gap: '4px', use: 'Dense tables, filter rows, inline chips of actions' },
    { size: 'md', name: 'Medium (default)', h: 'button.height', label: '14px', pad: '16px (12 icon side)', icon: '16px', gap: '6px', use: 'Everywhere by default: cards, dialogs, toolbars' },
    { size: 'lg', name: 'Large', h: 'button.lg.height', label: '16px', pad: '20px (16 icon side)', icon: '20px', gap: '8px', use: 'Student exam screens, touch, single hero CTA' },
  ];
  return (
    <Table
      head={['Size', 'Preview', 'Height', 'Label', 'Side padding', 'Icon', 'Gap', 'Use for']}
      rows={rows.map((r) => [
        r.name,
        <Button key="b" variant="accent" size={r.size} label="Message" icon={icons.message} />,
        <span key="h">
          {varName(r.h)} · {String(tokenValues[r.h])}
        </span>,
        r.label,
        r.pad,
        r.icon,
        r.gap,
        r.use,
      ])}
    />
  );
}

/* ---------- 05 Icons, groups & special buttons ---------- */

function IconSlots() {
  const cards: { stage: ReactNode; name: string; text: ReactNode }[] = [
    { stage: <Button label="Review" />, name: 'Label only', text: 'The label says it all. Default for dialogs and forms.' },
    { stage: <Button variant="accent" label="Message" icon={icons.message} />, name: 'Leading icon', text: 'Names the object: message, call, download, star, upload.' },
    { stage: <Button variant="primary" label="Open Live Board" icon={icons.arrowRight} iconPosition="trailing" />, name: 'Trailing icon', text: 'Says what happens next: → goes to a page, ▾ opens a menu, ↗ opens a new tab.' },
    { stage: <Button label="LPU_Class" icon={icons.chevronDown} iconPosition="trailing" />, name: 'Leading + trailing', text: 'An object that opens a menu: class switcher, filter, camera picker.' },
    { stage: <Button variant="ghost" iconOnly icon={icons.more} ariaLabel="More" />, name: 'Icon only', text: 'Well-known controls only. Needs aria-label and a matching tooltip.' },
  ];
  return (
    <div className={`${s.cards} ${s.cols5}`}>
      {cards.map((c) => (
        <div key={c.name} className={s.card}>
          <div className={s.stage}>{c.stage}</div>
          <div className={s.cardBody}>
            <h4 className={s.cardTitle}>{c.name}</h4>
            <p className={`${s.cardText} ${s.muted}`}>{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IconsAndSpecials() {
  return (
    <>
      <h3 className={s.h3}>Icon slots: every button has an optional leading and trailing icon</h3>
      <p className={s.intro}>
        Any variant can take a leading icon, a trailing icon, both, or neither. Pick the slot by what the icon tells the user: the <b className={s.strong}>leading</b> icon names the thing the action is about, the <b className={s.strong}>trailing</b> icon says what happens after the click.
      </p>
      <IconSlots />

      <div className={s.panel}>
        <div className={s.panelStage}>
          <Button label="Message" icon={icons.message} />
          <Button label="Talk" icon={icons.phone} />
          <Button label="Open detail" icon={icons.externalLink} />
          <Button variant="accent" label="Add to watchlist" icon={icons.star} />
        </div>
        <span className={s.muted}>
          <b className={s.strong}>Live row card</b> (Wall V2 student card): all four actions use a <b className={s.strong}>leading</b> icon because each names its object. Talk turns primary when a student raises a hand; the icon stays.
        </span>
      </div>

      <Table
        head={['Use case', 'Slot', 'Icon', 'Example']}
        rows={[
          ['Act on a person or item', 'Leading', 'message, phone, star, mic, upload, download, plus', 'Message · Talk · Add to watchlist · Save as template'],
          ['Go to another page or view', 'Trailing', 'arrow-right', 'Open Live Board → · View results →'],
          ['Open a menu or list', 'Trailing', <span key="i">chevron-down (turns up while open, <code>aria-expanded</code>)</span>, 'Sort: Highest risk ▾ · Rows per page ▾'],
          ['Open outside the app or in a new tab', 'Trailing', 'arrow-up-right', 'Download report ↗ · Help article ↗'],
          ['Object that opens a menu', 'Leading + trailing', 'object icon + chevron-down', 'building + LPU_Class ▾ · filter Status ▾ · camera Webcam ▾'],
          ['Remove a selection', 'Trailing', 'close (×), with its own aria-label', 'Filter chip "High risk ×"'],
        ]}
      />

      <ul className={s.notes}>
        <li>At most one icon per side. Never two leading icons.</li>
        <li>16px icon (14px small, 20px large), 2px stroke, <code>currentColor</code>, so it follows the variant’s text colour and states.</li>
        <li>Gap between icon and label: 6px (4px small, 8px large). The side with an icon gets 4px less padding (12px instead of 16px) so it looks centred.</li>
        <li>Loading: the spinner takes the leading slot; with only a trailing icon, it replaces that one. Width stays the same.</li>
        <li>Icons are decoration: <code>aria-hidden=&quot;true&quot;</code>. The label or <code>aria-label</code> carries the meaning.</li>
        <li>Keep the same icon for the same action everywhere (Message is always the speech bubble).</li>
      </ul>

      <div className={`${s.cards} ${s.cols3}`}>
        <div className={s.panel}>
          <div className={s.panelStage}>
            <Button variant="ghost" iconOnly icon={icons.chevronLeft} ariaLabel="Previous" />
            <Button variant="ghost" iconOnly icon={icons.chevronRight} ariaLabel="Next" />
            <Button variant="secondary" iconOnly icon={icons.more} ariaLabel="More" />
            <Button variant="ghost" iconOnly icon={icons.close} ariaLabel="Close" />
          </div>
          <span className={s.muted}>
            <b className={s.strong}>Icon-only:</b> square, same height as text buttons. Allowed for prev/next, close, more, mute. Always <code>aria-label</code> + tooltip.
          </span>
        </div>
        <div className={s.panel}>
          <div className={s.panelStage}>
            <span className={s.segmented} role="group" aria-label="View">
              <Button variant="secondary" label="Spotlight" pressed />
              <Button variant="secondary" label="5×2" pressed={false} />
            </span>
          </div>
          <span className={s.muted}>
            <b className={s.strong}>Segmented group</b> for switching views. Selected uses <code>aria-pressed</code>: accent tint + blue border.
          </span>
        </div>
        <div className={s.panel}>
          <div className={s.panelStage}>
            <Button variant="primary" live label="0:12" icon={icons.mic} />
            <Button variant="accent" label="Mute" icon={icons.micOff} pressed />
            <Button variant="danger" label="End" />
          </div>
          <span className={s.muted}>
            <b className={s.strong}>Live / toggle:</b> a running Talk shows the timer and a 3px ring. Mute is a toggle (<code>aria-pressed</code>). End is the only danger.
          </span>
        </div>
        <div className={s.panel}>
          <div className={s.panelStage}>
            <Button variant="secondary" size="sm" label="Save as template" icon={icons.plus} />
            <Button variant="primary" size="sm" label="Uploading…" loading />
          </div>
          <span className={s.muted}>
            <b className={s.strong}>Loading:</b> spinner replaces the icon, label says what’s happening, <code>aria-busy=&quot;true&quot;</code>, width doesn’t jump.
          </span>
        </div>
        <div className={`${s.panel} ${s.span2}`}>
          <Button variant="primary" size="lg" label="Submit test" fullWidth />
          <span className={s.muted}>
            <b className={s.strong}>Full width</b> only in narrow panels, mobile, and single-action forms. Large size on student exam screens.
          </span>
        </div>
      </div>
    </>
  );
}

/* ---------- 06 Usage guidelines ---------- */

function DoDont({ ok, text, children, centered }: { ok: boolean; text: ReactNode; children: ReactNode; centered?: boolean }) {
  return (
    <div className={s.dd}>
      <div className={`${s.ddStage} ${centered ? s.centered : ''}`}>{children}</div>
      <div className={`${s.ddFoot} ${ok ? '' : s.ddFootBad}`}>
        <span className={`${s.ddIcon} ${ok ? '' : s.ddIconBad}`} aria-hidden="true">
          {ok ? icons.checkCircle : icons.xCircle}
        </span>
        <span>
          <b className={s.strong}>{ok ? 'Do.' : 'Don’t.'}</b> {text}
        </span>
      </div>
    </div>
  );
}

const StudentCard = ({ children }: { children: ReactNode }) => (
  <div className={s.mini}>
    <span className={s.miniName}>Achintya Mishra</span>
    <span className={s.muted}>Risk 96 · Looking away ×9</span>
    <div className={s.miniActions}>{children}</div>
  </div>
);
const Confirm = ({ children }: { children: ReactNode }) => (
  <div className={s.mini}>
    <span className={s.miniName}>Reset and clear your code?</span>
    <span className={s.muted}>You can’t undo this.</span>
    <div className={s.miniActions}>{children}</div>
  </div>
);
const RowList = ({ variant }: { variant: ButtonVariant }) => (
  <div className={s.mini}>
    {['Kaushal Kumar', 'Krishna Kumar', 'Sanjiv Malaviya'].map((n) => (
      <div key={n} className={s.listRow}>
        <span className={s.miniName}>{n}</span>
        <Button variant={variant} size="sm" label="Message" icon={icons.message} />
      </div>
    ))}
  </div>
);

function Usage() {
  return (
    <div className={`${s.cards} ${s.cols4}`}>
      <DoDont ok text="One primary per card. Message stays outline, Talk is the primary.">
        <StudentCard>
          <Button variant="accent" size="sm" label="Message" icon={icons.message} />
          <Button variant="primary" size="sm" label="Talk" icon={icons.phone} />
        </StudentCard>
      </DoDont>
      <DoDont ok={false} text="Two primaries compete — nobody knows which to press first.">
        <StudentCard>
          <Button variant="primary" size="sm" label="Message" icon={icons.message} />
          <Button variant="primary" size="sm" label="Talk" icon={icons.phone} />
        </StudentCard>
      </DoDont>
      <DoDont ok text="Dialog footers: right-aligned, Cancel first, the outcome last.">
        <Confirm>
          <Button variant="secondary" size="sm" label="Cancel" />
          <Button variant="danger" size="sm" label="Reset code" />
        </Confirm>
      </DoDont>
      <DoDont ok={false} text="“Yes / No” hide what happens; danger shouldn’t lead.">
        <Confirm>
          <Button variant="danger" size="sm" label="Yes" />
          <Button variant="secondary" size="sm" label="No" />
        </Confirm>
      </DoDont>

      <DoDont ok text="Repeated row actions use accent outline or secondary.">
        <RowList variant="accent" />
      </DoDont>
      <DoDont ok={false} text="A primary on every row turns the list into a wall of blue.">
        <RowList variant="primary" />
      </DoDont>
      <DoDont ok text="Verb + object, sentence case, 1–3 words.">
        <div className={s.row}>
          <Button variant="secondary" label="Download results" icon={icons.download} />
        </div>
        <div className={s.row}>
          <Button variant="primary" label="Open Live Board" icon={icons.arrowRight} iconPosition="trailing" />
        </div>
      </DoDont>
      <DoDont ok={false} text="Vague labels, ALL CAPS, or generic “OK”." centered>
        <Button variant="secondary" label="Click here" />
        <Button variant="primary" label="SUBMIT" />
        <Button variant="primary" label="OK" />
      </DoDont>

      <DoDont ok text="Icon-only only for well-known icons, always with aria-label + tooltip.">
        <span className={s.tooltip}>Previous student</span>
        <div className={`${s.row} ${s.rowCenter}`}>
          <Button variant="ghost" iconOnly icon={icons.chevronLeft} ariaLabel="Previous student" data-force="hover" />
          <Button variant="ghost" iconOnly icon={icons.chevronRight} ariaLabel="Next student" />
        </div>
      </DoDont>
      <DoDont ok={false} text="Icon-only for rare or destructive actions — label them." centered>
        <Button variant="secondary" iconOnly icon={icons.pause} ariaLabel="Pause exam" />
        <Button variant="danger" iconOnly icon={icons.trash} ariaLabel="Delete" />
      </DoDont>
      <DoDont ok text={<>Disabled? On hover and keyboard focus, a tooltip says why and how to fix it. Use <code>aria-disabled</code>, not <code>disabled</code>, so the tooltip can still appear.</>}>
        <span className={s.tooltip}>
          Microphone is blocked.
          <br />
          Allow mic access in your browser to talk.
        </span>
        <div className={`${s.row} ${s.rowCenter}`}>
          <Button variant="secondary" label="Talk" icon={icons.mic} disabledReason="Microphone is blocked. Allow mic access in your browser to talk." />
        </div>
      </DoDont>
      <DoDont ok={false} text="A silent disabled button with no reason." centered>
        {/* A single space keeps aria-disabled without a visible reason, to show the anti-pattern. */}
        <Button variant="secondary" label="Talk" icon={icons.mic} disabledReason=" " />
      </DoDont>
    </div>
  );
}

/* ---------- 07 Placement ---------- */

function Placement() {
  const items: [string, string, ReactNode][] = [
    ['1', 'One primary per region', 'A card, dialog, panel or page header gets at most one Primary. A page can have several regions.'],
    ['2', 'Order: least → most important', 'In a row, the Primary sits last (rightmost). Cancel / Back come first.'],
    ['3', 'Dialogs right-align, forms left-align', 'Dialog and drawer footers align right. Inline forms align buttons with the fields’ left edge.'],
    ['4', 'Spacing', <>8px ({varName('space.8')}) between buttons in a row; 16px between separate groups.</>],
    ['5', 'Destructive needs two steps', 'Danger secondary opens a confirm; the Danger button inside it names the outcome (“Reset code”, not “Confirm”).'],
    ['6', 'Repeated actions stay quiet', 'On lists and the live wall, row actions are Accent outline or Secondary; the Primary lives in the header or the one card that needs it.'],
  ];
  return (
    <div className={s.placement}>
      {items.map(([n, t, d]) => (
        <div key={n} className={s.placementItem}>
          <span className={`${s.num} ${s.numSoft}`}>{n}</span>
          <div>
            <b className={s.strong}>{t}</b>
            <p>{d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 10 Tokens ---------- */

function TokenTable() {
  const T = (p: TokenPath) => <Tok key={p} path={p} />;
  const hover = 'hover + scale .96';
  return (
    <Table
      head={['Variant', 'Background', 'Label', 'Border', 'Hover', 'Pressed']}
      rows={[
        ['Primary', T('button.primary.bg'), T('button.primary.text'), 'transparent', T('button.primary.bg-hover'), hover],
        ['Secondary', T('button.secondary.bg'), T('button.secondary.text'), T('button.secondary.border'), T('button.secondary.bg-hover'), hover],
        ['Accent outline', T('button.accent.bg'), T('button.accent.text'), T('button.accent.border'), T('button.accent.bg-hover'), T('button.accent.bg-pressed')],
        ['Ghost', 'transparent', T('button.ghost.text'), 'transparent', T('button.ghost.bg-hover'), hover],
        ['Danger', T('button.danger.bg'), T('button.danger.text'), 'transparent', T('button.danger.bg-hover'), hover],
        ['Danger secondary', T('button.danger-secondary.bg'), T('button.danger-secondary.text'), T('button.danger-secondary.border'), T('button.danger-secondary.bg-hover'), hover],
        ['Link', 'none', T('button.link.text'), 'none', 'underline', '—'],
        ['Disabled (all)', T('button.disabled.bg'), T('button.disabled.text'), T('button.disabled.border'), '—', '—'],
      ]}
    />
  );
}

/* ---------- 11 Spec for code ---------- */

function Spec() {
  const decision = [
    <>Is it navigation? → <b>link</b></>,
    <>Is it destructive? → <b>danger-secondary</b> to open confirm; <b>danger</b> inside the confirm</>,
    <>Is it the single action that moves the user forward here? → <b>primary</b></>,
    <>Is it repeated on every row/card? → <b>accent</b></>,
    <>Is it in a toolbar/header or icon-only? → <b>ghost</b></>,
    <>Otherwise → <b>secondary</b></>,
  ];
  const c = (t: string) => <code key={t}>{t}</code>;
  const actions: [string, string, string, string, string][] = [
    ['Message a student', 'accent', 'message', 'Message', '—'],
    ['Talk to a student (instant)', 'primary', 'phone', 'Talk', '—'],
    ['Talk running', 'primary', 'mic', '0:12 (timer)', 'live ring'],
    ['Mute while talking', 'secondary', 'mic-off', 'Mute', 'aria-pressed'],
    ['Open the live board', 'primary', 'arrow-right (trailing)', 'Open Live Board', '—'],
    ['See results / list', 'link', 'arrow-right (trailing)', 'View results · Show all N', '—'],
    ['Review a flagged item', 'secondary', '—', 'Review', '—'],
    ['Download', 'secondary', 'download', 'Get template · Download results', '—'],
    ['Prev / next student', 'ghost', 'chevron-left|chevron-right', '(none)', 'icon-only, aria-label: Previous student|Next student'],
    ['Submit test (student)', 'primary', '—', 'Submit test', 'size lg'],
    ['Mic blocked', 'primary', '—', 'Talk', 'aria-disabled + tooltip: “Microphone is blocked. Allow mic access in your browser to talk.”'],
  ];
  return (
    <>
      <h3 className={s.h3}>A · Decision order (pick the first that matches)</h3>
      <ol className={s.decision}>
        {decision.map((d, i) => (
          <li key={i}>
            <span className={s.num}>{i + 1}</span>
            <span>{d}</span>
          </li>
        ))}
      </ol>

      <h3 className={s.h3}>B · Component props</h3>
      <Table
        head={['Prop', 'Values', 'Default', 'Rule']}
        rows={[
          ['variant', c('primary | secondary | accent | ghost | link | danger | danger-secondary'), c('secondary'), ''],
          ['size', c('sm | md | lg'), c('md'), ''],
          ['label', c('string'), c('—'), 'sentence case, starts with a verb, 1–3 words, never wraps; empty only when iconOnly'],
          ['icon', c('ReactNode | null'), c('null'), 'line icon, stroke 2, currentColor (an Icon component will replace the node)'],
          ['iconPosition', c('leading | trailing'), c('leading'), 'trailing only for the arrow on navigation'],
          ['iconOnly', c('boolean'), c('false'), 'Requires: ariaLabel, tooltip. Icons: chevron-left, chevron-right, close, more, mute.'],
          ['pressed', c('boolean | null'), c('null'), 'toggles only → aria-pressed'],
          ['loading', c('boolean'), c('false'), 'aria-busy=true, spinner replaces icon, width fixed, clicks blocked'],
          ['disabledReason', c('string | null'), c('null'), 'when set → aria-disabled=true + tooltip with the reason (aria-describedby); never the disabled attribute'],
          ['fullWidth', c('boolean'), c('false'), 'only in narrow panels, mobile, single-action forms'],
          ['live', c('boolean'), c('false'), 'running Talk/broadcast: primary fill + 3px ring + timer label'],
        ]}
      />

      <h3 className={s.h3}>C · Rules</h3>
      <div className={`${s.cards} ${s.cols2} ${s.rules}`}>
        <div className={s.panel}>
          <h4>MUST</h4>
          <ul>
            <li>Use only the tokens listed here; no raw hex, px colors or new radii.</li>
            <li>Exactly one primary per region (card, dialog, panel, page header).</li>
            <li>Use &lt;button type=button&gt; for actions and &lt;a href&gt; for navigation.</li>
            <li>Give icon-only buttons aria-label + a matching tooltip.</li>
            <li>Explain every unavailable action with disabledReason (aria-disabled + tooltip).</li>
            <li>Name the outcome in confirm buttons (Reset code, End exam for all).</li>
            <li>Keep the same label for the same action across screens (Talk, never Call).</li>
          </ul>
        </div>
        <div className={s.panel}>
          <h4>MUST NOT</h4>
          <ul>
            <li>Put a primary on every row of a list — use accent or secondary.</li>
            <li>Use danger outside a confirmation dialog.</li>
            <li>Use Yes / No / OK / Confirm / Click here as labels, or ALL CAPS.</li>
            <li>Change size for emphasis — change variant instead.</li>
            <li>Wrap a label onto two lines or set a fixed width on a text button.</li>
            <li>Use the disabled attribute when the user needs to know why.</li>
          </ul>
        </div>
      </div>

      <h3 className={s.h3}>D · Product action map (reuse these exact labels)</h3>
      <Table head={['Action', 'Variant', 'Icon', 'Label', 'Notes']} rows={actions.map(([a, v, i, l, n]) => [a, c(v), i, l, n])} />
    </>
  );
}

/* ---------- page ---------- */

export function ButtonGuidelines() {
  return (
    <main className={s.page}>
      <header>
        <p className={s.eyebrow}>SkillWiz design system · Components</p>
        <h1 className={s.title}>Buttons</h1>
        <p className={s.lead}>
          One button system for the proctor, admin and student products. Seven variants, three sizes, six states — all built on design tokens. Use this page to pick the right button, then follow the usage rules so every screen reads the same way. AI tools: start with section 11, which holds the machine-readable spec.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="Every button is the same shape: an optional leading icon, a label, and an optional trailing icon, inside a 36px container.">
        <Anatomy />
      </Section>
      <Section n="02" title="Variants & hierarchy" intro="Choose by importance, not by looks. Start with Secondary; promote to Primary only for the single action that moves the user forward.">
        <Variants />
      </Section>
      <Section n="03" title="States" intro="Every variant supports the same six states. Hover only applies on devices that can hover. Pressed scales to 0.96. Loading keeps the button width and swaps the icon for a spinner.">
        <States />
      </Section>
      <Section n="04" title="Sizes" intro="Medium is the default. Change size for the context, never for emphasis — use variant for emphasis.">
        <Sizes />
      </Section>
      <Section n="05" title="Icons, groups & special buttons" intro="Icons support the label, they don’t replace it. Every button can carry a leading icon, a trailing icon, or both, chosen by use case.">
        <IconsAndSpecials />
      </Section>
      <Section n="06" title="Usage guidelines" intro="Six rules that cover most decisions. Each one comes from a real SkillWiz screen.">
        <Usage />
      </Section>
      <Section n="07" title="Placement & layout" intro="Where buttons sit matters as much as how they look.">
        <Placement />
      </Section>
      <Section n="08" title="Writing labels">
        <Table
          head={['Rule', 'Use', 'Avoid']}
          rows={[
            ['Start with a verb', 'Open Live Board · Download results · Reset code', 'Live Board · Results'],
            ['Name the outcome in confirmations', 'End exam for all · Delete template', 'Yes · OK · Confirm'],
            ['Sentence case, 1–3 words', 'Save as template · Talk', 'SAVE AS TEMPLATE · Click here to talk to the student'],
            ['Ellipsis when more input follows', 'Pause exam… · Reset code…', 'Pause exam (when a dialog follows)'],
            ['Same action, same word everywhere', 'Talk (card, spotlight, drawer)', 'Call · Speak · Voice for the same action'],
          ]}
        />
      </Section>
      <Section n="09" title="Accessibility & behaviour">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Element', <>Use <code>&lt;button&gt;</code> for actions and <code>&lt;a&gt;</code> for navigation (Link variant). Never a clickable <code>&lt;div&gt;</code>.</>],
            ['Focus', <>2px {varName('button.focus-outline-color')} outline, 2px offset, on <code>:focus-visible</code> only. Danger variants use the danger colour ({varName('button.focus-outline-color-danger')}).</>],
            ['Target size', '36px minimum on desktop; 44px (Large) on touch and student exam screens. Small (28px) only with 8px clear space around it.'],
            ['Contrast', 'Label ≥ 4.5:1 against the fill. Borders that carry meaning (Accent outline, Secondary) ≥ 3:1 against the page. Check any new variant before shipping.'],
            ['Icon-only', <><code>aria-label</code> that matches the tooltip text. Icons are <code>aria-hidden=&quot;true&quot;</code>.</>],
            ['Toggles', <>Mute, view switches and watchlist use <code>aria-pressed</code>; the label doesn’t change, the state does.</>],
            ['Disabled', <>Use <code>aria-disabled=&quot;true&quot;</code> (not the <code>disabled</code> attribute) so the button stays focusable. On hover and focus, show a tooltip that says why and how to fix it (e.g. “Microphone is blocked. Allow mic access in your browser to talk.”), linked with <code>aria-describedby</code>. Clicks do nothing.</>],
            ['Loading', <><code>aria-busy=&quot;true&quot;</code>, block double clicks, keep width; announce the result in a toast (<code>role=&quot;status&quot;</code>).</>],
            ['Motion', <>Colour changes over {varName('button.pressed-duration')} with {varName('button.pressed-easing')}; press scale 0.96. Spinner and scale only under <code>prefers-reduced-motion: no-preference</code>.</>],
          ]}
        />
      </Section>
      <Section n="10" title="Tokens" intro="Every value comes from the style guide. Don’t use raw hex in button code.">
        <TokenTable />
      </Section>
      <Section n="11" title="Spec for code" intro="Machine-readable version of this page. AI tools (MCP, code assistants) and engineers should read this section first: it lists every allowed value, the rules that decide which button to use, and copy-paste code. Anything not listed here is not part of the system.">
        <SourceLinks
          items={[
            { label: 'Button source', path: 'src/components/Button' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <Spec />
      </Section>
    </main>
  );
}
