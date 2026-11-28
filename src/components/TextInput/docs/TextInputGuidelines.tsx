import type { ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { TextInput } from '../TextInput';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './TextInputGuidelines.module.css';

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
const ti = (...p: string[]) => toks(...p.map((x) => `text-input.${x}`));

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`ti-${n}`}>
      <h2 id={`ti-${n}`} className={base.h2}>
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


const W = ({ children }: { children: ReactNode }) => <div style={{ width: '100%', maxWidth: 280 }}>{children}</div>;
const stateCards: [string, string, ReactNode][] = [
  ['Default', 'Border input colour.', <TextInput label="Student ID" placeholder="e.g. VK3456789" />],
  ['Hover', 'Darker border, 150ms. Hover pointers only.', <TextInput label="Student ID" placeholder="e.g. VK3456789" forceState="hover" />],
  ['Focus', 'Focus border plus 1px ring, caret shown. Keyboard and mouse alike.', <TextInput label="Student ID" placeholder="e.g. VK3456789" forceState="focus" />],
  ['Filled', 'Value in body text; border back to default.', <TextInput label="Student ID" defaultValue="VK3456789" />],
  ['Error', 'Red border and icon; the message says how to fix it. Shown on blur, then live.', <TextInput label="Student ID" defaultValue="VK34" error="User IDs are 9 characters, like VK3456789." />],
  ['Error · focus', 'The ring turns red too, so focus and error read together.', <TextInput label="Student ID" defaultValue="VK34567" forceState="focus" error="User IDs are 9 characters, like VK3456789." />],
  ['Disabled', 'Muted fill and text. Say why in the helper text.', <TextInput label="Classroom" defaultValue="LPU_Class" disabled helper="Set by the admin." />],
  ['Read-only', 'Canvas fill, subtle border. Text can be selected and copied.', <TextInput label="Assessment ID" defaultValue="ASM-2026-0142" readOnly />],
];

