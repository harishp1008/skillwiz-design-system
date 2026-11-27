import { type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Tabs, type TabItem } from '../Tabs';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './TabsGuidelines.module.css';

/* Page chrome (section, table, cards, do/don't) is shared with the Button page via its CSS module; extra layout is in TabsGuidelines.module.css. */

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
        <Tok path={`tabs.${p}` as TokenPath} />
      </div>
    ))}
  </div>
);

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`tabs-${n}`}>
      <h2 id={`tabs-${n}`} className={base.h2}>
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

/** A card: a stage with the live component, then a title and a line of text below. */
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

/* ---------- Example data, taken from SkillWiz screens ---------- */

const none = <p className={s.sub}>Panel content appears here.</p>;
const activity: TabItem[] = [
  { id: 'overview', label: 'Overview', panel: none },
  { id: 'answers', label: 'Answers', count: 24, panel: none },
  { id: 'flags', label: 'Flags', count: 3, alert: true, panel: none },
  { id: 'notes', label: 'Notes', panel: none },
];
const sections: TabItem[] = [
  { id: 'aptitude', label: 'Aptitude', count: 20, panel: none },
  { id: 'verbal', label: 'Verbal', count: 15, panel: none },
  { id: 'coding', label: 'Coding', count: 2, panel: none },
  { id: 'logic', label: 'Logic', disabled: true, disabledReason: 'Opens when Coding is submitted', panel: none },
];
const many: TabItem[] = ['Overview', 'Answers', 'Flags', 'Notes', 'Proctoring', 'Webcam', 'Screen share', 'Timeline', 'Reports', 'Settings'].map((l, i) => ({ id: `t${i}`, label: l, panel: none }));
const filters: TabItem[] = [
  { id: 'all', label: 'All', panel: none },
  { id: 'live', label: 'Live', panel: none },
  { id: 'upcoming', label: 'Upcoming', panel: none },
  { id: 'ended', label: 'Ended', panel: none },
  { id: 'draft', label: 'Draft', disabled: true, disabledReason: 'No drafts yet', panel: none },
];
const results: TabItem[] = [
  { id: 'mid', label: 'Midterm: Data Structures', description: '42 students · 12 Mar', status: { label: 'Passed', tone: 'success' } },
  { id: 'quiz', label: 'Quiz 3: Graphs', description: '40 students · 2 Apr', status: { label: 'Failed', tone: 'danger' } },
  { id: 'lab', label: 'Lab: Sorting', description: '42 students · 20 Apr', status: { label: 'Pending' } },
];

const T = (p: Partial<React.ComponentProps<typeof Tabs>> & { items: TabItem[] }) => <Tabs label="Example tabs" hidePanels {...p} />;

