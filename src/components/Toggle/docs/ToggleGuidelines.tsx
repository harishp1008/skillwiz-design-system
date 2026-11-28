import { useState, type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Toggle } from '../Toggle';
import { Checkbox } from '../../Checkbox';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './ToggleGuidelines.module.css';

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
const tg = (...p: string[]) => toks(...p.map((x) => `toggle.${x}`));

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`tg-${n}`}>
      <h2 id={`tg-${n}`} className={base.h2}>
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



const Btn = ({ children }: { children: ReactNode }) => <span className={s.btn}>{children}</span>;

/** A live switch that pretends to save to a server for a moment. */
function SavingDemo() {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);
  return <Toggle label="Proctor all students" checked={on} saving={saving} onChange={(c) => { setSaving(true); window.setTimeout(() => { setOn(c); setSaving(false); }, 1200); }} />;
}

export function ToggleGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Toggle switch</h1>
        <p className={base.lead}>For a setting that is on or off and takes effect immediately: proctor all students, on watchlist, auto-promote alerts, accessibility options.</p>
      </header>

      <Section n="01" title="Anatomy" intro="The M switch at 2×, on, with its label.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.bigStage}>
              <div className={s.big}><Toggle label="Reduce motion" defaultChecked /></div>
            </div>
            <ol className={s.legend}>
              {[
                ['Track', '36 × 20 (M) or 28 × 16 (S), fully rounded. Off is the toggle-off grey (3.1 to 1 on white), on is the primary blue.'],
                ['Thumb', 'White circle with a small shadow, 16 (M) or 12 (S). Sits left when off, right when on.'],
                ['Inset', '2px between thumb and track on every side.'],
                ['Label', 'Names the setting, not the action: “Reduce motion”, not “Turn on reduced motion”. The whole row is clickable.'],
                ['Colour', 'Position and colour change together, so on/off never relies on colour alone. Settings lists may add “On” / “Off” text.'],
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
            ['Track', 'M 36 × 20 · S 28 × 16 · fully round'],
            ['Thumb', 'M 16 · S 12 · white · small shadow · 2px inset'],
            ['Off', 'Toggle-off grey · hover: muted text colour'],
            ['On', 'Primary blue · hover: primary hover'],
            ['Focus', '2px focus outline, 2px offset · keyboard only'],
            ['Disabled', 'Off: muted fill with a subtle ring · on: default-border grey fill · label disabled text'],
            ['Label', 'M 14 / 20 · S 12 / 18 · body text · description 12 / 18 muted'],
            ['Gap', 'Inline (switch first) 8px · settings row (label first) 16px'],
            ['State text', 'Optional “On” / “Off”, 12 / 20, muted, left of the switch'],
            ['Motion', 'Thumb slides, track fades, fast duration · none with reduced motion'],
          ]}
        />
      </Section>

      <Section n="02" title="Variants" intro="One switch, four places it appears.">
        <div className={s.cards4}>
          <Card title="Inline · toolbar (S)" text="Switch first, label after. A view setting on the live board: “Proctor all students”.">
            <Toggle size="sm" label="Proctor all students" />
          </Card>
          <Card white title="Settings list (M)" text="Label and description left, “On” / “Off” text and switch right. Student accessibility panel.">
            <div className={s.list}>
              <Toggle layout="row" showState label="Reading spacing" description="Wider line, letter and word spacing" />
              <Toggle layout="row" showState label="Reduce motion" description="Stops press and hover animations" defaultChecked />
              <Toggle layout="row" showState label="Sound alert at 5 and 1 min left" description="Plays once, also announced to screen readers" defaultChecked />
            </div>
          </Card>
          <Card title="Single setting in a panel (M)" text="One setting about the thing in view: “On watchlist” in the student drawer.">
            <Toggle label="On watchlist" description="Alerts for this student ring first" defaultChecked />
          </Card>
          <Card title="Inline · status bar (S)" text="Automation that runs until turned off: “Auto-promote new alerts” on the spotlight view.">
            <Toggle size="sm" label="Auto-promote new alerts" defaultChecked />
          </Card>
        </div>
      </Section>

      <Section n="03" title="States" intro="Every state at M size.">
        <div className={s.cards4}>
          <Card white title="Off" text="Grey track, thumb left."><Toggle label="Reduce motion" /></Card>
          <Card white title="Off · hover" text="Track darkens."><Toggle label="Reduce motion" forceState="hover" /></Card>
          <Card white title="On" text="Blue track, thumb right."><Toggle label="Reduce motion" defaultChecked /></Card>
          <Card white title="On · hover" text="Track goes to the primary hover blue."><Toggle label="Reduce motion" defaultChecked forceState="hover" /></Card>
          <Card white title="Focus" text="Keyboard ring, 2px offset."><Toggle label="Reduce motion" forceState="focus" /></Card>
          <Card white title="Saving" text="Spinner in the thumb while the server confirms; reverts with a toast if it fails. Click to try."><SavingDemo /></Card>
          <Card white title="Disabled · off" text="Muted; say why nearby."><Toggle label="Record grades" description="Upgrade to record grades" disabled /></Card>
          <Card white title="Disabled · on" text="Grey fill keeps the value readable."><Toggle label="Proctoring" description="Set by your admin" disabled defaultChecked /></Card>
        </div>
      </Section>

      <Section n="04" title="Sizes" intro="Two sizes, matched to the controls around them.">
        <div className={s.cols2}>
          <Card white title="M · 36 × 20 · default" text="Settings, panels, forms. Label 14 / 20.">
            <Toggle label="Sound alert at 5 and 1 min left" description="Plays once, also announced to screen readers" defaultChecked />
            <Toggle label="Reduce motion" />
          </Card>
          <Card white title="S · 28 × 16" text="Toolbars and status bars next to 28px controls. Label 12.">
            <Toggle size="sm" label="Proctor all students" defaultChecked />
            <Toggle size="sm" label="Auto-promote new alerts" />
          </Card>
        </div>
      </Section>

      <Section n="05" title="Toggle, checkbox or button?" intro="Pick by when it takes effect.">
        <div className={s.cards3}>
          <Card white title="Toggle" text="Takes effect at once, like a light switch. No Save button."><Toggle label="Reduce motion" defaultChecked /></Card>
          <Card white title="Checkbox" text="Part of a form that is saved with a button, or picking items.">
            <Checkbox label="Send results by email" defaultChecked />
            <Checkbox label="Allow retakes" />
          </Card>
          <Card white title="Button" text="An action, not a state: Pause exam, Start recording. A toggle never triggers a one-off action."><Btn>Pause exam</Btn></Card>
        </div>
      </Section>

      <Section n="06" title="Behaviour" intro="Clicking, keys, saving and wording.">
        <Table
          head={['Rule', 'Behaviour']}
          rows={[
            ['Click', 'Clicking the switch or its label flips it. The thumb slides, the track changes colour.'],
            ['Keyboard', <>Tab to focus, <kbd>Space</kbd> flips it (<kbd>Enter</kbd> too). Arrow keys do nothing.</>],
            ['Takes effect', 'Immediately. If it saves to the server, show the Saving state; on failure flip back and show a toast with Retry.'],
            ['Wording', 'The label stays the same in both states. Never change “On watchlist” to “Off watchlist”.'],
            ['Big consequences', 'A toggle that affects many students (Proctor all students) can ask once: “Proctor all 175 students?” with Confirm.'],
            ['Disabled', 'Explain why in the description or a tooltip: “Set by your admin”.'],
          ]}
        />
      </Section>

      <Section n="07" title="Usage guidelines" intro="Two rules for toggles.">
        <div className={s.usage}>
          <DoDont ok text="Name the setting."><Toggle label="Reduce motion" /></DoDont>
          <DoDont ok={false} text="Name an action; on and off gets confusing."><Toggle label="Turn off animations" defaultChecked /></DoDont>
          <DoDont ok text="Apply at once."><Toggle label="Sound alert" defaultChecked /></DoDont>
          <DoDont ok={false} text="Put a toggle in a form that needs Save; use a checkbox."><Toggle label="Sound alert" defaultChecked /><Btn>Save</Btn></DoDont>
        </div>
      </Section>

      <Section n="08" title="Accessibility" intro="A real switch role, a visible label, state not by colour alone.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Element', <>A native <code>input type=&quot;checkbox&quot;</code> with <code>role=&quot;switch&quot;</code> inside a <code>label</code>.</>],
            ['Name', <>The visible label; the description through <code>aria-describedby</code>.</>],
            ['State', <><code>aria-checked</code> true or false; screen readers say “switch, on”.</>],
            ['Saving', <><code>aria-busy=&quot;true&quot;</code> while waiting; a polite live region reports failure.</>],
            ['Contrast', 'The off track (toggle-off grey) is 3.1 to 1 and the on track (primary) is 4.5 to 1 against white.'],
            ['Target', 'The whole row is the target; the inline S switch keeps at least 28px height.'],
            ['Motion', <>No slide under <code>prefers-reduced-motion</code>; the state still shows by position and colour.</>],
          ]}
        />
      </Section>

      <Section n="09" title="Screens to align" intro="Where toggles differ today.">
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Live board toolbar · Proctor all students', 'Switch in the filter bar, 80 boards', 'Toggle S inline; confirm once for all students'],
            ['Student drawer · On watchlist', 'Switch next to a description', 'Toggle M, single setting in a panel'],
            ['Spotlight · Auto-promote new alerts', 'Switch with a paused text state', 'Toggle S inline; keep label, show paused in the status text'],
            ['Student accessibility panel', 'Off track in #98A2B3 (disabled text colour), 2.6 to 1', 'Off track in toggle-off grey (3.1 to 1); On/Off text kept'],
          ]}
        />
      </Section>

      <Section n="10" title="Tokens" intro="Existing tokens plus the new ones: the off-track colour, a thumb shadow, switch sizes and two gaps.">
        <Table
          head={['Element', 'Tokens']}
          rows={[
            ['New', toks('color.surface.toggle-off', 'shadow.thumb', 'size.toggle.md.width', 'size.toggle.md.height', 'size.toggle.md.thumb', 'size.toggle.sm.width', 'size.toggle.sm.height', 'size.toggle.sm.thumb', 'space.toggle-gap-inline', 'space.toggle-gap-row')],
            ['Track', tg('width-md', 'height-md', 'width-sm', 'height-sm', 'radius', 'inset', 'track-off', 'track-off-hover', 'track-on', 'track-on-hover')],
            ['Thumb', tg('thumb-md', 'thumb-sm', 'thumb-bg', 'thumb-shadow')],
            ['Focus', tg('focus-color', 'focus-width', 'focus-offset')],
            ['Disabled', tg('disabled-off-bg', 'disabled-off-ring', 'disabled-on-bg', 'disabled-text')],
            ['Saving', tg('spinner-color', 'spinner-width')],
            ['Text', tg('label-text', 'label-font-size-md', 'label-line-height-md', 'label-font-size-sm', 'label-line-height-sm', 'description-text', 'description-font-size', 'description-line-height', 'row-gap', 'gap-inline', 'gap-row', 'state-text', 'state-font-size', 'state-line-height')],
            ['Motion', tg('duration', 'easing')],
          ]}
        />
      </Section>

      <Section n="11" title="Spec for code">
        <SourceLinks items={[{ label: 'Toggle source', path: 'src/components/Toggle' }, { label: 'Component tokens', path: 'tokens/component.json' }]} />
        <pre className={s.pre}>{`import { Toggle } from '@/components';

<Toggle label="On watchlist" description="Alerts for this student ring first" checked={on} onChange={setOn} />
<Toggle size="sm" label="Proctor all students" saving={saving} checked={on} onChange={save} />
<Toggle layout="row" showState label="Reduce motion" description="Stops press and hover animations" />`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">label, description</code>, 'ReactNode', 'Names the setting. Same label in both states.'],
            [<code key="b">checked, defaultChecked, onChange</code>, 'boolean, (checked) => void', 'Controlled or uncontrolled. onChange gets the new state first.'],
            [<code key="c">size</code>, 'md | sm', 'M 36 × 20 default, S 28 × 16.'],
            [<code key="d">layout, showState</code>, 'inline | row, boolean', 'Row puts the label left and the switch right, with On / Off text.'],
            [<code key="e">saving</code>, 'boolean', 'Spinner in the thumb, aria-busy.'],
            [<code key="f">disabled</code>, 'boolean', 'Say why in the description.'],
          ]}
        />
      </Section>
    </div>
  );
}
