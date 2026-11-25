import { useState, type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Badge, CountBadge, type BadgeTone } from '../../Badge';
import { Tag } from '../../Tag';
import { Chip, ChipGroup, InputChip } from '../../Chip';
import { labelIcons } from '../../shared/labelIcons';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './ChipTagBadgeGuidelines.module.css';

/* Page chrome (section, table, do/don't) is shared with the Button page via its CSS module; extra layout is in ChipTagBadgeGuidelines.module.css. */

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
    <section className={base.section} aria-labelledby={`ctb-${n}`}>
      <h2 id={`ctb-${n}`} className={base.h2}>
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

/** A figure with a stage and a caption underneath. */
function Fig({ caption, children, title, tall }: { caption: ReactNode; children: ReactNode; title?: string; tall?: boolean }) {
  return (
    <figure className={s.fig}>
      {title ? <h3 className={s.figTitle}>{title}</h3> : null}
      <div className={`${s.stage} ${tall ? s.stageTall : ''}`}>{children}</div>
      <figcaption className={s.figcaption}>{caption}</figcaption>
    </figure>
  );
}

const Label = ({ n }: { n: number }) => <span className={s.num}>{n}</span>;

/* Hand-built wrong examples for section 07. These are deliberately not the components. */
const BadRedTag = ({ children }: { children: ReactNode }) => <span className={s.badRedTag}>{children}</span>;
const BadCaps = ({ children }: { children: ReactNode }) => <span className={s.badCaps}>{children}</span>;

const toneIcon: Record<BadgeTone, ReactNode> = {
  neutral: labelIcons.clock,
  info: labelIcons.info,
  success: labelIcons.checkCircle,
  warning: labelIcons.alert,
  danger: labelIcons.alert,
};
const toneRows: { tone: BadgeTone; name: string; sample: string; use: string }[] = [
  { tone: 'neutral', name: 'Neutral', sample: 'Pending', use: 'Dismissed, draft, not started, “1 custom”' },
  { tone: 'info', name: 'Info', sample: 'Extra time', use: 'Accommodation, live, new; nothing to fix' },
  { tone: 'success', name: 'Success', sample: 'Passed', use: 'Valid, passed, submitted, online' },
  { tone: 'warning', name: 'Warning', sample: 'Looking away ×9', use: 'Needs a look: medium alerts, reply pending' },
  { tone: 'danger', name: 'Danger', sample: 'Failed', use: 'High alerts, failed, flagged, offline' },
];

function SingleDemo({ small }: { small?: boolean }) {
  const [v, setV] = useState('all');
  return (
    <ChipGroup mode="single" label="Filter conversations" value={v} onValueChange={setV} size={small ? 'sm' : 'md'}>
      <Chip value="all" label="All" count={9} />
      <Chip value="replies" label="Replies pending" count={6} />
      <Chip value="flagged" label="Flagged" count={3} />
    </ChipGroup>
  );
}
function MultiDemo() {
  const [v, setV] = useState<string[]>(['high', 'medium']);
  return (
    <ChipGroup mode="multi" label="Alert level" value={v} onValueChange={setV} size="sm">
      <Chip value="high" label="High" />
      <Chip value="medium" label="Medium" />
      <Chip value="low" label="Low" />
      <Chip value="resolved" label="Resolved" />
    </ChipGroup>
  );
}
function InputDemo() {
  const [people, setPeople] = useState(['Aarav Nair', 'Riya Kapoor']);
  return (
    <div className={s.field}>
      {people.map((p) => (
        <InputChip key={p} label={p} initials={p.split(' ').map((w) => w[0]).join('')} onRemove={() => setPeople(people.filter((x) => x !== p))} />
      ))}
      <span className={s.fieldHint}>Add student…</span>
    </div>
  );
}

