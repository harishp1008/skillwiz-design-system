import { useState, type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Checkbox, CheckboxGroup } from '../Checkbox';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './CheckboxGuidelines.module.css';

/* Page chrome (section, table, cards, do/don't) is shared with the Button page via its CSS module; extra layout is in CheckboxGuidelines.module.css. */

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
const cb = (...p: string[]) => toks(...p.map((x) => `checkbox.${x}`));

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`cb-${n}`}>
      <h2 id={`cb-${n}`} className={base.h2}>
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

function Card({ title, children, text, white }: { title?: ReactNode; children: ReactNode; text: ReactNode; white?: boolean }) {
  return (
    <div className={base.card}>
      <div className={`${s.stage} ${white ? s.stageWhite : ''}`}>{children}</div>
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

/** Parent + children with select all. The parent shows a dash when only some are checked. */
function SelectAllGroup({ legend, items, initial, meta, mixedParent = true }: { legend: string; items: string[]; initial: string[]; meta?: boolean; mixedParent?: boolean }) {
  const [on, setOn] = useState<string[]>(initial);
  const all = on.length === items.length;
  const some = on.length > 0 && !all;
  return (
    <CheckboxGroup legend={legend} meta={meta ? `${on.length} of ${items.length}` : undefined}>
      <Checkbox label="Select all" checked={all} indeterminate={mixedParent && some} onChange={(c) => setOn(c ? items : [])} />
      <div className={s.indent}>
        {items.map((i) => (
          <Checkbox key={i} label={i} checked={on.includes(i)} onChange={(c) => setOn(c ? [...on, i] : on.filter((x) => x !== i))} />
        ))}
      </div>
    </CheckboxGroup>
  );
}

function TableDemo() {
  const rows: [string, string][] = [['Achintya Sharma', '4 / 6'], ['Achal Verma', '5 / 6'], ['Kaushal R.', '3 / 6']];
  const [on, setOn] = useState<string[]>(['Achintya Sharma', 'Achal Verma']);
  const all = on.length === rows.length;
  return (
    <div className={s.panel}>
      <div className={s.bar}>
        <Checkbox size="sm" aria-label="Select all on this page" checked={all} indeterminate={on.length > 0 && !all} onChange={(c) => setOn(c ? rows.map((r) => r[0]) : [])} label={`${on.length} selected`} />
        <span>Download</span>
      </div>
      {rows.map(([n, m]) => (
        <div key={n} className={s.trow} data-on={on.includes(n) || undefined}>
          <Checkbox size="sm" label={n} checked={on.includes(n)} onChange={(c) => setOn(c ? [...on, n] : on.filter((x) => x !== n))} />
          <span className={s.num}>{m}</span>
        </div>
      ))}
    </div>
  );
}

function CardDemo() {
  const [on, setOn] = useState<string[]>(['A', 'C']);
  const opts: [string, string][] = [['A', 'A stack is LIFO'], ['B', 'A queue is LIFO'], ['C', 'Both can be built on an array']];
  return (
    <CheckboxGroup legend="Select all that apply">
      {opts.map(([k, t]) => (
        <Checkbox key={k} variant="card" marker={k} label={t} checked={on.includes(k)} onChange={(c) => setOn(c ? [...on, k] : on.filter((x) => x !== k))} />
      ))}
    </CheckboxGroup>
  );
}

const Radios = () => (
  <span className={s.radios}>
    {['Practice', 'Mock test', 'Final exam'].map((l, i) => (
      <span key={l} className={s.radio}><span className={s.dot} data-on={i === 0 || undefined} />{l}</span>
    ))}
  </span>
);
const Toggle = ({ label }: { label: string }) => (
  <span className={s.toggle}><span className={s.track}><span className={s.thumb} /></span>{label}</span>
);

export function CheckboxGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Checkbox</h1>
        <p className={base.lead}>
          For yes/no choices and picking any number from a list. Used in forms, filters, multi-select menus, table rows and multi-answer exam questions.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="The M checkbox at 3×, with its label and description.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.bigStage}>
              <div className={s.big}>
                <Checkbox label="I’ve read the instructions" description="Required before you can start the test." defaultChecked />
              </div>
            </div>
            <ol className={s.legend}>
              {[
                ['Box', '20 × 20 (M) or 16 × 16 (S), radius 4px (3px at S). Unchecked: white with a 1.5px border.'],
                ['Hit area', 'The box and the label are one label, so the whole row is clickable; at least 32px tall.'],
                ['Check mark', 'White on the primary fill. A dash instead of the check when only some children are checked.'],
                ['Label', 'Says what is true when it’s ticked: “Send results by email”, not “Email”.'],
                ['Description', 'Optional one line under the label for consequences or details.'],
                ['Gap', '10px between box and label (8px at S). The top of the box lines up with the first line of text.'],
              ].map(([t, d], i) => (
                <li key={t}>
                  <span className={s.numDark}>{i + 1}</span>
                  <span><b className={base.strong}>{t}.</b> {d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Table
          head={['Property', 'Value']}
          rows={[
            ['Box', 'M 20 · S 16 · radius 4px (3px at S)'],
            ['Unchecked', 'White · 1.5px inset border in the input border colour'],
            ['Hover', 'Border darkens to muted text · grey fill'],
            ['Checked', 'Action fill · white mark, 14px (12 at S), 3px stroke'],
            ['Indeterminate', 'Same fill, a 12px dash instead of the check'],
            ['Focus', '2px focus outline, 2px offset · keyboard only'],
            ['Error', '1.5px danger border + message in danger text under the label'],
            ['Disabled', 'Box muted with a subtle border · checked: grey fill · label disabled text'],
            ['Label', 'M 14 / 20 · S 12 / 18 · gap 10 (S 8)'],
            ['Description', '12 / 18, muted text, 2px under the label'],
            ['Group', '12px between items · group label 14 semibold, 8px above the first item'],
            ['Motion', 'A short fade on background and border only'],
          ]}
        />
      </Section>

      <Section n="02" title="Variants" intro="One control, four places it appears.">
        <div className={s.cards4}>
          <Card title="Single" text="One yes/no on its own: consent, “I’ve read”, “Send by email”. Instructions page, sign-up.">
            <Checkbox label="I’ve read the instructions and I’m ready to begin" defaultChecked />
          </Card>
          <Card title="Group + Select all" text="Several independent choices under one label. A parent checkbox shows all, none, or some (dash).">
            <SelectAllGroup legend="Review status" items={['To Review', 'Flagged', 'Cleared', 'No Review']} initial={['To Review', 'Flagged', 'Cleared']} meta />
          </Card>
          <Card title="Table row (S)" text="Picks rows for a bulk action. The header box selects the page; the bar shows the count and actions.">
            <TableDemo />
          </Card>
          <Card title="Option card" text="Multi-answer exam questions. The whole card is the hit area; checked cards get a blue border and tint.">
            <CardDemo />
          </Card>
        </div>
      </Section>

      <Section n="03" title="States" intro="Every state at M size.">
        <div className={s.cards4}>
          <Card white title="Unchecked" text="White box, input border."><Checkbox label="Send results by email" /></Card>
          <Card white title="Hover" text="Darker border, grey fill."><Checkbox label="Send results by email" forceState="hover" /></Card>
          <Card white title="Checked" text="Primary fill, white check."><Checkbox label="Send results by email" defaultChecked /></Card>
          <Card white title="Indeterminate" text="Some children checked. Click checks all."><Checkbox label="Select all" checked indeterminate onChange={() => undefined} /></Card>
          <Card white title="Focus" text="Keyboard focus ring, 2px offset."><Checkbox label="Send results by email" forceState="focus" /></Card>
          <Card white title="Error" text="Red border; the message says what to do."><Checkbox label="Send results by email" error="Tick this to start the test" /></Card>
          <Card white title="Disabled" text="Muted; the description says why."><Checkbox label="Record Grades" description="Upgrade to record grades" disabled /></Card>
          <Card white title="Disabled · checked" text="Grey fill keeps the value readable."><Checkbox label="Proctoring on" description="Set by your admin" disabled defaultChecked /></Card>
        </div>
      </Section>

      <Section n="04" title="Sizes" intro="Two sizes; the label size follows the box.">
        <div className={s.cols2}>
          <Card white title="M · 20px · default" text="Forms, settings, instructions, filters in a side panel. Label 14 / 20.">
            <Checkbox label="Send results by email" description="Students get their score when results are published." defaultChecked />
            <Checkbox label="Allow retakes" />
          </Card>
          <Card white title="S · 16px" text="Table rows, multi-select menus, dense filter lists. Label 12 / 18. Row stays 32px+ tall.">
            <Checkbox size="sm" label="To review" defaultChecked />
            <Checkbox size="sm" label="Flagged" />
            <Checkbox size="sm" label="Cleared" />
          </Card>
        </div>
      </Section>

      <Section n="05" title="Checkbox, radio or toggle?" intro="Pick by how many can be true and when it takes effect.">
        <div className={s.cards3}>
          <Card white title="Checkbox" text="Pick any number, including none. Saved when the form is submitted.">
            <Checkbox label="Send results by email" defaultChecked />
            <Checkbox label="Allow retakes" />
          </Card>
          <Card white title="Radio" text="Exactly one of 2–5 options that exclude each other.">
            <Radios />
          </Card>
          <Card white title="Toggle" text="A setting that takes effect right away, like a light switch. No Save button.">
            <Toggle label="Proctoring on" />
          </Card>
        </div>
      </Section>

      <Section n="06" title="Behaviour" intro="Clicking, keyboard, select all, and when the choice applies.">
        <Table
          head={['Rule', 'Behaviour']}
          rows={[
            ['Click', 'Clicking the box or the label toggles it. The row is the hit area.'],
            ['Keyboard', <>Tab moves to each checkbox; <kbd>Space</kbd> toggles. <kbd>Enter</kbd> does nothing (it submits the form).</>],
            ['Select all', 'Unchecked or mixed → click checks all children. All checked → click clears all. The parent shows a dash when some are checked.'],
            ['Table header', 'Selects the rows on this page. The bulk bar then offers “Select all 120 attempts”.'],
            ['When it applies', 'In forms: on Submit. In filters: right away, results update. In a multi-select menu: right away, menu stays open.'],
            ['Required', 'A required checkbox (consent, “I’ve read”) keeps the main button disabled with the reason under it; the error shows only if they try anyway.'],
            ['Labels', 'Positive wording, so ticked means yes: “Show results to students”, not “Hide results”.'],
          ]}
        />
      </Section>

      <Section n="07" title="Usage guidelines" intro="Four rules for labels and choosing the right control.">
        <div className={s.usage}>
          <DoDont ok text="Word it so ticked means yes."><Checkbox label="Show results to students" defaultChecked /></DoDont>
          <DoDont ok={false} text="Use negatives. People have to think twice."><Checkbox label="Don’t hide results from students" /></DoDont>
          <DoDont ok text="Use a toggle for a setting that applies instantly."><Toggle label="Proctoring on" /></DoDont>
          <DoDont ok={false} text="Use a checkbox when nothing else needs saving."><Checkbox label="Proctoring on" defaultChecked /></DoDont>
          <DoDont ok text="Show a dash when only some are picked.">
            <SelectAllGroup legend="Review" items={['To review', 'Flagged']} initial={['To review']} />
          </DoDont>
          <DoDont ok={false} text="Leave the parent empty when some children are ticked.">
            <SelectAllGroup legend="Review" items={['To review', 'Flagged']} initial={['To review']} mixedParent={false} />
          </DoDont>
          <DoDont ok text="Use radios when only one can be true."><Radios /></DoDont>
          <DoDont ok={false} text="Use checkboxes for options that exclude each other.">
            <Checkbox label="Practice" defaultChecked />
            <Checkbox label="Mock test" />
            <Checkbox label="Final exam" defaultChecked />
          </DoDont>
        </div>
      </Section>

      <Section n="08" title="Accessibility" intro="Native input, real labels, groups in a fieldset.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Element', <>A native <code>input type=&quot;checkbox&quot;</code> inside a <code>label</code>, styled; never a div.</>],
            ['Mixed', <>Set <code>indeterminate</code>. The component sets the DOM property, which exposes <code>aria-checked=&quot;mixed&quot;</code>.</>],
            ['Groups', <>A <code>fieldset</code> with a <code>legend</code> for the group label (“Review status”). Use <code>CheckboxGroup</code>.</>],
            ['Errors', <><code>aria-invalid</code> and <code>aria-describedby</code> point at the message. Done for you when you pass <code>error</code>.</>],
            ['Table rows', 'Each box is named: “Select Achintya Sharma”. The header box: “Select all on this page”.'],
            ['Contrast', 'An unchecked border needs 3 to 1 on white. The strong border colour is only 1.5 to 1, so the box uses the input border colour (3.07 to 1).'],
            ['Targets', 'Row at least 32px tall even at S, so the label counts as the target.'],
            ['Not colour only', 'Checked = fill + check mark; mixed = dash; error = border + icon + text.'],
          ]}
        />
      </Section>

      <Section n="09" title="Screens to align" intro="Where checkboxes differ or are missing today.">
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Instructions (00b and new 00r)', '20px box, browser default in 00b', 'Checkbox M; Start test disabled until ticked, reason under the button'],
            ['Multi-select menu (Select)', '16px box, strong border (1.5 to 1)', 'Checkbox S with the input border colour'],
            ['Result list (Wall V2 · 08)', 'No row selection; one action per row', 'Add Checkbox S per row + header box + bulk bar (Download, Message)'],
            ['Student exam · multi-answer MCQ', 'Same look as single-answer radio options', 'Option card with checkbox + “Select all that apply” above'],
          ]}
        />
      </Section>

      <Section n="10" title="Tokens" intro="One new semantic colour (the input border), one new primitive, and two size tokens. Everything else reuses existing tokens. Each row shows the component token and what it maps to.">
        <Table
          head={['Part', 'Tokens']}
          rows={[
            ['New', toks('color.border.input', 'size.checkbox.md', 'size.checkbox.sm')],
            ['Box', cb('size-md', 'size-sm', 'radius', 'radius-sm', 'border-width', 'bg', 'border', 'bg-hover', 'border-hover')],
            ['Checked and mixed', cb('bg-checked', 'bg-checked-hover', 'mark', 'mark-size-md', 'mark-size-sm', 'mark-stroke', 'dash-width', 'dash-width-sm')],
            ['Focus and motion', cb('focus-color', 'focus-width', 'focus-offset', 'duration', 'easing')],
            ['Error', cb('error-border', 'error-text', 'error-icon-size')],
            ['Disabled', cb('disabled-bg', 'disabled-border', 'disabled-checked-bg', 'disabled-checked-mark', 'disabled-text')],
            ['Text', cb('gap-md', 'gap-sm', 'row-min-height', 'label-text', 'label-font-size-md', 'label-line-height-md', 'label-font-size-sm', 'label-line-height-sm', 'label-weight', 'description-text', 'description-font-size', 'description-line-height', 'description-gap')],
            ['Group', cb('group-gap', 'group-legend-gap', 'group-legend-text', 'group-legend-font-size', 'group-legend-line-height', 'group-legend-weight')],
            ['Option card', cb('card-bg', 'card-border', 'card-bg-checked', 'card-border-checked', 'card-radius', 'card-padding-x', 'card-padding-y', 'card-gap', 'card-marker-text', 'card-marker-weight')],
          ]}
        />
      </Section>

      <Section n="11" title="Spec for code">
        <SourceLinks
          items={[
            { label: 'Checkbox source', path: 'src/components/Checkbox' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <pre className={s.pre}>{`import { Checkbox, CheckboxGroup } from '@/components';

<Checkbox label="Send results by email" description="Students get their score when results are published." />

<CheckboxGroup legend="Review status" meta="3 of 4">
  <Checkbox label="Select all" checked={all} indeterminate={some} onChange={toggleAll} />
  <Checkbox label="Flagged" checked={flagged} onChange={setFlagged} />
</CheckboxGroup>

<Checkbox size="sm" aria-label="Select Achintya Sharma" checked={on} onChange={setOn} />
<Checkbox variant="card" marker="A" label="A stack is LIFO" />`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">label</code>, 'ReactNode', 'Says what is true when ticked. Omit only with aria-label.'],
            [<code key="b">description</code>, 'ReactNode', 'One line under the label. When disabled, say why.'],
            [<code key="c">checked, defaultChecked, onChange</code>, 'boolean, (checked) => void', 'Controlled or uncontrolled. onChange gets the new value first.'],
            [<code key="d">indeterminate</code>, 'boolean', 'Only some children checked.'],
            [<code key="e">error</code>, 'string', 'Message under the label. Say what to do.'],
            [<code key="f">size</code>, 'md | sm', 'M 20 default. S 16 for rows and menus.'],
            [<code key="g">variant, marker</code>, 'default | card, string', 'Option card with a letter for exam answers.'],
            [<code key="h">disabled</code>, 'boolean', 'Native disabled. Use description to say why.'],
          ]}
        />
        <div className={`${base.cards} ${base.cols2}`}>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must</h3>
              <ul className={base.rules}>
                <li>Word the label so ticked means yes.</li>
                <li>Show a dash on a parent when only some children are checked.</li>
                <li>Name every box, even in table rows.</li>
                <li>Group related boxes with <code>CheckboxGroup</code>.</li>
              </ul>
            </div>
          </div>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must not</h3>
              <ul className={base.rules}>
                <li>Use a checkbox for a setting that applies instantly. Use a toggle.</li>
                <li>Use checkboxes for options that exclude each other. Use radios.</li>
                <li>Use negative labels.</li>
                <li>Build a checkbox from a div.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