export function TabsGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Tabs</h1>
        <p className={base.lead}>
          Tabs switch between views that belong to the same page without leaving it. One tab is selected at a time and its panel shows below or beside the list. Use them to organise, never to navigate to a different page.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="Every tab list is a row of tabs sitting on a baseline, with one selected tab that carries the indicator.">
        <div className={base.card}>
          <div className={s.anaCard}>
            <div className={s.anaStage}>
              <div className={s.anaWrap}>
                <Tabs label="Anatomy" items={activity} defaultValue="flags" hidePanels />
              </div>
            </div>
            <ol className={s.legend} style={{ padding: 'var(--sw-space-24)' }}>
              {[
                ['Tab', 'The label, one or two words, sentence case.'],
                ['Count', 'Optional. Grey normally, blue on the selected tab, red only while alerts are new.'],
                ['Selected state', 'Blue bold label with a two pixel indicator that sits on the baseline.'],
                ['Baseline', 'One pixel line under the whole list.'],
                ['Panel', 'The content of the selected tab. Always twenty pixels below the baseline.'],
              ].map(([t, d], i) => (
                <li key={t}>
                  <span className={s.numDark}>{i + 1}</span>
                  <span><b className={base.strong}>{t}.</b> {d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section n="02" title="Variants" intro="Pick the variant by where the tabs live, not by taste. The decision order is below the cards.">
        <div className={`${base.cards} ${base.cols2}`}>
          <Card title="Underline, large" white text="The main sections of a page. Forty-four pixels tall. The default.">
            <T items={activity} defaultValue="answers" />
          </Card>
          <Card title="Underline, small" white text="Inside a drawer, a card or a panel. Thirty-six pixels tall.">
            <T items={activity} defaultValue="answers" size="sm" />
          </Card>
          <Card title="Card tabs" text="A few tabs with a count each, when the tabs are the main way to move through a task.">
            <T variant="card" items={sections} defaultValue="aptitude" />
          </Card>
          <Card title="Pill tabs" text="Filters over one list. They change what the list shows, not what the page is about.">
            <T variant="pill" items={filters} defaultValue="all" />
          </Card>
        </div>
        <Card title="Vertical list tabs" text="Each item needs a caption or a status of its own, and the detail is large. The detail panel sits beside the list.">
          <T variant="vertical" items={results} defaultValue="mid" />
        </Card>
        <h3 className={base.h3}>Which one?</h3>
        <ol className={s.legend}>
          <li><span className={s.numDark}>1</span><span>Do the items filter one list? <b className={base.strong}>Pill tabs.</b></span></li>
          <li><span className={s.numDark}>2</span><span>Does each item need its own caption or status? <b className={base.strong}>Vertical list tabs.</b></span></li>
          <li><span className={s.numDark}>3</span><span>Are there four or fewer tabs and each has a count? <b className={base.strong}>Card tabs.</b></span></li>
          <li><span className={s.numDark}>4</span><span>Otherwise <b className={base.strong}>underline</b>. Large for a page, small inside something.</span></li>
        </ol>
      </Section>

      <Section n="03" title="States" intro="Colour and weight change; the width of a tab never does, so nothing around it moves.">
        <div className={`${base.cards} ${s.cols3}`}>
          {([
            ['Default', undefined, 'Body text on the baseline.'],
            ['Hover', { id: 'answers', state: 'hover' as const }, 'Heading colour. Only on devices with a pointer.'],
            ['Focus', { id: 'answers', state: 'focus' as const }, 'Keyboard only. A two pixel ring inside the tab.'],
          ] as const).map(([t, f, d]) => (
            <Card key={t} title={t} white text={d}>
              <T items={activity} defaultValue="overview" forceState={f} />
            </Card>
          ))}
          <Card title="Selected" white text="Blue bold label and the indicator.">
            <T items={activity} defaultValue="answers" />
          </Card>
          <Card title="Disabled" white text="Faded, announced, skipped by the arrow keys. Say why in the tooltip.">
            <T items={sections} defaultValue="aptitude" />
          </Card>
          <Card title="Alert count" white text="Red only while alerts are new. Clear it once the tab has been opened.">
            <T items={activity} defaultValue="overview" />
          </Card>
        </div>
        <h3 className={base.h3}>Pill tab states</h3>
        <div className={`${base.cards} ${s.cols3}`}>
          <Card title="Default and selected" text="Outlined pill; the selected one is filled."><T variant="pill" items={filters} defaultValue="live" /></Card>
          <Card title="Hover" text="Grey fill."><T variant="pill" items={filters} defaultValue="all" forceState={{ id: 'live', state: 'hover' }} /></Card>
          <Card title="Focus" text="Ring outside the pill."><T variant="pill" items={filters} defaultValue="all" forceState={{ id: 'live', state: 'focus' }} /></Card>
        </div>
      </Section>

      <Section n="04" title="Sizes" intro="Underline tabs come in two heights. Pill tabs are one size with a taller tap target.">
        <Table
          head={['Variant', 'Height', 'Label', 'Use']}
          rows={[
            ['Underline, large', '44px', '15px', 'Main sections of a page.'],
            ['Underline, small', '36px', '14px', 'Inside a drawer, card or panel.'],
            ['Card', '36px', '14px', 'A few counted tabs.'],
            ['Pill', '28px, tap target 36px', '13px bold', 'Filters over a list.'],
          ]}
        />
        <p className={s.sub}>The pill looks short but its tap target is thirty-six pixels tall: an invisible extension above and below, so it never overlaps the pills in the row above.</p>
      </Section>

      <Section n="05" title="Usage guidelines">
        <div className={s.usage}>
          <DoDont ok text="Short nouns: Overview, Answers, Flags.">
            <T items={activity} defaultValue="answers" />
          </DoDont>
          <DoDont ok={false} text="Sentences, verbs or ALL CAPS in tabs.">
            <T items={[{ id: 'a', label: 'SEE ALL ANSWERS', panel: none }, { id: 'b', label: 'Go to flags', panel: none }]} />
          </DoDont>
          <DoDont ok text="Keep a tab that is unavailable, disabled, with a reason.">
            <T items={sections} defaultValue="aptitude" />
          </DoDont>
          <DoDont ok={false} text="Hide a tab that is unavailable. The list jumps around.">
            <T items={sections.filter((i) => !i.disabled)} defaultValue="aptitude" />
          </DoDont>
          <DoDont ok text="Pill tabs to filter one list, with no counts.">
            <T variant="pill" items={filters} defaultValue="all" />
          </DoDont>
          <DoDont ok={false} text="Pill tabs to move between different pages of content.">
            <T variant="pill" items={[{ id: 'a', label: 'Overview', panel: none }, { id: 'b', label: 'Proctoring', panel: none }, { id: 'c', label: 'Reports', panel: none }]} />
          </DoDont>
          <DoDont ok text="Red counts only while alerts are new.">
            <T items={activity} defaultValue="overview" />
          </DoDont>
          <DoDont ok={false} text="More than seven tabs without room to scroll. Use a Select instead.">
            <div className={s.narrow}><T items={many} /></div>
          </DoDont>
        </div>
      </Section>

      <Section n="06" title="Behaviour & accessibility">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Keyboard', 'Tab moves focus into the list, onto the selected tab. Left and Right arrows move between tabs (Up and Down in vertical lists). Home and End jump to the first and last. Disabled tabs are skipped.'],
            ['Activation', 'Automatic by default: moving focus selects. Use manual (Enter or Space selects) when a panel fetches data.'],
            ['Roles', 'The list is a tablist, each tab has aria-selected and aria-controls, each panel is labelled by its tab.'],
            ['Counts', 'The count is part of the tab’s name: “Flags, 3”.'],
            ['Overflow', 'The list scrolls sideways with a fade at the edge that has more. The selected tab is always scrolled into view. The scrollbar is hidden.'],
            ['Width', 'A tab reserves the width of its bold self, so selecting never shifts its neighbours.'],
            ['Motion', 'Colour changes over the short duration. No sliding indicator; nothing moves.'],
            ['Touch', 'Every tab has at least a thirty-six pixel tap target.'],
          ]}
        />
        <h3 className={base.h3}>Overflow</h3>
        <div className={s.narrow}>
          <Tabs label="Overflow example" items={many} defaultValue="t3" hidePanels />
        </div>
      </Section>

      <Section n="07" title="Tokens" intro="Every value comes from a component token. Component tokens point to semantic tokens, which point to primitives.">
        <Table
          head={['Part', 'Tokens']}
          rows={[
            ['Underline', toks('height-lg', 'height-sm', 'padding-x-lg', 'padding-x-sm', 'gap', 'font-size-lg', 'font-size-sm', 'line-height')],
            ['Text', toks('text', 'text-hover', 'text-selected', 'text-disabled', 'font-weight', 'font-weight-selected')],
            ['Baseline and indicator', toks('baseline-color', 'baseline-width', 'indicator-color', 'indicator-width', 'panel-gap', 'fade-width')],
            ['Focus and motion', toks('focus-color', 'focus-width', 'focus-offset', 'focus-offset-inset', 'duration', 'easing')],
            ['Count', toks('count-min-size', 'count-padding-x', 'count-gap', 'count-radius', 'count-font-size', 'count-bg', 'count-text', 'count-bg-selected', 'count-text-selected', 'count-bg-alert', 'count-text-alert')],
            ['Card tabs', toks('card-height', 'card-padding-x', 'card-gap', 'card-radius', 'card-bg-selected', 'card-border-selected', 'card-count-bg-selected', 'card-count-text-selected')],
            ['Pill tabs', toks('pill-height', 'pill-hit-height', 'pill-padding-x', 'pill-gap', 'pill-inner-gap', 'pill-radius', 'pill-font-size', 'pill-font-weight', 'pill-bg', 'pill-border', 'pill-text', 'pill-bg-hover', 'pill-text-hover', 'pill-bg-selected', 'pill-text-selected', 'pill-border-selected')],
            ['Vertical list', toks('vertical-width', 'vertical-gap', 'vertical-padding', 'vertical-radius', 'vertical-bg', 'vertical-border', 'vertical-border-hover', 'vertical-bg-selected', 'vertical-border-selected', 'status-success-text', 'status-danger-text', 'status-neutral-text')],
          ]}
        />
      </Section>

      <Section n="08" title="Spec for code" intro="Read this before building tabs. It is the whole contract.">
        <SourceLinks
          items={[
            { label: 'Tabs source', path: 'src/components/Tabs' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <pre className={s.pre}>{`import { Tabs } from '@/components';

<Tabs
  label="Student activity"
  variant="underline"   // underline | card | vertical | pill
  size="lg"             // underline only: lg | sm
  activation="auto"     // auto | manual
  items={[
    { id: 'overview', label: 'Overview', panel: <Overview /> },
    { id: 'flags', label: 'Flags', count: 3, alert: true, panel: <Flags /> },
  ]}
/>`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">items</code>, 'TabItem[]', 'id, label, count, alert, disabled, disabledReason, description, status, panel.'],
            [<code key="b">label</code>, 'string', 'Required. The name of the tab list for screen readers.'],
            [<code key="c">variant</code>, 'underline | card | vertical | pill', 'Default underline.'],
            [<code key="d">size</code>, 'lg | sm', 'Underline only. Default lg.'],
            [<code key="e">value, defaultValue, onValueChange</code>, 'string', 'Controlled or uncontrolled.'],
            [<code key="f">activation</code>, 'auto | manual', 'Default auto.'],
          ]}
        />
        <div className={`${base.cards} ${base.cols2}`}>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must</h3>
              <ul className={base.rules}>
                <li>Use short nouns, sentence case, one or two words.</li>
                <li>Keep unavailable tabs, disabled, with a reason.</li>
                <li>Name the tab list with <code>label</code>.</li>
                <li>Take every value from a <code>--sw-tabs-*</code> token.</li>
              </ul>
            </div>
          </div>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must not</h3>
              <ul className={base.rules}>
                <li>Use tabs to go to a different page.</li>
                <li>Show a red count after the tab has been opened.</li>
                <li>Put counts on pill tabs.</li>
                <li>Nest tabs inside tabs.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