export function ChipTagBadgeGuidelines() {
  return (
    <main className={base.page} id="main">
      <header>
        <p className={base.eyebrow}>SkillWiz design system · Components</p>
        <h1 className={base.title}>Chip, tag &amp; badge</h1>
        <p className={base.lead}>
          Three small labels that look alike and do different jobs. A badge shows a state or a number, a tag says what something is, a chip is a control you press. This page sets one size, shape and colour rule for each. AI tools: start with section 09, which holds the token map.
        </p>
        <p className={s.meta}>Added 19 Nov 2026. Based on the live wall, admin dashboard, review report and coding exam screens. Section 06 lists what differs today.</p>
      </header>

      <Section n="01" title="Which one?" intro="Answer one question to pick the component. Shape tells people which is which before they read it.">
        <div className={s.three}>
          <div className={s.pick}>
            <div className={s.pickStage}>
              <Badge tone="warning" icon={labelIcons.alert}>Looking away ×9</Badge>
              <Badge tone="danger" emphasis="solid">Risk 96</Badge>
              <Badge tone="success">Valid</Badge>
              <CountBadge count={3} placement="label" tone="neutral" />
            </div>
            <h3 className={s.pickTitle}>Badge</h3>
            <p className={s.pickQ}>Does it show a state, a score or a number that changes?</p>
            <p>Read-only. Coloured by meaning: neutral, info, success, warning, danger. Square corners (4px).</p>
            <p className={base.muted}>Alert counts on wall cards, risk score, review status, test results, unread counts.</p>
          </div>
          <div className={s.pick}>
            <div className={s.pickStage}>
              <Tag>Coding</Tag>
              <Tag>Easy</Tag>
              <Tag icon={labelIcons.video}>Webcam</Tag>
              <Tag icon={labelIcons.monitor}>Screen</Tag>
            </div>
            <h3 className={s.pickTitle}>Tag</h3>
            <p className={s.pickQ}>Does it say what something is?</p>
            <p>Read-only. Always neutral, outlined, so it never competes with a badge. Square corners (4px).</p>
            <p className={base.muted}>Question type and difficulty, camera source, subject, section name.</p>
          </div>
          <div className={s.pick}>
            <div className={s.pickStage}>
              <Chip label="All" count={9} selected />
              <Chip label="Flagged" count={3} />
            </div>
            <h3 className={s.pickTitle}>Chip</h3>
            <p className={s.pickQ}>Can people click it, toggle it or remove it?</p>
            <p>Interactive. Fully round, so the shape alone says “you can press this”. Filter chips toggle; input chips remove.</p>
            <p className={base.muted}>Filters above lists, chosen students in the message composer, selected tags in a field.</p>
          </div>
        </div>
        <p className={s.rule}>
          <b className={base.strong}>The rule in one line:</b> square corners are labels you read, round corners are controls you press. A tag or badge never has a hover state; a chip always does.
        </p>
      </Section>

      <Section n="02" title="Anatomy" intro="Each component at 2× with its parts, and one spec sheet for all three.">
        <div className={s.three}>
          <Fig tall title="Badge" caption={<><Label n={1} /> Container · <Label n={2} /> Icon · <Label n={3} /> Label</>}>
            <div className={s.zoom}><Badge tone="warning" icon={labelIcons.alert}>Looking away ×9</Badge></div>
          </Fig>
          <Fig tall title="Tag" caption={<><Label n={1} /> Container + border · <Label n={2} /> Icon · <Label n={3} /> Label</>}>
            <div className={s.zoom}><Tag icon={labelIcons.video}>Webcam</Tag></div>
          </Fig>
          <Fig tall title="Chip" caption={<><Label n={1} /> Container · <Label n={2} /> Check · <Label n={3} /> Label · <Label n={4} /> Count</>}>
            <div className={s.zoom}><Chip label="Flagged" count={3} selected /></div>
          </Fig>
        </div>
        <p className={base.muted}>Medium is the default; Small sits inside dense rows and cards.</p>
        <Table
          head={['Property', 'Badge', 'Tag', 'Chip']}
          rows={[
            ['Use', 'State, score, count', 'What something is', 'Filter or chosen item'],
            ['Interactive', 'No', 'No', 'Yes: toggle or remove'],
            ['Height', 'M 24 · S 20', 'M 24 · S 20', 'M 36 · S 28'],
            ['Padding', 'M 8 · S 6', 'M 8 · S 6', 'M 0 16 · S 0 12 (12 / 8 beside a check or count)'],
            ['Type', 'M 12/18 · S 11/18 bold', 'M 12/18 · S 11/18 semibold', 'M 14/20 · S 12/18 semibold'],
            ['Radius', '4px', '4px', 'Fully round'],
            ['Border', 'None', '1px default border', '1px default border'],
            ['Fill', 'Tone subtle (solid for high)', 'Surface', 'Surface · selected tint when on'],
            ['Icon', 'M 14 · S 12, leading', 'M 14 · S 12, secondary text', '16 check when on · 14 × to remove'],
            ['Gap', '4px', '4px', 'M 6 · S 4'],
            ['Max label', '24 characters', '20 characters', '28 characters, then ellipsis'],
            ['Between items', '4px · wrap', '4px · wrap', '8px · wrap or scroll'],
          ]}
        />
      </Section>

      <Section n="03" title="Badge" intro="Five tones, two sizes, subtle by default. Solid only for the one thing that must be seen first.">
        <Table
          head={['Tone', 'Subtle · M', 'Subtle · S', 'With icon', 'Solid · M', 'Use for']}
          rows={toneRows.map((r) => [
            r.name,
            <Badge key="m" tone={r.tone}>{r.sample}</Badge>,
            <Badge key="s" tone={r.tone} size="sm">{r.sample}</Badge>,
            <Badge key="i" tone={r.tone} icon={toneIcon[r.tone]}>{r.sample}</Badge>,
            <Badge key="x" tone={r.tone} emphasis="solid" icon={r.tone === 'warning' || r.tone === 'danger' ? labelIcons.alert : undefined}>{r.sample}</Badge>,
            r.use,
          ])}
        />
        <div className={s.three}>
          <Fig title="Solid = one per card" caption="Use the solid fill only for the single thing that must be seen first: a high risk score, a Live marker. Everything else stays subtle.">
            <Badge tone="danger" emphasis="solid" icon={labelIcons.alert}>Risk 96</Badge>
            <Badge tone="danger">Risk 64</Badge>
            <Badge tone="neutral">Risk 22</Badge>
          </Fig>
          <Fig title="Numbers inside the label" caption="Write the count in the words (“4 passed”, “Looking away ×9”). Tabular figures, so columns of badges line up.">
            <Badge tone="success">4 passed</Badge>
            <Badge tone="danger">1 failed</Badge>
            <Badge tone="neutral">1 custom</Badge>
          </Fig>
          <Fig title="Count badge" caption="Round, number only. Red on an icon for unread (18px, 2px white ring); grey next to a label or tab (20px). Hidden at 0, “99+” above 99.">
            <CountBadge count={3} />
            <CountBadge count={120} />
            <CountBadge count={12} placement="label" tone="neutral" />
          </Fig>
        </div>
      </Section>

      <Section n="04" title="Tag" intro="Neutral, outlined, with an optional icon. Two sizes.">
        <div className={s.three}>
          <Fig title="Plain" caption="The default. Question type, difficulty, subject, section. No colour by value: “Hard” is not red, it is a fact, not a warning.">
            <Tag>Coding</Tag><Tag>MCQ</Tag><Tag>Easy</Tag><Tag>Hard</Tag>
          </Fig>
          <Fig title="With icon" caption="A 14px Lucide icon in secondary text when the category has a well-known icon. Camera sources on the live wall use this.">
            <Tag icon={labelIcons.video}>Webcam</Tag><Tag icon={labelIcons.monitor}>Screen</Tag><Tag icon={labelIcons.eye}>Third eye</Tag>
          </Fig>
          <Fig title="Small" caption="20px, 11px text. Inside camera tiles, table cells and dense cards, where a 24px tag would crowd the row.">
            <Tag size="sm" icon={labelIcons.video}>Webcam</Tag><Tag size="sm" icon={labelIcons.monitor}>Screen</Tag><Tag size="sm">Coding</Tag><Tag size="sm">Easy</Tag>
          </Fig>
        </div>
      </Section>

      <Section n="05" title="Chip" intro="Filter chips toggle a view; input chips hold chosen items and can be removed.">
        <div className={s.three}>
          <Fig caption={<><b className={base.strong}>Default</b>: surface fill, default border, semibold 14px.</>}><Chip label="Flagged" count={3} /></Fig>
          <Fig caption={<><b className={base.strong}>Hover</b>: muted fill, strong border, 120ms. Hover pointers only.</>}><Chip label="Flagged" count={3} forceState="hover" /></Fig>
          <Fig caption={<><b className={base.strong}>Selected</b>: selected tint, focus-blue border, link text, a check before the label. Not colour alone.</>}><Chip label="Flagged" count={3} selected /></Fig>
          <Fig caption={<><b className={base.strong}>Focus</b>: 2px ring, 2px offset.</>}><Chip label="Flagged" count={3} forceState="focus" /></Fig>
          <Fig caption={<><b className={base.strong}>Pressed</b>: 0.96 scale for 150ms, then toggles.</>}><Chip label="Flagged" count={3} forceState="pressed" /></Fig>
          <Fig caption={<><b className={base.strong}>Disabled</b>: only when the filter can’t apply yet (while loading). A filter with 0 results stays enabled and shows 0.</>}><Chip label="Flagged" count={0} disabled /></Fig>
        </div>
        <h3 className={base.h3}>Filter chips · single and multi select</h3>
        <div className={s.three}>
          <Fig title="Single select" caption={<>One is always on, usually “All”. Works like a segmented control but keeps counts. <code>role=&quot;radiogroup&quot;</code>.</>}><SingleDemo /></Fig>
          <Fig title="Multi select · Small" caption="Any number on, including none (= no filter). Small chips for filters inside panels and drawers."><MultiDemo /></Fig>
          <Fig title="Input chips" caption="Things chosen in a field: students in the message composer, tags on a question. × removes; Backspace in an empty field removes the last one."><InputDemo /></Fig>
        </div>
      </Section>

      <Section n="06" title="In context" intro="Where each one sits on SkillWiz screens, and what changes on the screens that differ today.">
        <div className={s.three}>
          <div className={s.scene}>
            <div className={s.sceneRow}><b className={base.strong}>Aarav Nair</b><Badge tone="danger" emphasis="solid" icon={labelIcons.alert}>Risk 96</Badge></div>
            <div className={s.sceneRow}><Tag size="sm" icon={labelIcons.video}>Webcam</Tag><Tag size="sm" icon={labelIcons.monitor}>Screen</Tag></div>
            <div className={s.sceneRow}><Badge tone="warning" icon={labelIcons.alert}>Looking away ×9</Badge><Badge tone="warning" icon={labelIcons.alert}>Second person</Badge></div>
            <p className={s.sceneCap}><b className={base.strong}>Live wall card</b> — solid danger badge for risk (one per card), small tags for camera sources, subtle badges for alert counts.</p>
          </div>
          <div className={s.scene}>
            <div className={s.sceneSplit}><span>Phone detected</span><Badge tone="success">Valid</Badge></div>
            <div className={s.sceneSplit}><span>Tab switch ×2</span><Badge tone="neutral">Pending</Badge></div>
            <div className={s.sceneSplit}><span>Looking away</span><Badge tone="neutral">Dismissed</Badge></div>
            <p className={s.sceneCap}><b className={base.strong}>Review report</b> — status per alert as a badge at the row end: success Valid, neutral Pending and Dismissed.</p>
          </div>
          <div className={s.scene}>
            <div className={s.sceneSplit}><span>Q4 · Two-sum variants</span><span className={s.sceneRow}><Tag>Coding</Tag><Tag>Easy</Tag></span></div>
            <div className={s.sceneRow}><Badge tone="success">4 passed</Badge><Badge tone="danger">1 failed</Badge><Badge tone="neutral">1 custom</Badge><Badge tone="info">Extra time</Badge></div>
            <p className={s.sceneCap}><b className={base.strong}>Coding question</b> — tags for type and difficulty; badges for test results and the extra-time accommodation.</p>
          </div>
          <div className={s.scene}>
            <SingleDemo small />
            <div className={s.sceneSplit}><span>“Is Q3 out of syllabus?”</span><Badge tone="warning">Reply pending</Badge></div>
            <p className={s.sceneCap}><b className={base.strong}>Admin “Waiting on you”</b> — filter chips with counts above the list; warning badge on each item.</p>
          </div>
          <div className={s.scene}>
            <div className={s.field}>
              <span className={s.fieldHint}>To</span>
              <InputChip label="Aarav Nair" initials="AN" onRemove={() => undefined} />
              <span className={s.fieldHint}>3 more</span>
            </div>
            <p className={s.sceneCap}><b className={base.strong}>Message composer</b> — input chips for recipients; collapse past two into “3 more”.</p>
          </div>
          <div className={s.scene}>
            <div className={s.sceneRow}>
              <span className={s.iconBtn}>{labelIcons.alert}<CountBadge count={3} className={s.pos} /></span>
              <span className={s.iconBtn}>{labelIcons.info}<CountBadge count={3} className={s.pos} /></span>
            </div>
            <p className={s.sceneCap}><b className={base.strong}>Top navigation</b> — blue count badges on Messages and Notifications. The PDF’s token list says red; the Top navigation bar page follows the drawings, so the count badge has a blue tone as well.</p>
          </div>
        </div>
        <h3 className={base.h3}>Screens to align</h3>
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Live wall V2 · 01–07', 'Alert chips 22px, source flags 20px filled at 11px; risk shown as “▲ RISK 96” in caps', 'Badge M for alerts, Tag S for sources, solid danger Badge “Risk 96”, sentence case, Lucide triangle'],
            ['Card states (collapsed)', 'Amber chips at 26px and 30px, 13px text', 'Badge M warning, 24px, 12px'],
            ['Admin dashboard (redesign)', '“Reply pending / Flagged” fully round', 'Badge with the 4px radius; round is kept for the filter chips above'],
            ['Admin dashboard filters', '34px tabs-style buttons with square count', 'Filter chips M 36px, round count'],
            ['Review report', '“Valid / Pending / Dismissed” 19px, semibold', 'Badge M 24px, bold, tone by status'],
            ['Coding question (SE-06)', '“Coding / Easy” filled grey 24px; test badges 22px', 'Tag M outlined; Badge M 24px'],
          ]}
        />
      </Section>

      <Section n="07" title="Usage guidelines" intro="Four rules, each from something on a SkillWiz screen today.">
        <div className={s.usage}>
          <DoDont ok text="One solid badge per card. The rest stay subtle so the risk score is read first.">
            <div className={s.row}><Badge tone="danger" emphasis="solid" icon={labelIcons.alert}>Risk 96</Badge><Badge tone="warning" icon={labelIcons.alert}>Looking away ×9</Badge><Badge tone="warning" icon={labelIcons.alert}>Tab switch ×2</Badge></div>
          </DoDont>
          <DoDont ok={false} text="Make every badge solid. When everything shouts, nothing is read first.">
            <div className={s.row}><Badge tone="danger" emphasis="solid" icon={labelIcons.alert}>Risk 96</Badge><Badge tone="warning" emphasis="solid" icon={labelIcons.alert}>Looking away ×9</Badge><Badge tone="warning" emphasis="solid" icon={labelIcons.alert}>Tab switch ×2</Badge></div>
          </DoDont>
          <DoDont ok text="Keep tags neutral. Difficulty is a fact about the question.">
            <div className={s.row}><Tag>Coding</Tag><Tag>Hard</Tag></div>
          </DoDont>
          <DoDont ok={false} text="Colour a category. A red “Hard” reads as an error that needs fixing.">
            <div className={s.row}><Tag>Coding</Tag><BadRedTag>Hard</BadRedTag></div>
          </DoDont>
          <DoDont ok text="Use round chips for filters people press.">
            <div className={s.row}><Chip label="All" count={9} selected /><Chip label="Flagged" count={3} /></div>
          </DoDont>
          <DoDont ok={false} text="Use square badges as filters. They look read-only, so people don’t try them.">
            <div className={s.row}><Badge tone="info">All 9</Badge><Badge tone="neutral">Flagged 3</Badge></div>
          </DoDont>
          <DoDont ok text="Use a Lucide icon and sentence case.">
            <div className={s.row}><Badge tone="warning" icon={labelIcons.alert}>Looking away ×9</Badge></div>
          </DoDont>
          <DoDont ok={false} text="Use text glyphs like ▲ or all caps. Glyphs render differently per font and caps are slower to read.">
            <div className={s.row}><BadCaps>▲ LOOKING AWAY ×9</BadCaps></div>
          </DoDont>
        </div>
      </Section>

      <Section n="08" title="Behaviour & accessibility" intro="Badges and tags are text; chips are buttons.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Badge, Tag', <>Plain text in a <code>&lt;span&gt;</code>; no role, no tab stop. Icons are <code>aria-hidden</code>; the label carries the meaning.</>],
            ['Never colour alone', 'Tone always comes with words (“Failed”, “Risk 96”). Warning and danger badges about proctoring alerts add the triangle icon.'],
            ['Count badge', 'Not read on its own: the button’s name includes it (“Messages, 3 unread”).'],
            ['Filter chip', <><code>&lt;button aria-pressed&gt;</code> for multi select; single-select sets use <code>role=&quot;radiogroup&quot;</code> with <code>role=&quot;radio&quot;</code> + <code>aria-checked</code>. The count is part of the name: “Flagged, 3”.</>],
            ['Keyboard', 'Tab reaches the chip set; arrow keys move inside a single-select set; Space or Enter toggles.'],
            ['Input chip', <>The chip is text; its × is a <code>&lt;button aria-label=&quot;Remove Aarav Nair&quot;&gt;</code>. Backspace in the empty field removes the last chip and announces it.</>],
            ['Results', 'After a filter changes, announce the result once in a polite live region: “6 conversations”.'],
            ['Contrast', 'Every subtle tone uses its text token on its subtle fill (≥ 4.5:1). Solid warning uses dark text, not white.'],
            ['Targets', 'Chips 36px (28px small, with 4px spacing). The × hit area is 24px inside the chip.'],
            ['Truncation', 'Labels over the max length end in an ellipsis; the full text is in a tooltip and in the accessible name.'],
          ]}
        />
      </Section>

      <Section n="09" title="Tokens" intro="These components use only these tokens. No raw hex values.">
        <Table
          head={['Part', 'Tokens']}
          rows={[
            ['Badge · shape', toks('badge.radius', 'badge.height', 'badge.height-sm', 'badge.font-size', 'badge.font-size-sm', 'badge.line-height', 'badge.font-weight', 'badge.padding-x', 'badge.padding-x-sm', 'badge.gap')],
            ['Badge · subtle', toks('badge.neutral-subtle-bg', 'badge.neutral-subtle-text', 'badge.info-subtle-bg', 'badge.info-subtle-text', 'badge.success-subtle-bg', 'badge.success-subtle-text', 'badge.warning-subtle-bg', 'badge.warning-subtle-text', 'badge.danger-subtle-bg', 'badge.danger-subtle-text')],
            ['Badge · solid', toks('badge.neutral-solid-bg', 'badge.info-solid-bg', 'badge.success-solid-bg', 'badge.warning-solid-bg', 'badge.warning-solid-text', 'badge.danger-solid-bg', 'badge.danger-solid-text')],
            ['Tag', toks('tag.radius', 'tag.bg', 'tag.border', 'tag.text', 'tag.icon', 'tag.font-weight', 'tag.height', 'tag.height-sm')],
            ['Chip', toks('filter-chip.height', 'filter-chip.height-sm', 'filter-chip.radius', 'filter-chip.bg', 'filter-chip.border', 'filter-chip.text', 'filter-chip.font-size', 'filter-chip.font-size-sm', 'filter-chip.font-weight')],
            ['Chip · hover', toks('filter-chip.hover-bg', 'filter-chip.hover-border', 'filter-chip.hover-duration', 'filter-chip.easing')],
            ['Chip · selected', toks('filter-chip.selected-bg', 'filter-chip.selected-border', 'filter-chip.selected-text')],
            ['Chip · disabled', toks('filter-chip.disabled-text', 'filter-chip.disabled-border')],
            ['Chip · input', toks('filter-chip.input-padding-x', 'filter-chip.input-avatar-size', 'filter-chip.input-avatar-bg', 'filter-chip.remove-hit', 'filter-chip.remove-icon')],
            ['Count', toks('count-badge.radius', 'count-badge.size', 'count-badge.size-icon', 'count-badge.font-size', 'count-badge.font-size-icon', 'count-badge.neutral-bg', 'count-badge.neutral-text', 'count-badge.danger-bg', 'count-badge.danger-text', 'count-badge.info-bg', 'count-badge.ring-width', 'count-badge.ring-color')],
            ['Focus ring', toks('filter-chip.focus-color', 'filter-chip.focus-width', 'filter-chip.focus-offset')],
          ]}
        />
      </Section>
    </main>
  );
}
