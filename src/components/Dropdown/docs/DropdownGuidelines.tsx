import { useState, type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Select } from '../Select';
import { Menu } from '../Menu';
import { dropdownIcons as ic } from '../icons';
import type { MenuEntry, SelectOption } from '../types';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './DropdownGuidelines.module.css';

/* Page chrome (section, table, cards, do/don't) is shared with the Button page via its CSS module; extra layout is in DropdownGuidelines.module.css. */

function Tok({ path }: { path: TokenPath }) {
  const meta = tokenMeta[path];
  const ref = meta.references?.[0];
  return (
    <>
      <code>{meta.cssVar}</code>
      <span className={base.mapped}>{ref ? `→ ${ref}` : String(tokenValues[path])}</span>
    </>
  );
}
const toks = (...paths: string[]) => (
  <div className={s.toks}>
    {paths.map((p) => (
      <div key={p}>
        <Tok path={p as TokenPath} />
      </div>
    ))}
  </div>
);

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`dd-${n}`}>
      <h2 id={`dd-${n}`} className={base.h2}>
        <span>{n}</span>
        {title}
      </h2>
      {intro ? <p className={base.intro}>{intro}</p> : null}
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className={base.tableWrap}>
      <table className={base.table}>
        <thead>
          <tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A card: a grey stage with the live component, then a title and a line of text below. */
function Card({ title, children, stage, text }: { title?: ReactNode; children: ReactNode; stage?: string; text: ReactNode }) {
  return (
    <div className={base.card}>
      <div className={`${s.stage} ${stage ?? ''}`}>{children}</div>
      <div className={base.cardBody}>
        {title ? <h3 className={base.cardTitle}>{title}</h3> : null}
        <p className={base.cardText}>{text}</p>
      </div>
    </div>
  );
}

function DoDont({ ok, text, children }: { ok: boolean; text: ReactNode; children: ReactNode }) {
  return (
    <div className={base.dd}>
      <div className={`${base.ddStage} ${s.ddStage}`}>{children}</div>
      <div className={`${base.ddFoot} ${ok ? '' : base.ddFootBad}`}>
        <span className={`${base.ddIcon} ${ok ? '' : base.ddIconBad}`} aria-hidden="true">
          {ok ? labelIcons.checkCircle : labelIcons.close}
        </span>
        <span>
          <b className={base.strong}>{ok ? 'Do.' : 'Don’t.'}</b> {text}
        </span>
      </div>
    </div>
  );
}

const Note = ({ n, label, side, top }: { n: number; label: string; side: 'left' | 'right'; top: string }) => (
  <span className={`${s.note} ${side === 'left' ? s.noteLeft : s.noteRight}`} style={{ top }}>
    <span className={s.numDark}>{n}</span>
    {label}
  </span>
);

/* ---------- Example data, taken from SkillWiz screens ---------- */

const classrooms: SelectOption[] = [
  { value: 'all', label: 'All classrooms', group: 'Your classrooms' },
  { value: 'lpu-class', label: 'LPU_Class', group: 'Your classrooms' },
  { value: 'lpu', label: 'LPU_', description: '200 students', group: 'Your classrooms' },
  { value: 'lpu-b', label: 'LPU_Batch_B', description: '42 students', group: 'Your classrooms' },
  { value: 'lpu-arch', label: 'LPU_Archived', description: '42 students', disabled: true, disabledReason: 'This class has ended', group: 'Archived' },
];
const sortOptions: SelectOption[] = [
  { value: 'marks-high', label: 'Marks · high to low' },
  { value: 'marks-low', label: 'Marks · low to high' },
  { value: 'percentile', label: 'Percentile' },
  { value: 'genuinity', label: 'Genuinity score' },
  { value: 'newest', label: 'Submitted · newest' },
];
const reviewOptions: SelectOption[] = [
  { value: 'to-review', label: 'To review' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'cleared', label: 'Cleared' },
  { value: 'no-review', label: 'No review' },
];
const students: SelectOption[] = [
  { value: 'achintya', label: 'Achintya Sharma', description: 'VK3456789 · LPU_Class' },
  { value: 'achal', label: 'Achal Verma', description: 'VK3456712 · LPU_Batch_B' },
];
const manage = { label: 'Manage classrooms', icon: ic.plus, onSelect: () => undefined };

