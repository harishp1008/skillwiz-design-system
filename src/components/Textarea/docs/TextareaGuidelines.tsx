import type { ComponentProps, ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Textarea } from '../Textarea';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './TextareaGuidelines.module.css';

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
const ta = (...p: string[]) => toks(...p.map((x) => `textarea.${x}`));

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`ta-${n}`}>
      <h2 id={`ta-${n}`} className={base.h2}>
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




const LONG = 'Question 6 does not load after I click Next. I tried twice and refreshed once.';
const LONGER = `${LONG} The timer kept running while the page was blank. Question 6 does not load after I click Next. I tried twice and refreshed once. The timer kept running while the page was blank. Question 6 does not load after I click Next. I tried twice and refreshed once. The timer kept running while the page was blank. Question 6 does not load after I click Next. I tried twice and refreshed once. The timer kept running.`;
const MID = `${LONG} The timer kept running while the page was blank. Question 6 does not load after I click Next.`;
const Issue = (p: Partial<ComponentProps<typeof Textarea>>) => <Textarea label="Describe the issue" placeholder="e.g. Question 6 won’t load" {...p} />;

export function TextareaGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Textarea</h1>
        <p className={base.lead}>Many lines for notes, issue reports, remarks and messages. Grows with the text, shows a count when there is a limit. Single-line fields are on the Text input page.</p>
      </header>

      <Section n="01" title="Anatomy" intro="A labelled textarea with a helper and a limit.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.bigStage}>
              <div className={s.big}><Textarea label="Describe the issue" defaultValue={LONG} limit={500} showCount helper="Our team reads every report." /></div>
            </div>
            <ol className={s.legend}>
              {[
                ['Label', 'Always visible, above the field, like every input.'],
                ['Container', 'Starts at 3 rows (80px) and grows with the text up to 8 rows (180px), then scrolls inside.'],
                ['Value', 'Wraps; line height 20. The placeholder gives an example of what to write.'],
                ['Resize grip', 'People can drag it taller. Vertical only, so the layout never breaks sideways.'],
                ['Helper text', 'Who reads it or what to include. Errors replace it in the same spot.'],
                ['Character count', 'Shown when there is a limit. Turns red past the limit; the text is kept, not cut.'],
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
            ['Label', '14 / 20 semibold · heading text · 6px gap'],
            ['Height', 'Min 3 rows (80) · grows to 8 rows (180) · then scrolls'],
            ['Padding', '8 12'],
            ['Border · radius', '1px input border · 6px'],
            ['Text', '14 / 20 · value in body text · placeholder muted'],
            ['Resize', 'Vertical only'],
            ['Focus', 'Focus border + 1px ring'],
            ['Error', 'Danger border · message replaces the helper'],
            ['Count', '12 / 18 tabular · right-aligned · danger text and bold over the limit'],
            ['Disabled', 'Muted fill · default border · disabled text'],
            ['Composer', '1 row (44) → 6 rows · send button 36 inside, bottom-right'],
          ]}
        />
      </Section>

      <Section n="02" title="Variants" intro="Three set-ups of the same field.">
        <div className={s.cards3}>
          <Card title="With a limit" text="Multi-line text with a limit: report an issue, feedback, review notes.">
            <div className={s.w}><Issue defaultValue={LONG} limit={500} showCount /></div>
          </Card>
          <Card title="Optional with helper" text="Helper text says who will read it. Optional fields are marked in the label.">
            <div className={s.w}><Textarea label="Note to student" optional placeholder="Add a short note" helper="The student sees this with their result." /></div>
          </Card>
          <Card title="Message composer" text="A textarea with a send button inside. One line (44px) that grows to 6 lines. Enter sends, Shift + Enter breaks the line.">
            <div className={s.w}><Textarea variant="composer" aria-label="Message to Achintya" placeholder="Write a message to Achintya…" helper="Enter to send · Shift + Enter for a new line" /></div>
          </Card>
        </div>
      </Section>

      <Section n="03" title="States" intro="Only the border, fill, message and count change.">
        <div className={s.cards4}>
          <Card white title="Default" text="Input border colour."><div className={s.w}><Issue limit={500} showCount /></div></Card>
          <Card white title="Hover" text="Darker border. Hover pointers only."><div className={s.w}><Issue limit={500} showCount forceState="hover" /></div></Card>
          <Card white title="Focus" text="Focus border + 1px ring, caret shown."><div className={s.w}><Issue limit={500} showCount forceState="focus" defaultValue="Question 6 does not load after I click Next." /></div></Card>
          <Card white title="Filled" text="Border back to default; the count stays."><div className={s.w}><Issue limit={500} showCount defaultValue="Question 6 does not load after I click Next." /></div></Card>
          <Card white title="Error · empty" text="Required and empty on submit. The message says what to write."><div className={s.w}><Issue error="Tell us what went wrong." /></div></Card>
          <Card white title="Error · over limit" text="Text kept; count red and bold; submit explains."><div className={s.w}><Textarea label="Note to student" limit={60} defaultValue="This note is longer than the limit allows, so the count turns red…" error="Shorten to 60 characters." /></div></Card>
          <Card white title="Disabled" text="Muted fill and text. Say why in the helper."><div className={s.w}><Textarea label="Reviewer notes" defaultValue="Checked by the coordinator." disabled helper="Locked after the result is published." /></div></Card>
          <Card white title="Read-only" text="Canvas fill, subtle border. Can be selected and copied."><div className={s.w}><Textarea label="Student’s answer" readOnly defaultValue="A stack is last in, first out; a queue is first in, first out." /></div></Card>
        </div>
      </Section>

      <Section n="04" title="Height & growth" intro="One width, three heights as people type.">
        <div className={s.cards3}>
          <Card white title="Min · 3 rows · 80px" text="Starting height. Never smaller, so people see there is room to write."><div className={s.w}><Issue /></div></Card>
          <Card white title="Growing · 5 rows" text="Grows one line at a time as people type; the page moves, the field does not scroll yet."><div className={s.w}><Issue defaultValue={MID} /></div></Card>
          <Card white title="Max · 8 rows · 180px" text="Stops growing and scrolls inside. Drag the grip to make it taller."><div className={s.w}><Issue defaultValue={LONGER} /></div></Card>
        </div>
      </Section>

      <Section n="05" title="Behaviour" intro="Growth, Enter, limits and drafts.">
        <Table
          head={['Rule', 'Behaviour']}
          rows={[
            ['Growth', '3 rows → grows with content → 8 rows, then scrolls inside. Composer: 1 row → 6 rows.'],
            ['Enter', 'New line. Only the message composer sends on Enter; Shift + Enter adds a line there.'],
            ['Character limit', 'Count shows from the start for short limits (200 or less), from 80% for longer ones. Past the limit: red count, text kept, submit explains. Never a maxlength that silently cuts pasted text.'],
            ['Validate', 'On blur or submit, not while typing. Then live, so the error clears as soon as it is fixed.'],
            ['Paste', 'Keep line breaks; trim spaces at the very start and end on submit.'],
            ['Drafts', 'Composer and long forms keep the draft if the drawer or dialog closes by accident.'],
          ]}
        />
      </Section>

      <Section n="06" title="Usage guidelines" intro="Four rules.">
        <div className={s.usage}>
          <DoDont ok text="Show the count when there is a limit."><div className={s.w}><Issue defaultValue="Question 6 does not load after I click Next. I tried twice." limit={500} showCount /></div></DoDont>
          <DoDont ok={false} text="Cut the text at the limit without saying so."><div className={s.w}><Issue defaultValue="Question 6 does not load after I cli" /></div></DoDont>
          <DoDont ok text="Start at 3 rows so there is room to write."><div className={s.w}><Issue /></div></DoDont>
          <DoDont ok={false} text="Use a 1-row box for paragraphs; people can’t see what they wrote."><div className={s.w}><Textarea label="Describe the issue" variant="composer" placeholder="e.g. Question 6 won’t load after I click Next" /></div></DoDont>
          <DoDont ok text="Say who will read it."><div className={s.w}><Textarea label="Note to student" optional placeholder="Add a short note" helper="The student sees this with their result." /></div></DoDont>
          <DoDont ok={false} text="Put the label and instructions in the placeholder."><div className={s.w}><Textarea aria-label="Note to student" placeholder="Note to student (the student will see this with their result, keep it short)" /></div></DoDont>
        </div>
      </Section>

      <Section n="07" title="Screens to align" intro="Multi-line fields that differ today.">
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Message composer (Wall V2 · 05e)', '40px, 2px grey border, radius 8px', 'Composer: 44px, 1px border, radius 6px, send button inside'],
            ['Message flow textarea (Flow · 04)', '2px blue border at rest, radius 8px', 'Default border at rest; blue only on focus'],
            ['Message drawer (6c-e)', 'Fixed 96px textarea, no count', 'Grow 3 → 8 rows; count from 240 of 280'],
            ['Report an issue (SE-06 v2 · 13)', '80px textarea, padding 10px 12px — closest to spec', 'Padding 8px 12px, add “0 / 500” count'],
          ]}
        />
      </Section>

      <Section n="08" title="Accessibility" intro="Labelled, described and counted politely.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Label', <>A real <code>label</code> with <code>for</code> on the <code>textarea</code>. The composer uses <code>aria-label</code> (“Message to Achintya”).</>],
            ['Helper & error', <>Linked with <code>aria-describedby</code>; an error sets <code>aria-invalid</code> and is read once.</>],
            ['Count', 'Announced politely when 20 characters are left and at the limit, not on every key.'],
            ['Keyboard', 'Tab leaves the field (no tab characters). Resize also works with the keyboard via the browser.'],
            ['Send', <>The composer send button has <code>aria-label=&quot;Send message&quot;</code>; disabled while empty, with the reason in the tooltip.</>],
            ['Focus', 'Visible ring on keyboard and mouse focus.'],
          ]}
        />
      </Section>

      <Section n="09" title="Tokens" intro="Same tokens as Text input, plus the composer and the count. New here: one padding token for the top and bottom.">
        <Table
          head={['Element', 'Tokens']}
          rows={[
            ['New', toks('space.input-padding-y')],
            ['Container', ta('padding-x', 'padding-y', 'min-height', 'max-height', 'radius', 'bg', 'border', 'border-width')],
            ['Text', ta('font-size', 'line-height', 'text', 'placeholder')],
            ['Label', ta('label-text', 'label-font-size', 'label-line-height', 'label-weight', 'optional-text', 'optional-weight', 'field-gap')],
            ['Hover and focus', ta('border-hover', 'focus-color', 'focus-ring-width', 'duration', 'easing')],
            ['Error', ta('error-color', 'error-text', 'error-icon-size')],
            ['Count and helper', ta('helper-text', 'helper-font-size', 'helper-line-height', 'count-text', 'count-over-text', 'count-over-weight', 'icon-gap')],
            ['Disabled and read-only', ta('disabled-bg', 'disabled-border', 'disabled-text', 'readonly-bg', 'readonly-border')],
            ['Composer', ta('composer-min-height', 'composer-max-height', 'composer-send-size', 'composer-send-inset', 'composer-send-radius', 'composer-send-icon-size', 'composer-send-bg', 'composer-send-bg-hover', 'composer-send-text', 'composer-send-disabled-bg', 'composer-send-disabled-text')],
          ]}
        />
      </Section>

      <Section n="10" title="Spec for code">
        <SourceLinks items={[{ label: 'Textarea source', path: 'src/components/Textarea' }, { label: 'Component tokens', path: 'tokens/component.json' }]} />
        <pre className={s.pre}>{`import { Textarea } from '@/components';

<Textarea label="Describe the issue" placeholder="e.g. Question 6 won’t load" limit={500} showCount helper="Our team reads every report." error={error} onChange={setText} />
<Textarea label="Note to student" optional helper="The student sees this with their result." />
<Textarea variant="composer" aria-label="Message to Achintya" onSend={send} />`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">label, optional</code>, 'ReactNode, boolean', 'Label above the field; “(optional)” after it.'],
            [<code key="b">helper, error</code>, 'ReactNode, string', 'One line below. An error replaces the helper and sets aria-invalid.'],
            [<code key="c">limit, showCount</code>, 'number, boolean', 'Count and limit. Text is kept past the limit; there is no maxlength.'],
            [<code key="d">variant, onSend, sendHint</code>, 'default | composer', 'Composer: Enter sends, Shift + Enter breaks the line.'],
            [<code key="e">value, defaultValue, onChange</code>, 'string, (value) => void', 'Controlled or uncontrolled. onChange gets the value first.'],
            [<code key="f">disabled, readOnly</code>, 'boolean', 'Say why in the helper text.'],
          ]}
        />
      </Section>
    </div>
  );
}