export function TextInputGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Text input</h1>
        <p className={base.lead}>One line for names, IDs, numbers, email and search. One border, one focus ring, one place for help and errors. Multi-line fields are on the Textarea page; search behaviour is on the Search field page.</p>
      </header>

      <Section n="01" title="Anatomy" intro="A labelled search input with a value.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.bigStage}>
              <div className={s.big}>
                <TextInput label="Student ID" leadingIcon="search" defaultValue="Achintya" clearable helper="Matches name, user ID or email." />
              </div>
            </div>
            <ol className={s.legend}>
              {[
                ['Label', 'Always visible, above the field. A short noun phrase, sentence case. Mark the optional fields, not the required ones.'],
                ['Leading icon', '16px. Only when it says what the field is for at a glance: search, email, lock. Not decoration.'],
                ['Container', 'White field with a 1px border, 36px high at M, radius 6px. Its border is the only thing that changes between states.'],
                ['Value or placeholder', 'The placeholder gives an example (“e.g. VK3456789”). It disappears on typing, so it can’t carry instructions.'],
                ['Clear button', '24px target. Appears once a search field has a value. Clears and keeps focus in the field.'],
                ['Helper or error text', 'One line under the field. An error replaces the helper text in the same spot, so nothing jumps.'],
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
            ['Label', '14 / 20 semibold · above the field, 6px gap · “(optional)” in muted text'],
            ['Height', 'S 28 · M 36 · L 44 (control size tokens)'],
            ['Padding', 'S 0 8 · M 0 12 · L 0 16'],
            ['Border', '1px input border · hover darker'],
            ['Radius', '6px, all sizes'],
            ['Text', 'S 12 · M 14 · L 16, line height 20 · value in body text'],
            ['Placeholder', 'Muted text · an example, never the label'],
            ['Icons', '16px Lucide · muted · 8px gap'],
            ['Suffix', 'Units after the value (min, %, marks) · muted'],
            ['Focus', 'Focus border + 1px ring of the same colour (2px total, no layout shift)'],
            ['Error', 'Danger border · message 12 / 18 in danger text with icon'],
            ['Disabled', 'Muted fill · default border · disabled text'],
            ['Helper', '12 / 18 muted · 6px below'],
          ]}
        />
      </Section>

      <Section n="02" title="Variants" intro="Three set-ups of the same field.">
        <div className={s.cards3}>
          <Card title="Text" text="Single line. Add a suffix for units (min, %, marks) so people type only the number.">
            <W><TextInput label="Assessment name" placeholder="Data Structures · Mid-term" /></W>
            <W><TextInput label="Duration" defaultValue="90" suffix="min" inputMode="numeric" /></W>
          </Card>
          <Card title="Search" text="Leading search icon, clear button once filled, no label when the page title says what is searched. Small (28px) inside toolbars.">
            <W><TextInput size="sm" aria-label="Search students" leadingIcon="search" defaultValue="Achintya" clearable /></W>
            <W><TextInput aria-label="Search students" leadingIcon="search" placeholder="Search students" clearable /></W>
          </Card>
          <Card title="With icons" text="Leading icon for the type; password gets a Show button (eye) that toggles to Hide.">
            <W><TextInput label="Email" type="email" leadingIcon="mail" defaultValue="harish@skillwiz.in" /></W>
            <W><TextInput label="Password" type="password" leadingIcon="lock" defaultValue="hunter2hunter2" /></W>
          </Card>
        </div>
      </Section>

      <Section n="03" title="States" intro="Only the border, fill and message change.">
        <div className={s.cards4}>
          {stateCards.map(([t, d, el]) => (
            <Card key={t} white title={t} text={d}><W>{el}</W></Card>
          ))}
        </div>
      </Section>

      <Section n="04" title="Sizes" intro="Same heights as buttons, so a field and its button line up.">
        <div className={s.cards3}>
          <Card white title="S · 28px" text="12px text, 8px padding. Toolbars, table filters, the student search on the live wall."><W><TextInput size="sm" aria-label="Search students" leadingIcon="search" placeholder="Search students" /></W></Card>
          <Card white title="M · 36px" text="Default. Forms, dialogs, filters above lists. Matches 36px buttons."><W><TextInput label="Student ID" placeholder="e.g. VK3456789" /></W></Card>
          <Card white title="L · 44px" text="16px text. Sign-in and the student exam, where people type on laptops in a hurry; 16px also stops phones zooming in."><W><TextInput size="lg" label="Email" type="email" placeholder="name@college.edu" /></W></Card>
        </div>
      </Section>

      <Section n="05" title="Behaviour" intro="Validation, typing, paste and Enter.">
        <Table
          head={['Rule', 'Behaviour']}
          rows={[
            ['Validate', 'On blur, not while typing. Once a field shows an error, re-check on every keystroke so the error clears the moment it is fixed.'],
            ['Error message', 'Says what to do, not what went wrong: “User IDs are 9 characters, like VK3456789”, not “Invalid ID”.'],
            ['Required', 'Mark optional fields “(optional)”; required is the default. On submit, focus the first field with an error.'],
            ['Numbers', <>Use <code>inputmode=&quot;numeric&quot;</code> with a suffix for units; don’t use number spinners for IDs or phone numbers.</>],
            ['Paste', <>Trim spaces from the ends of IDs and emails on blur (<code>trim</code>). Never block paste, passwords included.</>],
            ['Autocomplete', <>Set <code>autocomplete</code> and <code>type</code>: email, current-password, one-time-code. Phones show the right keyboard.</>],
            ['Enter', 'Submits the form the field is in. Search runs on typing (300ms debounce) and Enter runs it at once.'],
            ['Long values', 'Text scrolls inside the field; never clip without a way to see the rest. Read-only values can be selected and copied.'],
          ]}
        />
      </Section>

      <Section n="06" title="Usage guidelines" intro="Four rules, each from something on a SkillWiz screen today.">
        <div className={s.usage}>
          <DoDont ok text="Keep the label above and use the placeholder for an example."><W><TextInput label="Student ID" placeholder="e.g. VK3456789" /></W></DoDont>
          <DoDont ok={false} text="Use the placeholder as the label. It vanishes on the first keystroke."><W><TextInput aria-label="Student ID" placeholder="Student ID" /></W></DoDont>
          <DoDont ok text="Say how to fix it, next to the field."><W><TextInput label="Student ID" defaultValue="VK34" error="User IDs are 9 characters, like VK3456789." /></W></DoDont>
          <DoDont ok={false} text="Write “Invalid input”. People can’t act on it."><W><TextInput label="Student ID" defaultValue="VK34" error="Invalid input." /></W></DoDont>
          <DoDont ok text="Put units in a suffix."><W><TextInput label="Duration" defaultValue="90" suffix="min" /></W></DoDont>
          <DoDont ok={false} text="Ask people to type the unit; “90 minutes” then fails validation."><W><TextInput label="Duration (in minutes)" defaultValue="90 minutes" /></W></DoDont>
          <DoDont ok text="Mark the few optional fields."><W><TextInput label="Phone" optional placeholder="e.g. 98765 43210" /></W></DoDont>
          <DoDont ok={false} text="Star every required field; most fields are required anyway."><W><TextInput label="Phone *" placeholder="e.g. 98765 43210" /></W></DoDont>
        </div>
      </Section>

      <Section n="07" title="Screens to align" intro="Single-line fields that differ today.">
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Result list filters & search (Wall V2 · 08)', '36px, padding 0 10px', 'M 36px, padding 0 12px'],
            ['Live wall student search (Wall V2 · 05e, 06)', '32px, padding 0 10px', 'S 28px (toolbar) or M 36px; 32px is not a size'],
            ['Reschedule dialog (6c-h)', 'Date and time typed as text', 'Use the Date & time input; same field box'],
          ]}
        />
      </Section>

      <Section n="08" title="Accessibility" intro="Labelled, described and announced once.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Label', <>A real <code>label</code> with <code>for</code>. Search fields without a visible label get <code>aria-label</code> (“Search students”).</>],
            ['Helper & error', <>Linked with <code>aria-describedby</code>. An error sets <code>aria-invalid</code>; the message sits in a polite live region so it is read once.</>],
            ['Required', 'Required is the default; the visible “(optional)” covers the rest.'],
            ['Clear & Show', 'Real buttons of type button, named “Clear” and “Show password” / “Hide password”; 24px target; focus stays in the field after clearing.'],
            ['Focus', 'Visible ring on keyboard and mouse focus; never remove the outline without the ring.'],
            ['Contrast', 'Placeholder muted text is 5.7 to 1. The resting border uses the input border colour (3.1 to 1) to meet WCAG 1.4.11; the default border is 1.4 to 1.'],
            ['Zoom & phones', 'L size uses 16px text so iOS does not zoom; fields fill their container below 480px.'],
          ]}
        />
      </Section>

      <Section n="09" title="Tokens" intro="Existing tokens, plus the input border from the Checkbox work. New here: three field padding tokens, one label gap, one icon gap, one action size and a 6px primitive.">
        <Table
          head={['Element', 'Tokens']}
          rows={[
            ['New', toks('color.border.input', 'space.input-padding-sm', 'space.input-padding-md', 'space.input-padding-lg', 'space.field-gap', 'space.input-icon-gap', 'size.input-action')],
            ['Container', ti('height-sm', 'height-md', 'height-lg', 'padding-x-sm', 'padding-x-md', 'padding-x-lg', 'radius', 'bg', 'border', 'border-width')],
            ['Text', ti('font-size-sm', 'font-size-md', 'font-size-lg', 'line-height', 'text', 'placeholder', 'suffix-text')],
            ['Label', ti('label-text', 'label-font-size', 'label-line-height', 'label-weight', 'optional-text', 'optional-weight', 'field-gap')],
            ['Hover and focus', ti('border-hover', 'focus-color', 'focus-ring-width', 'duration', 'easing')],
            ['Error', ti('error-color', 'error-text', 'error-icon-size')],
            ['Disabled and read-only', ti('disabled-bg', 'disabled-border', 'disabled-text', 'readonly-bg', 'readonly-border')],
            ['Icons and buttons', ti('icon-size', 'icon-color', 'icon-gap', 'action-size', 'action-radius', 'action-bg-hover')],
            ['Helper', ti('helper-text', 'helper-font-size', 'helper-line-height')],
          ]}
        />
      </Section>

      <Section n="10" title="Spec for code">
        <SourceLinks items={[{ label: 'Text input source', path: 'src/components/TextInput' }, { label: 'Component tokens', path: 'tokens/component.json' }]} />
        <pre className={s.pre}>{`import { TextInput } from '@/components';

<TextInput label="Student ID" placeholder="e.g. VK3456789" trim error={error} onChange={setId} />
<TextInput label="Duration" suffix="min" inputMode="numeric" />
<TextInput size="sm" aria-label="Search students" leadingIcon="search" clearable />
<TextInput size="lg" label="Password" type="password" autoComplete="current-password" />`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">label, optional</code>, 'ReactNode, boolean', 'Label above the field; “(optional)” after it.'],
            [<code key="b">helper, error</code>, 'ReactNode, string', 'One line below. An error replaces the helper and sets aria-invalid.'],
            [<code key="c">size</code>, 'sm | md | lg', 'S 28, M 36 default, L 44.'],
            [<code key="d">leadingIcon, suffix</code>, 'IconName, ReactNode', 'Icon for the type; unit after the value.'],
            [<code key="e">clearable, trim</code>, 'boolean', 'Clear button once filled; trim ends on blur.'],
            [<code key="f">type</code>, 'text | email | password | …', 'Password gets a Show button.'],
            [<code key="g">value, defaultValue, onChange</code>, 'string, (value) => void', 'Controlled or uncontrolled. onChange gets the value first.'],
            [<code key="h">disabled, readOnly</code>, 'boolean', 'Say why in the helper text.'],
          ]}
        />
      </Section>
    </div>
  );
}