const rowActions: MenuEntry[] = [
  { id: 'message', label: 'Message student', icon: ic.message },
  { id: 'csv', label: 'Download CSV', icon: ic.download, shortcut: '⌘D' },
  { id: 'dup', label: 'Duplicate assessment', icon: ic.copy },
  { type: 'divider' },
  { id: 'delete', label: 'Delete assessment', icon: ic.trash, destructive: true },
];
const anatomyMenu: MenuEntry[] = [
  { id: 'all', label: 'All classrooms', icon: ic.eye },
  { id: 'message', label: 'Message student', icon: ic.message },
  { id: 'download', label: 'Download answers', icon: ic.download },
  { id: 'copy', label: 'Copy user ID', icon: ic.copy },
  { type: 'divider' },
  { id: 'flag', label: 'Flag attempts', icon: ic.flag, items: [{ id: 'flag-one', label: 'This attempt' }, { id: 'flag-all', label: 'All attempts' }] },
  { type: 'divider' },
  { id: 'delete', label: 'Delete attempts', icon: ic.trash, destructive: true },
];

function SingleDemo() {
  const [v, setV] = useState<string | null>('lpu-class');
  return <Select label="Classroom" options={classrooms} value={v} onChange={setV} action={manage} />;
}

export function DropdownGuidelines() {
  return (
    <main className={base.page} id="main">
      <header>
        <p className={base.eyebrow}>SkillWiz design system · Components</p>
        <h1 className={base.title}>Select, dropdown &amp; menu</h1>
        <p className={base.lead}>
          Two jobs that share one floating panel. A select holds a value (classroom, sort order, students). A menu runs a command (view, download, delete). The trigger is our text input; the panel is the same for both. AI tools: start with section 10, which holds the spec for code.
        </p>
        <p className={s.meta}>Added 22 Nov 2026. From the result list filters, the top nav location selector and the More and avatar menus. Section 08 lists what differs today.</p>
      </header>

      <Section n="01" title="Anatomy" intro={<>A select open on its options (left) and an action menu open from <b>⋯</b> (right).</>}>
        <div className={s.anaCard}>
          <div className={s.anaGrid}>
            <div className={s.anaSide} aria-hidden="true">
              <Note n={1} label="Label" side="left" top="calc(var(--sw-space-4) * 1)" />
              <Note n={2} label="Trigger" side="left" top="calc(var(--sw-space-32) * 1 + var(--sw-space-4))" />
              <Note n={4} label="Panel · 4px gap" side="left" top="calc(var(--sw-space-32) * 2 + var(--sw-space-12))" />
              <Note n={7} label="Description" side="left" top="calc(var(--sw-space-64) * 3 + var(--sw-space-4))" />
              <Note n={9} label="Divider" side="left" top="calc(var(--sw-space-64) * 5 + var(--sw-space-20))" />
            </div>
            <Select label="Classroom" options={classrooms} value="lpu-class" open staticPanel action={manage} />
            <div className={s.anaSide} aria-hidden="true">
              <Note n={3} label="Chevron · flips when open" side="right" top="calc(var(--sw-space-32) * 1 + var(--sw-space-4))" />
              <Note n={5} label="Group header" side="right" top="calc(var(--sw-space-32) * 2 + var(--sw-space-12))" />
              <Note n={6} label="Selected · check" side="right" top="calc(var(--sw-space-64) * 2 + var(--sw-space-20))" />
              <Note n={8} label="Disabled option" side="right" top="calc(var(--sw-space-64) * 4 + var(--sw-space-48))" />
              <Note n={10} label="Action at the end" side="right" top="calc(var(--sw-space-64) * 5 + var(--sw-space-48))" />
            </div>
          </div>
          <div className={s.anaMenu}>
            <p className={s.menuHead}>Action menu</p>
            <div className={s.menuTrigger}><Menu iconLabel="More actions" entries={anatomyMenu} open staticPanel align="end" /></div>
          </div>
        </div>

        <div className={s.anaList}>
          <ol className={s.legend}>
            {[
              ['Label', 'Above the trigger, like every field.'],
              ['Trigger', 'Looks like a text input with a chevron, so people know it holds a value. Shows the chosen value or a placeholder.'],
              ['Chevron', 'Points down when closed, up when open.'],
              ['Panel', 'Opens 4px below; flips above when there isn’t room. Never wider than 360px.'],
              ['Group header', 'Only when there are two or more groups.'],
              ['Selected option', 'Blue text and a check, so it reads without colour too.'],
              ['Description', 'One short line when the label alone isn’t enough (counts, dates).'],
              ['Disabled option', 'Stays visible so people know it exists; the description says why.'],
              ['Divider', 'Separates actions from options, or groups of menu actions.'],
              ['Action at the end', 'A related command such as “Manage classrooms”, after a divider.'],
            ].map(([t, d], i) => (
              <li key={t}>
                <span className={s.numDark}>{i + 1}</span>
                <span><b className={base.strong}>{t}</b> — {d}</span>
              </li>
            ))}
          </ol>
          <div className={s.spec}>
            <div className={s.specHead}>
              <b className={base.strong}>Component spec · Select &amp; Menu</b>
              <span>The trigger is the Text input field</span>
            </div>
            <Table
              head={['Property', 'Value']}
              rows={[
                ['Trigger', <>Same box as Text input: S 28 · <b>M 36</b> · L 44, 1px <code>border-control</code>, <code>radius-control</code>, padding 0 12 · chevron 16px <code>text-muted</code></>],
                ['Open trigger', <><code>focus-outline</code> + 1px ring · chevron flips up</>],
                ['Panel', <><code>surface-default</code> · 1px <code>border-default</code> · <code>radius-tile</code> 8px · <code>shadow-overlay</code> · padding 4 · 4px below the trigger</>],
                ['Panel width', 'At least the trigger’s width; menus 200–280px'],
                ['Panel height', 'Max 320px (about 8 options), then scrolls inside'],
                ['Option', <>36px min · 0 12px · <code>radius-control</code> · 14 / 21 · <code>text-body</code> (S: 32px, 12px)</>],
                ['Hover / keyboard', <><code>surface-muted</code> on the active option</>],
                ['Selected', <><code>action-text</code>, semibold, 16px check at the end</>],
                ['Description', <>12 / 18 <code>text-muted</code> under the label</>],
                ['Group header', <>12 / 18 bold, uppercase, <code>text-muted</code>, 8 12 4 padding</>],
                ['Divider', <>1px <code>border-default</code>, full width, 4px above and below</>],
                ['Destructive item', <><code>feedback-danger-text</code>, icon <code>feedback-danger-solid</code>, hover <code>feedback-danger-subtle</code>; always last</>],
                ['Layer', <><code>layer-dropdown</code> 200</>],
              ]}
            />
          </div>
        </div>
      </Section>

      <Section n="02" title="Variants" intro="Three ways to pick a value, one way to run a command.">
        <div className={`${base.cards} ${s.cols4}`}>
          <Card title="Select" text="Pick one from a fixed list of 6–15. Sort, classroom, location.">
            <Select label="Sort by" options={sortOptions} value="marks-high" placeholder="Select one…" open staticPanel />
          </Card>
          <Card title="Multi-select" text="Pick several. Checkboxes in the list, chips in the trigger (2, then “+N”). Select all / Clear at the bottom.">
            <Select multiple label="Review status" options={reviewOptions} value={['to-review', 'flagged', 'cleared']} open staticPanel forceActive="cleared" />
          </Card>
          <Card title="Searchable select" text="For long lists (over 15): students, questions, colleges. Typing filters and highlights the match; the count shows how many match.">
            <Select searchable label="Student" options={students} value={null} searchPlaceholder="Search by name or ID" countNoun="students" totalCount={120} open staticPanel />
          </Card>
          <Card title="Action menu" text={<>Not a value: a list of commands. Opens from a button or <b>⋯</b>. Icons, shortcuts, dividers; destructive last, in red.</>} stage={s.stageEnd}>
            <Menu label="Actions" entries={rowActions} open staticPanel align="end" />
          </Card>
        </div>
      </Section>

      <Section n="03" title="Which control?" intro="Pick by how many options there are and whether people need to compare them.">
        <div className={`${base.cards} ${s.cols4}`}>
          <Card title="2–4 options → Segmented" text="All choices visible, one click. Switching a view." stage={s.stageCenter}>
            <span className={s.seg}><span className={s.segItem} data-on>Marks</span><span className={s.segItem}>Time</span><span className={s.segItem}>Score</span></span>
          </Card>
          <Card title="2–5 options in a form → Radio" text="People compare choices before picking." stage={s.stageCenter}>
            <span className={s.radios}>
              <span className={s.radio}><span className={s.dot} data-on />Practice</span>
              <span className={s.radio}><span className={s.dot} />Mock test</span>
              <span className={s.radio}><span className={s.dot} />Final exam</span>
            </span>
          </Card>
          <Card title="6–15 options → Select" text="Saves space; the list is short enough to scan." stage={s.stageCenter}>
            <Select label="Sort by" options={sortOptions} value="marks-high" />
          </Card>
          <Card title="Over 15 → Searchable" text="Typing is faster than scrolling." stage={s.stageCenter}>
            <Select searchable label="Student" options={students} value={null} searchPlaceholder="Search by name or ID" />
          </Card>
        </div>
      </Section>

      <Section n="04" title="States" intro="Trigger states match Text input; option states live in the panel.">
        <div className={`${base.cards} ${s.cols4}`}>
          <Card text={<><b className={base.strong}>Placeholder</b>: “Select…” or “All classrooms” in <code>text-disabled</code>.</>}>
            <Select label="Classroom" options={classrooms} value={null} />
          </Card>
          <Card text={<><b className={base.strong}>Hover</b>: <code>border-strong</code>.</>}>
            <Select label="Classroom" options={classrooms} value="lpu-class" forceState="hover" />
          </Card>
          <Card text={<><b className={base.strong}>Open / focus</b>: focus border + ring, chevron up.</>}>
            <Select label="Classroom" options={classrooms} value="lpu-class" forceState="focus" />
          </Card>
          <Card text={<><b className={base.strong}>Error</b>: red border; message says what to pick.</>}>
            <Select label="Classroom" options={classrooms} value={null} error="Choose a classroom to publish." />
          </Card>
          <Card text={<><b className={base.strong}>Disabled</b>: muted; helper says why.</>}>
            <Select label="Classroom" options={classrooms} value="lpu-class" disabled helper="Only admins can change this." />
          </Card>
          <Card text={<><b className={base.strong}>Small · 28px</b>: toolbars and table filters.</>}>
            <Select label="Classroom" size="sm" options={classrooms} value="lpu-class" />
          </Card>
          <Card text={<><b className={base.strong}>Large · 44px</b>: sign-up and the student exam.</>}>
            <Select label="Classroom" size="lg" options={classrooms} value="lpu-class" />
          </Card>
          <Card text={<><b className={base.strong}>Long value</b>: truncates with an ellipsis; full text in a tooltip.</>}>
            <Select label="Classroom" options={[{ value: 'x', label: 'Lovely Professional University, Phagwara, Punjab' }]} value="x" />
          </Card>
        </div>

        <h3 className={base.h3}>Options</h3>
        <div className={`${base.cards} ${s.cols3}`}>
          <Card text={<><b className={base.strong}>Hover / keyboard</b>: one option is “active” at a time, by mouse or arrow keys; <code>surface-muted</code>.</>}>
            <Select label="Sort by" options={sortOptions.slice(2)} value={null} open staticPanel forceActive="genuinity" />
          </Card>
          <Card text={<><b className={base.strong}>Selected</b>: blue text + check at the end. Selected and active: <code>surface-selected</code>.</>}>
            <Select label="Sort by" options={sortOptions.slice(0, 3)} value="marks-high" open staticPanel forceActive="marks-high" />
          </Card>
          <Card text={<><b className={base.strong}>Destructive</b>: red text and icon, red tint on hover. Opens a confirm dialog; never acts directly.</>}>
            <Menu label="Actions" entries={[{ id: 'copy', label: 'Copy attempt', icon: ic.copy }, { type: 'divider' }, { id: 'del', label: 'Delete attempt', icon: ic.trash, destructive: true }]} open staticPanel forceActive="del" />
          </Card>
          <Card text={<><b className={base.strong}>No results</b>: says what was searched and what to try.</>}>
            <Select searchable label="Student" options={[]} value={null} defaultQuery="xyz" countNoun="students" open staticPanel />
          </Card>
          <Card text={<><b className={base.strong}>Loading</b>: spinner and words in the panel; the trigger stays usable.</>}>
            <Select searchable label="Student" options={[]} value={null} defaultQuery="Arch" loading loadingLabel="Loading students" open staticPanel />
          </Card>
          <Card text={<><b className={base.strong}>Submenu</b>: opens to the right on hover or →. One level only.</>}>
            <Menu label="Actions" entries={[{ id: 'export', label: 'Export CSV', icon: ic.download, items: [{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel (.xlsx)' }, { id: 'pdf', label: 'PDF report' }] }, { id: 'link', label: 'Copy link', icon: ic.copy }]} open staticPanel openSubmenu="export" />
          </Card>
        </div>
      </Section>

      <Section n="05" title="Behaviour" intro="Opening, moving, choosing, closing.">
        <Table
          head={['Rule', 'Behaviour']}
          rows={[
            ['Open', <>Click or <kbd>Space</kbd> / <kbd>Enter</kbd> / <kbd>↓</kbd> on the trigger. The selected option is active and scrolled into view.</>],
            ['Move', <><kbd>↑</kbd> <kbd>↓</kbd> move, <kbd>Home</kbd> / <kbd>End</kbd> jump, typing a letter jumps to the next match. The list does not wrap.</>],
            ['Choose', <><kbd>Enter</kbd> or click picks and closes (single). Multi-select stays open; <kbd>Space</kbd> toggles.</>],
            ['Close', <><kbd>Esc</kbd>, <kbd>Tab</kbd>, or a click outside closes without changing the value, and focus returns to the trigger.</>],
            ['Position', 'Opens below, 4px gap; flips above when fewer than 200px are left below. Left edges line up with the trigger.'],
            ['Long lists', 'Max 320px tall, scrolls inside. Over 15 options: switch to searchable.'],
            ['Applying', 'Filters apply as soon as an option is chosen; no Apply button for a single select.'],
            ['Menus', 'Items run a command and close. Destructive items open a confirm dialog. Disabled items stay, with a reason in a tooltip.'],
          ]}
        />
        <div className={`${base.cards} ${s.cols3}`}>
          <Card text="Try it: open the select, then use the arrow keys and type a letter.">
            <SingleDemo />
          </Card>
        </div>
      </Section>

      <Section n="06" title="Usage guidelines" intro="Four rules, each from something on a SkillWiz screen today.">
        <div className={s.usage}>
          <DoDont ok text="Start with a real default (“All classrooms”) when one makes sense.">
            <Select label="Classroom" options={classrooms} value="all" />
          </DoDont>
          <DoDont ok={false} text="Use “-- Select --”. It reads like a broken value.">
            <Select label="Classroom" options={classrooms} value={null} placeholder="-- Select --" />
          </DoDont>
          <DoDont ok text="Use a segmented control for 2–4 options.">
            <span className={s.seg}><span className={s.segItem} data-on>Marks</span><span className={s.segItem}>Time</span><span className={s.segItem}>Score</span></span>
          </DoDont>
          <DoDont ok={false} text="Hide 2 options behind a dropdown.">
            <Select label="Sort by" options={sortOptions.slice(0, 2)} value="marks-high" open staticPanel />
          </DoDont>
          <DoDont ok text="Put delete last, after a divider, in red.">
            <Menu label="Actions" entries={[{ id: 'dl', label: 'Download answers' }, { type: 'divider' }, { id: 'del', label: 'Delete attempt', destructive: true }]} open staticPanel />
          </DoDont>
          <DoDont ok={false} text="Put delete between everyday actions, in the same colour.">
            <Menu label="Actions" entries={[{ id: 'view', label: 'View report' }, { id: 'del', label: 'Delete attempt' }, { id: 'dl', label: 'Download answers' }]} open staticPanel />
          </DoDont>
          <DoDont ok text="Show unavailable options disabled, with a reason.">
            <Select label="Classroom" options={[classrooms[1]!, { value: 'arch', label: 'LPU_Archived', description: 'Ended 2025', disabled: true, disabledReason: 'This class has ended' }]} value="lpu-class" open staticPanel />
          </DoDont>
          <DoDont ok={false} text="Silently hide them. People think the class was deleted.">
            <Select label="Classroom" options={[classrooms[1]!, classrooms[3]!]} value="lpu-class" open staticPanel />
          </DoDont>
        </div>
      </Section>

      <Section n="07" title="Accessibility" intro="Listbox for values, menu for commands.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Select', <>A <code>&lt;button aria-haspopup=&quot;listbox&quot; aria-expanded&gt;</code> + <code>role=&quot;listbox&quot;</code> with <code>role=&quot;option&quot; aria-selected</code>. A native <code>&lt;select&gt;</code> is fine on phones.</>],
            ['Searchable', <><code>role=&quot;combobox&quot;</code> input with <code>aria-controls</code> and <code>aria-activedescendant</code> for the active option; result count in a polite live region.</>],
            ['Menu', <><code>&lt;button aria-haspopup=&quot;menu&quot;&gt;</code> + <code>role=&quot;menu&quot;</code> / <code>menuitem</code>; ⋯ buttons are named (“More actions for Achintya Sharma”).</>],
            ['Label', 'The trigger’s name includes the label and value: “Classroom, LPU_Class”.'],
            ['Selected', 'Shown by check + colour + weight, never colour alone.'],
            ['Focus', <>Focus stays on the trigger or search field; the active option is shown with <code>surface-muted</code>. <kbd>Esc</kbd> returns focus to the trigger. In a menu, focus moves onto the items.</>],
            ['Targets', 'Options at least 32px tall; ⋯ button 36px.'],
            ['Motion', <>Panel fades in over 120ms, no slide; none under <code>prefers-reduced-motion</code>.</>],
          ]}
        />
      </Section>

      <Section n="08" title="Screens to align" intro="Where selects and menus differ today.">
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Result list filters (Wall V2 · 08)', 'Classroom, Sort by, Review: 36px, padding 0 10px, custom chevron', 'Select M, padding 0 12px; Review becomes a multi-select'],
            ['Top nav location selector', 'Own 36px style with pin icon', 'Select M with leading pin icon (same trigger)'],
            ['Top nav “More” and avatar menus', 'Menu specified on the Top navigation bar page only', 'Use this Action menu spec'],
            ['Result list row “View report”', 'One button per row, no other actions', 'Add a ⋯ menu for Message, Download, Flag, Delete'],
          ]}
        />
      </Section>

      <Section n="09" title="Tokens" intro="Every value below is a token; nothing is hard-coded. The PDF’s older names are mapped in the note under the table.">
        <Table
          head={['Element', 'Tokens']}
          rows={[
            ['Trigger', toks('select.height-sm', 'select.height-md', 'select.height-lg', 'select.border', 'select.border-hover', 'select.border-open', 'select.ring-color', 'select.border-error', 'select.radius', 'select.padding-x')],
            ['Trigger text', toks('select.text', 'select.text-placeholder', 'select.text-disabled', 'select.bg-disabled', 'select.chevron-color', 'select.font-size')],
            ['Label and helper', toks('select.label-text', 'select.label-font-size', 'select.helper-text', 'select.error-text', 'select.error-icon')],
            ['Chips (multi)', toks('select.chip-bg', 'select.chip-border', 'select.chip-radius', 'select.chip-height', 'select.chip-font-size')],
            ['Panel', toks('dropdown.panel-bg', 'dropdown.panel-border', 'dropdown.panel-radius', 'dropdown.panel-shadow', 'dropdown.panel-padding', 'dropdown.panel-offset', 'dropdown.panel-z-index', 'dropdown.panel-max-height', 'dropdown.panel-max-width')],
            ['Option', toks('dropdown.option-font-size', 'dropdown.option-line-height', 'dropdown.option-text', 'dropdown.option-radius', 'dropdown.option-padding-x', 'dropdown.option-min-height', 'dropdown.option-min-height-sm')],
            ['Active / selected', toks('dropdown.option-active-bg', 'dropdown.option-selected-bg', 'dropdown.option-selected-text', 'dropdown.option-selected-weight', 'dropdown.check-color')],
            ['Destructive', toks('dropdown.destructive-text', 'dropdown.destructive-icon', 'dropdown.destructive-hover-bg')],
            ['Secondary text', toks('dropdown.description-text', 'dropdown.description-font-size', 'dropdown.description-line-height', 'dropdown.group-text', 'dropdown.shortcut-text')],
            ['Checkbox (multi)', toks('dropdown.checkbox-border', 'dropdown.checkbox-checked-bg', 'dropdown.checkbox-check-color', 'dropdown.checkbox-size')],
            ['Search match', toks('dropdown.match-bg')],
            ['Motion', toks('dropdown.fade-duration', 'dropdown.fade-easing')],
            ['Action menu', toks('menu.trigger-size', 'menu.trigger-radius', 'menu.trigger-border', 'menu.submenu-offset')],
          ]}
        />
        <p className={base.cardText}>
          <b className={base.strong}>New in this component:</b> primitives <code>size.28 / 36 / 44</code>, <code>shadow.md</code> and <code>z-index.200</code>; semantic <code>size.control.sm / md / lg</code>, <code>shadow.overlay</code>, <code>layer.dropdown</code> and <code>type.helper</code>. <b className={base.strong}>PDF name → token:</b> <code>border-subtle</code> → <code>border-default</code>; <code>text-secondary</code> → <code>text-muted</code>; <code>text-link</code> → <code>action-text</code>; <code>bg-selected</code> → <code>surface-selected</code>; <code>status-error*</code> → <code>feedback-danger-*</code>; <code>status-warning-subtle</code> → <code>feedback-warning-subtle</code>; <code>radius-md</code> → <code>radius-control</code>; <code>radius-lg</code> → <code>radius-tile</code>.
        </p>
      </Section>

      <Section n="10" title="Spec for code" intro="Machine-readable version of this page. AI tools (MCP, code assistants) and engineers should read this section first: it lists every allowed value, the rule that decides which control to use, and copy-paste code. Anything not listed here is not part of the system.">
        <SourceLinks
          items={[
            { label: 'Select and Menu source', path: 'src/components/Dropdown' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />

        <h3 className={base.h3}>A · Decision order (pick the first that matches)</h3>
        <ol className={base.decision}>
          <li><span className={base.num}>1</span><span>Does it run a command rather than hold a value? → <b>Menu</b></span></li>
          <li><span className={base.num}>2</span><span>2–4 options, all worth seeing at once? → <b>Segmented control</b>. 2–5 in a form? → <b>Radio</b></span></li>
          <li><span className={base.num}>3</span><span>6–15 options? → <b>Select</b> (add <code>multiple</code> to pick several)</span></li>
          <li><span className={base.num}>4</span><span>More than 15, or people know what they’re looking for? → <b>Select</b> with <code>searchable</code></span></li>
        </ol>

        <h3 className={base.h3}>B · Usage (copy-paste)</h3>
        <pre className={s.pre}>{`import { Select, Menu } from '@skillwiz/design-system';

// Single select. A real default beats “-- Select --”.
const [room, setRoom] = useState<string | null>('all');
<Select
  label="Classroom"
  options={[
    { value: 'all', label: 'All classrooms' },
    { value: 'lpu', label: 'LPU_Class', description: '200 students' },
    { value: 'arch', label: 'LPU_Archived', description: 'Ended 2025', disabled: true, disabledReason: 'This class has ended' },
  ]}
  value={room}
  onChange={setRoom}
  action={{ label: 'Manage classrooms', icon: <PlusIcon />, onSelect: openManager }}
/>

// Multi-select: chips in the trigger (2, then “+N”), Select all and Clear at the bottom.
<Select multiple label="Review status" options={statuses} value={picked} onChange={setPicked} />

// Searchable: type to filter, the count shows “2 of 120 students”.
<Select searchable label="Student" options={matches} value={student} onChange={setStudent}
  searchPlaceholder="Search by name or ID" countNoun="students" totalCount={120} onQueryChange={fetchStudents} />

// Trigger states
<Select label="Classroom" options={rooms} value={null} error="Choose a classroom to publish." />
<Select label="Classroom" options={rooms} value="lpu" disabled helper="Only admins can change this." />`}</pre>
        <pre className={s.pre}>{`// Action menu. Destructive last, after a divider; it opens a confirm dialog, never acts directly.
<Menu
  label="Actions"
  entries={[
    { id: 'message', label: 'Message student', icon: <MessageIcon /> },
    { id: 'csv', label: 'Download CSV', icon: <DownloadIcon />, shortcut: '⌘D' },
    { type: 'divider' },
    { id: 'delete', label: 'Delete assessment', icon: <TrashIcon />, destructive: true, onSelect: confirmDelete },
  ]}
/>

// Row menu: the icon button needs a specific name.
<Menu iconLabel="More actions for Achintya Sharma" align="end" entries={rowActions} />`}</pre>

        <h3 className={base.h3}>C · Component props</h3>
        <Table
          head={['Component', 'Prop', 'Values', 'Default', 'Rule']}
          rows={[
            ['Select', <code key="a">label</code>, <code key="b">string</code>, '—', 'Required. Above the trigger and part of its accessible name'],
            ['', <code key="a">options</code>, <code key="b">SelectOption[]</code>, '—', 'value, label, description?, disabled?, disabledReason?, group?'],
            ['', <code key="a">value / onChange</code>, <code key="b">string | null · string[] with multiple</code>, '—', 'Controlled. Applies as soon as an option is chosen'],
            ['', <code key="a">multiple</code>, <code key="b">boolean</code>, <code key="c">false</code>, 'Checkboxes in the list, chips in the trigger'],
            ['', <code key="a">searchable</code>, <code key="b">boolean</code>, <code key="c">false</code>, 'Use over 15 options'],
            ['', <code key="a">size</code>, <code key="b">sm | md | lg</code>, <code key="c">md</code>, 'Small 28 for toolbars; large 44 for sign-up and the exam'],
            ['', <code key="a">placeholder</code>, <code key="b">string</code>, <code key="c">Select…</code>, 'Never “-- Select --”'],
            ['', <code key="a">error / helper</code>, <code key="b">string</code>, '—', 'Error says what to pick; helper on a disabled select says why'],
            ['', <code key="a">disabled / loading</code>, <code key="b">boolean</code>, <code key="c">false</code>, 'Loading shows a spinner and words in the panel; the trigger stays usable'],
            ['', <code key="a">leadingIcon</code>, <code key="b">ReactNode</code>, '—', 'e.g. the pin on the location selector'],
            ['', <code key="a">action</code>, <code key="b">{'{ label, icon?, onSelect }'}</code>, '—', 'A related command after a divider'],
            ['', <code key="a">align</code>, <code key="b">start | end</code>, <code key="c">start</code>, 'Which edge the panel lines up with'],
            ['Menu', <code key="a">label | iconLabel</code>, <code key="b">string</code>, '—', 'One of the two. iconLabel makes the ⋯ button and must be specific'],
            ['', <code key="a">entries</code>, <code key="b">MenuEntry[]</code>, '—', 'item: id, label, icon?, shortcut?, destructive?, disabled?, disabledReason?, items? (one level) · divider: { type: "divider" }'],
            ['', <code key="a">align</code>, <code key="b">start | end</code>, <code key="c">start</code>, 'Use end when the trigger sits at the right edge'],
          ]}
        />

        <h3 className={base.h3}>D · Rules</h3>
        <div className={`${base.cards} ${base.cols2} ${base.rules}`}>
          <div className={base.panel}>
            <h4>MUST</h4>
            <ul>
              <li>Pick the control with the decision order above.</li>
              <li>Give every select a label and a real default or placeholder.</li>
              <li>Keep unavailable options visible, disabled, with a reason.</li>
              <li>Put destructive menu items last, after a divider, in red.</li>
              <li>Use only the tokens in section 09; no raw hex, px colours or new radii.</li>
            </ul>
          </div>
          <div className={base.panel}>
            <h4>MUST NOT</h4>
            <ul>
              <li>Use a dropdown for 2–4 options, or a plain select over 15.</li>
              <li>Show “-- Select --” or hide options people expect to see.</li>
              <li>Let a destructive item act without a confirm dialog.</li>
              <li>Nest menus more than one level.</li>
              <li>Add an Apply button to a single select.</li>
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
