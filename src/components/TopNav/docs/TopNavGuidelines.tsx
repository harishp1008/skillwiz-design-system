import { useState, type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { TopNav, type TopNavContext, type TopNavItem, type TopNavProps } from '../TopNav';
import { navIcons } from '../icons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './TopNavGuidelines.module.css';

/* Page chrome (section, table, do/don't) is shared with the Button page via its CSS module; extra layout is in TopNavGuidelines.module.css. */

const adminItems: TopNavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'course', label: 'Course' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'classroom', label: 'Classroom' },
  { id: 'live-board', label: 'Live Board' },
  { id: 'content', label: 'Content' },
  { id: 'question-bank', label: 'Question Bank' },
];
const demoItems: TopNavItem[] = [adminItems[0]!, adminItems[4]!, adminItems[1]!];
const proctorItems = adminItems.slice(0, 5);
const locations: TopNavContext[] = [
  { id: 'lpu-class', label: 'LPU_Class' },
  { id: 'lpu-batch-b', label: 'LPU_Batch_B' },
  { id: 'all', label: 'All classes' },
];
const longLocations: TopNavContext[] = [
  { id: 'lpu', label: 'Lovely Professional University' },
  { id: 'lpu-class', label: 'LPU_Class' },
];

const counts = { mail: { count: 3 }, messages: { count: 3 }, notifications: { count: 3 } };

function Bar(props: Partial<TopNavProps> & { width?: number | string }) {
  const { width, currentId: initialCurrent = 'live-board', contextId: initialContext = 'lpu-class', ...rest } = props;
  // Clicking an item in the docs only moves the active state; nothing navigates.
  const [current, setCurrent] = useState(initialCurrent);
  const [ctx, setCtx] = useState(initialContext);
  return (
    <div className={s.frame} style={{ width: width ?? '100%' }}>
      <TopNav
        items={adminItems}
        contexts={locations}
        contextKind="Class"
        initials="AN"
        mode="wide"
        {...counts}
        {...rest}
        currentId={current}
        contextId={ctx}
        onNavigate={setCurrent}
        onContextChange={setCtx}
      />
    </div>
  );
}

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
const toks = (...paths: TokenPath[]) => (
  <div className={s.toks}>
    {paths.map((p) => (
      <div key={p}>
        <Tok path={p} />
      </div>
    ))}
  </div>
);

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`tn-${n}`}>
      <h2 id={`tn-${n}`} className={base.h2}>
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
      <div className={base.ddStage}>{children}</div>
      <div className={`${base.ddFoot} ${ok ? '' : base.ddFootBad}`}>
        <span className={`${base.ddIcon} ${ok ? '' : base.ddIconBad}`} aria-hidden="true">
          {ok ? navIcons.checkCircle : navIcons.xCircle}
        </span>
        <span>
          <b className={base.strong}>{ok ? 'Do.' : 'Don’t.'}</b> {text}
        </span>
      </div>
    </div>
  );
}

const Caption = ({ children }: { children: ReactNode }) => <p className={s.caption}>{children}</p>;
const Label = ({ n }: { n: number }) => <span className={s.num}>{n}</span>;

/* Hand-built wrong examples for section 05. These are deliberately not the component. */
const BadBar = ({ children }: { children: ReactNode }) => <div className={s.bad}>{children}</div>;

export function TopNavGuidelines() {
  return (
    <main className={base.page} id="main">
      <header>
        <p className={base.eyebrow}>SkillWiz design system · Components</p>
        <h1 className={base.title}>Top navigation bar</h1>
        <p className={base.lead}>
          The bar at the top of every admin, instructor and proctor screen: where you are, where else you can go, which location or class you are looking at, and what needs your attention. One component, three set-ups by role. AI tools: start with section 07, which holds the token map and the code spec.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="A 72px white bar: logo, the main sections, a More menu for overflow, then the page’s scope and the user’s utilities on the right.">
        <Bar />
        <Table
          head={['#', 'Part', 'Rule']}
          rows={[
            [<Label n={1} key="1" />, 'Bar', <>A <code>&lt;header&gt;</code>, full width, sticky. White with a 1px bottom border; no shadow until the page scrolls under it.</>],
            [<Label n={2} key="2" />, 'Logo', 'The logo as an inline SVG, linking to the role’s home (Dashboard). SkillWiz by default; a college replaces it with its own SVG through the `logo` prop. The link’s name is the organisation’s name.'],
            [<Label n={3} key="3" />, 'Nav item', 'Top-level sections for the signed-in role. Semibold 16px label, sentence case, one or two words. No icons.'],
            [<Label n={4} key="4" />, 'Current page', <>Exactly one item. Tinted pill and link colour, <code>aria-current="page"</code>.</>],
            [<Label n={5} key="5" />, 'More menu', 'Holds the items that do not fit. If the current page is inside More, it swaps into the visible row.'],
            [<Label n={6} key="6" />, 'Context selector', 'The location or class the whole page is scoped to. Outlined, pin icon, chevron. A selector, never a filled chip.'],
            [<Label n={7} key="7" />, 'Icon button', 'Messages, Notifications, Mail, in that order: Mail sits furthest right, next to the avatar. Round, outlined, 40px, with a tooltip of the same name as the label.'],
            [<Label n={8} key="8" />, 'Count badge', 'Unread count on Messages and Notifications only (and Mail where shown). 1–99, then “99+”. No badge when the count is 0.'],
            [<Label n={9} key="9" />, 'Avatar', 'Initials of the signed-in user. Opens the account menu: profile, switch role, help, sign out.'],
          ]}
        />
        <Table
          head={['Property', 'Value', 'Token']}
          rows={[
            ['Height', '72px', toks('top-nav.height' as TokenPath)],
            ['Side padding', '32px · 24px · 16px by width', toks('top-nav.padding-x' as TokenPath)],
            ['Background and border', 'White, 1px bottom border', toks('top-nav.bg' as TokenPath, 'top-nav.border-color' as TokenPath)],
            ['Logo', 'SVG drawn at 24px high, width follows the artwork. SkillWiz mark: 19px bold, “Skill” teal + “Wiz” indigo. 48px after', toks('top-nav.logo-font-size' as TokenPath, 'top-nav.logo-color-skill' as TokenPath, 'top-nav.logo-color-wiz' as TokenPath)],
            ['Nav item', '36px tall, 8px padding, 16 / 20 semibold, 12px gap', toks('top-nav.item-height' as TokenPath, 'top-nav.item-padding-x' as TokenPath, 'top-nav.item-gap' as TokenPath)],
            ['Current page', 'Tinted pill + link colour', toks('top-nav.item-current-bg' as TokenPath, 'top-nav.item-current-text' as TokenPath)],
          ]}
        />
      </Section>

      <Section n="02" title="Variants" intro="The bar is the same everywhere; what changes is which items, selector and utilities the role gets.">
        <div className={s.variants}>
          <div>
            <Caption><b>Admin</b> · Selector: location. Every section the admin can reach, a location selector and all three utilities. Items past the fifth go into More at this width.</Caption>
            <Bar maxVisible={5} contextKind="Location" />
          </div>
          <div>
            <Caption><b>Proctor</b> · Selector: class. Same bar, fewer items. Mail is dropped because proctors message students from the wall.</Caption>
            <Bar items={proctorItems} mail={false} contextKind="Class" />
          </div>
          <div>
            <Caption><b>Single scope</b> · No selector. For roles with one location or class there is nothing to switch, so the selector is hidden. Never show a disabled selector.</Caption>
            <Bar items={proctorItems} contexts={undefined} mail={false} />
          </div>
        </div>
        <p className={base.intro}>
          <b className={base.strong}>Not this component:</b> the student exam header. During an exam the student sees the focus header, and the top navigation bar is never shown, so students cannot leave by accident.
        </p>
      </Section>

      <Section n="03" title="States" intro="Every interactive part of the bar, with the token behind each state. Hover only applies on devices that can hover; the pressed scale runs under no-preference motion only.">
        <Caption><b>Nav item</b></Caption>
        <div className={s.states}>
          <figure><Bar items={[{ id: 'c', label: 'Course' }]} currentId="x" contexts={undefined} mail={false} messages={false} notifications={false} initials=""  /><figcaption>Default · semibold 16px, body text, no background.</figcaption></figure>
          <figure><Bar items={[{ id: 'c', label: 'Course' }]} currentId="x" contexts={undefined} mail={false} messages={false} notifications={false} initials=""  forceState={{ id: 'c', state: 'hover' }} /><figcaption>Hover · muted background, 120ms.</figcaption></figure>
          <figure><Bar items={[{ id: 'c', label: 'Course' }]} currentId="c" contexts={undefined} mail={false} messages={false} notifications={false} initials=""  /><figcaption>Current page · tint + link colour. Hover leaves it unchanged.</figcaption></figure>
          <figure><Bar items={[{ id: 'c', label: 'Course' }]} currentId="x" contexts={undefined} mail={false} messages={false} notifications={false} initials=""  forceState={{ id: 'c', state: 'focus' }} /><figcaption>Focus · 2px ring, 2px offset, keyboard only.</figcaption></figure>
          <figure><Bar items={[{ id: 'c', label: 'Course' }]} currentId="x" contexts={undefined} mail={false} messages={false} notifications={false} initials=""  forceState={{ id: 'c', state: 'pressed' }} /><figcaption>Pressed · muted background and 0.96 scale for 150ms.</figcaption></figure>
        </div>
        <Caption><b>Utilities</b></Caption>
        <div className={s.states}>
          <figure><Bar items={[]} currentId="x" contexts={longLocations} contextId="lpu" mail={false} messages={false} notifications={false} initials=""  /><figcaption>Selector · long value. Truncates at 200px; never wraps and never pushes the icon buttons off the bar. The full text shows in a tooltip.</figcaption></figure>
          <figure><Bar items={[]} currentId="x" contexts={undefined} mail={{ count: 3 }} messages={{ count: 12 }} notifications={{ count: 120 }} initials=""  /><figcaption>Count badge · 1, 2 digits, then 99+. Sits on the icon’s top-right corner, no ring.</figcaption></figure>
        </div>
        <Caption><b>Open menus</b></Caption>
        <div className={s.menus}>
          <figure><div className={s.menuStage}><Bar items={adminItems} currentId="dashboard" maxVisible={5} contexts={undefined} mail={false} messages={false} notifications={false} defaultOpen="more" initials=""  /></div><figcaption>More · open. Menu under the item, 4px gap. Same items, same order as on wide screens.</figcaption></figure>
          <figure><div className={s.menuStage}><Bar items={[]} currentId="x" contextKind="Class" defaultOpen="context" mail={false} messages={false} notifications={false} initials=""  /></div><figcaption>Selector · open. Focus border, list of locations or classes, the current one ticked. Changing it reloads the page’s data, not the page.</figcaption></figure>
          <figure><div className={s.menuStage}><Bar items={[]} currentId="x" contexts={undefined} mail={false} messages={false} notifications={false} defaultOpen="account" initials="AN"  /></div><figcaption>Avatar · menu open, focus-coloured ring. Initials only; a photo uses the same 36px circle inside a 40px ring.</figcaption></figure>
        </div>
      </Section>

<Section n="04" title="Widths" intro="The bar never wraps to two lines. As the window narrows, items move into More, then into a drawer.">
        <Caption><b>≥ 1440px</b> · Up to 7 items in the row.</Caption>
        <Bar maxVisible={5} />
        <Caption><b>1024–1439px</b> · Items that do not fit move into More, from the right. Mail moves into the avatar menu.</Caption>
        <Bar mode="medium" width={1100} />
        <Caption><b>&lt; 1024px</b> · A menu button opens all items in a side drawer. The selector, Messages, Notifications and avatar stay.</Caption>
        <Bar mode="narrow" width={560} />
        <Table
          head={['Width', 'Items', 'Utilities', 'Side padding']}
          rows={[
            ['≥ 1440px', 'Up to 7, rest in More', 'Selector, Messages, Notifications, Mail, avatar', '32px'],
            ['1024–1439px', 'As many as fit, rest in More; current page always visible', 'Mail moves into the avatar menu', '24px'],
            ['< 1024px', 'Menu button + drawer', 'Selector, Messages, Notifications, avatar', '16px'],
          ]}
        />
      </Section>

      <Section n="05" title="Usage guidelines" intro="Four rules, each from something on a SkillWiz screen today.">
        <div className={s.usage}>
          <DoDont ok text="Show the class or location as an outlined selector with a pin and chevron, so it reads as “you can change this”.">
            <Bar mode="medium" showAllItems items={demoItems} currentId="live-board" mail={false} messages={false} notifications={false} initials="" />
          </DoDont>
          <DoDont ok={false} text="Use a filled blue chip. It looks exactly like the current page pill, so people read “LPU_Class” as a second selected page.">
            <BadBar><span className={s.badPill}>Live Board</span><span className={s.badPill}>LPU_Class</span></BadBar>
          </DoDont>
          <DoDont ok text="Mark the current section with the tinted pill. One item, always.">
            <Bar mode="medium" showAllItems items={demoItems} currentId="live-board" contexts={undefined} mail={false} />
          </DoDont>
          <DoDont ok={false} text="Use an underline here. Underlines are for tabs inside a page; the top bar uses the pill.">
            <BadBar><span>Dashboard</span><span className={s.badUnderline}>Live Board</span><span>Course</span></BadBar>
          </DoDont>
          <DoDont ok text="Show a badge only when there is something unread, with the real number.">
            <Bar mode="medium" showAllItems items={demoItems} currentId="live-board" contexts={undefined} mail={false} />
          </DoDont>
          <DoDont ok={false} text="Show “0” or a dot with no number. A dot that never clears teaches people to ignore it.">
            <BadBar><span>Dashboard</span><span>Live Board</span><span className={s.badBadge}>0</span><span className={s.badDot} /></BadBar>
          </DoDont>
          <DoDont ok text="Use the SkillWiz wordmark as live text, linking to Dashboard.">
            <Bar mode="medium" showAllItems items={demoItems} currentId="live-board" contexts={undefined} mail={false} messages={false} notifications={false} initials="" />
          </DoDont>
          <DoDont ok={false} text="Ship a bitmap logo. It blurs on dense screens and can’t be recoloured. Pass an SVG.">
            <BadBar><span className={s.badImg}>SkillWiz</span><span>Dashboard</span><span>Live Board</span></BadBar>
          </DoDont>
        </div>
      </Section>

      <Section n="06" title="Behaviour & accessibility" intro="A site header with a main navigation landmark and three menu buttons.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Landmarks', <><code>&lt;header&gt;</code> holds the bar; the items sit in <code>&lt;nav aria-label="Main"&gt;</code>. One main nav per page.</>],
            ['Skip link', <>First focusable element is a “Skip to content” link, visible on focus, that jumps to <code>&lt;main&gt;</code>.</>],
            ['Current page', <><code>aria-current="page"</code> on the current item. Shown by fill and colour, never colour alone.</>],
            ['Items are links', <>Nav items are <code>&lt;a href&gt;</code> so they open in new tabs and work with Back. Only More is a <code>&lt;button&gt;</code>.</>],
            ['Focus order', 'Skip link → logo → items → More → selector → Messages → Notifications → Mail → avatar.'],
            ['Menus', <>More, selector and avatar follow the menu button pattern: <code>aria-haspopup</code>, <code>aria-expanded</code>; ↑ / ↓ to move, Enter to choose, Esc closes and returns focus.</>],
            ['Names', 'Icon buttons have a name and a matching tooltip; the count is part of the name: “Messages, 3 unread”. New counts update silently.'],
            ['Selector', 'Name includes the current value: “Class: LPU_Class”. Changing it should announce “Showing …” (a live-region announcer is a later step).'],
            ['Targets', 'Items 36px tall, icon buttons 40px, avatar 40px (36px photo inside a ring); at least 4px apart.'],
            ['Motion', 'Hover colour 120ms. The pressed scale only runs under no-preference motion.'],
            ['Zoom', 'At 200% zoom the bar follows the < 1024px layout; nothing is clipped and the bar never wraps to two lines.'],
          ]}
        />
      </Section>

      <Section n="07" title="Tokens & code spec" intro="The bar uses only these tokens. No raw colours. Each row shows the component token and what it maps to.">
        <SourceLinks
          items={[
            { label: 'Top navigation bar source', path: 'src/components/TopNav' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <Table
          head={['Element', 'Tokens']}
          rows={[
            ['Bar', toks('top-nav.height' as TokenPath, 'top-nav.bg' as TokenPath, 'top-nav.border-color' as TokenPath, 'top-nav.padding-x' as TokenPath, 'top-nav.z-index' as TokenPath, 'top-nav.shadow-scrolled' as TokenPath)],
            ['Logo', toks('top-nav.logo-font-size' as TokenPath, 'top-nav.logo-line-height' as TokenPath, 'top-nav.logo-font-weight' as TokenPath, 'top-nav.logo-color-skill' as TokenPath, 'top-nav.logo-color-wiz' as TokenPath, 'top-nav.logo-gap' as TokenPath)],
            ['Nav item', toks('top-nav.item-height' as TokenPath, 'top-nav.item-padding-x' as TokenPath, 'top-nav.item-gap' as TokenPath, 'top-nav.item-radius' as TokenPath, 'top-nav.item-font-size' as TokenPath, 'top-nav.item-line-height' as TokenPath, 'top-nav.item-font-weight' as TokenPath, 'top-nav.item-text' as TokenPath)],
            ['Hover and pressed', toks('top-nav.item-bg-hover' as TokenPath, 'top-nav.hover-duration' as TokenPath, 'top-nav.pressed-duration' as TokenPath, 'top-nav.pressed-scale' as TokenPath, 'top-nav.easing' as TokenPath)],
            ['Current page', toks('top-nav.item-current-bg' as TokenPath, 'top-nav.item-current-text' as TokenPath)],
            ['Context selector', toks('top-nav.selector-height' as TokenPath, 'top-nav.selector-max-width' as TokenPath, 'top-nav.selector-border' as TokenPath, 'top-nav.selector-border-hover' as TokenPath, 'top-nav.selector-border-open' as TokenPath, 'top-nav.selector-radius' as TokenPath, 'top-nav.selector-font-size' as TokenPath, 'top-nav.selector-font-weight' as TokenPath, 'top-nav.selector-text' as TokenPath, 'top-nav.selector-icon-color' as TokenPath)],
            ['Icon button', toks('top-nav.icon-button-size' as TokenPath, 'top-nav.icon-button-radius' as TokenPath, 'top-nav.icon-button-border' as TokenPath, 'top-nav.icon-button-text' as TokenPath, 'top-nav.icon-button-bg-hover' as TokenPath, 'top-nav.icon-size' as TokenPath)],
            ['Count badge', toks('top-nav.badge-bg' as TokenPath, 'top-nav.badge-text' as TokenPath, 'top-nav.badge-size' as TokenPath, 'top-nav.badge-font-size' as TokenPath)],
            ['Avatar', toks('top-nav.avatar-size' as TokenPath, 'top-nav.avatar-radius' as TokenPath, 'top-nav.avatar-bg' as TokenPath, 'top-nav.avatar-text' as TokenPath, 'top-nav.avatar-font-size' as TokenPath, 'top-nav.avatar-ring-open' as TokenPath)],
            ['Menus', toks('top-nav.menu-bg' as TokenPath, 'top-nav.menu-border' as TokenPath, 'top-nav.menu-radius' as TokenPath, 'top-nav.menu-shadow' as TokenPath, 'top-nav.menu-offset' as TokenPath)],
            ['Focus ring', toks('top-nav.focus-color' as TokenPath, 'top-nav.focus-width' as TokenPath, 'top-nav.focus-offset' as TokenPath)],
          ]}
        />
        <pre className={base.code}>{`<TopNav
  items={[{ id: 'dashboard', label: 'Dashboard', href: '/' }, …]}
  currentId="live-board"
  contexts={[{ id: 'lpu-class', label: 'LPU_Class' }, …]}   // omit for a single scope
  contextId="lpu-class"
  contextKind="Class"
  mail={{ count: 3 }}          // false drops it (Proctor)
  messages={{ count: 3 }}
  notifications={{ count: 0 }} // 0 shows no badge
  initials="AN"
/>`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">items</code>, 'TopNavItem[]', 'Sections for the role, in order.'],
            [<code key="b">currentId</code>, 'string', 'Exactly one current page.'],
            [<code key="c">contexts / contextId / contextKind</code>, 'TopNavContext[] / string / string', 'Fewer than two contexts hides the selector.'],
            [<code key="d">mail / messages / notifications</code>, '{ count?: number } | false', 'Utilities, in fixed order.'],
            [<code key="e">maxVisible</code>, 'number (7)', 'Items in the row at the widest layout.'],
            [<code key="f">onNavigate / onContextChange / onAccountAction</code>, 'callbacks', 'Without onNavigate, items are plain links.'],
            [<code key="g">mode / scrolled / forceState / defaultOpen</code>, 'docs only', 'Force a layout, the shadow, a state or an open menu for documentation.'],
          ]}
        />
      </Section>
    </main>
  );
}
