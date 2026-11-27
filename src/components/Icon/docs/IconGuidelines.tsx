import { type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Icon } from '../Icon';
import { iconNames, type IconName } from '../icons';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './IconGuidelines.module.css';

/* Page chrome (section, table, cards, do/don't) is shared with the Button page via its CSS module; extra layout is in IconGuidelines.module.css. */

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
        <Tok path={`icon.${p}` as TokenPath} />
      </div>
    ))}
  </div>
);

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`icon-${n}`}>
      <h2 id={`icon-${n}`} className={base.h2}>
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

const meaning: Record<IconName, string> = {
  'align-start-horizontal': 'Align items to the top',
  'book-open': 'Learning, courses, reading material',
  'layout-dashboard': 'Dashboard, overview',
  link: 'A link, copy or share a link',
};

export function IconGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Icons</p>
        <h1 className={base.title}>Icon set</h1>
        <p className={base.lead}>
          One shared set of line icons for the whole product. They are Lucide shapes drawn on a 24 grid with a round 2 unit line, and they take their colour from the text around them.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="Every icon follows the same drawing rules, so any two icons look like they belong together.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.stage} style={{ background: 'transparent' }}>
              <div className={s.grid}>
                <Icon name="book-open" size="lg" />
              </div>
            </div>
            <ol className={s.legend}>
              {[
                ['Grid', 'Twenty-four by twenty-four. The live area leaves two units of padding on every side.'],
                ['Line', 'A two unit stroke with round caps and round joins. Never filled.'],
                ['Colour', 'The icon takes the colour of its text (currentColor). Set the colour on the parent.'],
                ['Size', 'Small 16, medium 20, large 24. The line scales with the icon.'],
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

      <Section n="02" title="Icon set" intro="All icons in the set today. Names are the Lucide names, so they are easy to look up and easy to extend.">
        <div className={s.gallery}>
          {iconNames.map((n) => (
            <div key={n} className={s.tile}>
              <Icon name={n} size="lg" />
              <code>{n}</code>
            </div>
          ))}
        </div>
        <Table
          head={['Icon', 'Name', 'Use for']}
          rows={iconNames.map((n) => [<Icon key={n} name={n} />, <code key={`${n}-c`}>{n}</code>, meaning[n]])}
        />
      </Section>

      <Section n="03" title="Sizes" intro="Three sizes. Match the icon to the text beside it.">
        <Table
          head={['Size', 'Pixels', 'Token', 'Use']}
          rows={[
            [<Icon key="a" name="link" size="sm" />, '16', <code key="a1">--sw-icon-size-sm</code>, 'Beside small text, in dense controls and chips.'],
            [<Icon key="b" name="link" size="md" />, '20', <code key="b1">--sw-icon-size-md</code>, 'Buttons, menus and the top bar. The default.'],
            [<Icon key="c" name="link" size="lg" />, '24', <code key="c1">--sw-icon-size-lg</code>, 'On its own, in empty states and tiles.'],
          ]}
        />
      </Section>

      <Section n="04" title="Colour" intro="An icon never has a colour of its own. It inherits the text colour, so it always matches its label and its state.">
        <div className={`${base.cards} ${base.cols2}`}>
          <Card title="Inherits text colour" white text="Set the colour on the parent. Here: heading, body, muted and the action blue.">
            <span className={s.row} style={{ color: 'var(--sw-color-text-heading)' }}><Icon name="layout-dashboard" /> Dashboard</span>
            <span className={s.row} style={{ color: 'var(--sw-color-text-body)' }}><Icon name="book-open" /> Courses</span>
            <span className={s.row} style={{ color: 'var(--sw-color-text-muted)' }}><Icon name="link" /> Links</span>
            <span className={s.row} style={{ color: 'var(--sw-color-action-text)' }}><Icon name="link" /> Selected</span>
          </Card>
          <Card title="Disabled" white text="Disabled controls fade their text, and the icon fades with it.">
            <span className={s.row} style={{ color: 'var(--sw-color-text-disabled)' }}><Icon name="book-open" /> Courses</span>
          </Card>
        </div>
      </Section>

      <Section n="05" title="Usage guidelines">
        <div className={s.usage}>
          <DoDont ok text="Pair an icon with a text label so the meaning is clear.">
            <span className={s.row}><Icon name="layout-dashboard" /> Dashboard</span>
          </DoDont>
          <DoDont ok={false} text="Use an icon alone when its meaning is not obvious.">
            <Icon name="align-start-horizontal" />
          </DoDont>
          <DoDont ok text="Give an icon on its own a name with label.">
            <Icon name="link" label="Copy link" />
          </DoDont>
          <DoDont ok={false} text="Fill an icon or give it its own colour. It must follow the text.">
            <span style={{ color: 'var(--sw-color-feedback-danger-solid)' }}><Icon name="book-open" size="lg" /></span>
          </DoDont>
        </div>
      </Section>

      <Section n="06" title="Accessibility">
        <Table
          head={['Case', 'Rule']}
          rows={[
            ['Beside a text label', 'Hidden from screen readers (aria-hidden). The text already says it. This is the default.'],
            ['On its own', 'Pass label. It gets role img and that name. The control around it also needs an accessible name.'],
            ['Colour', 'Never the only signal. The icon sits next to text, or has a label.'],
            ['Contrast', 'An icon that carries meaning meets three to one against its background, the same as large text.'],
            ['Tap target', 'The icon is not the target. The button around it is at least thirty-six pixels.'],
          ]}
        />
      </Section>

      <Section n="07" title="Tokens" intro="Sizes come from semantic size tokens, which come from primitives. The line weight is one component token.">
        <Table
          head={['Part', 'Tokens']}
          rows={[
            ['Size', toks('size-sm', 'size-md', 'size-lg')],
            ['Line', toks('stroke-width')],
          ]}
        />
      </Section>

      <Section n="08" title="Spec for code">
        <SourceLinks
          items={[
            { label: 'Icon source', path: 'src/components/Icon' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <pre className={s.pre}>{`import { Icon } from '@/components';

<Icon name="book-open" />                        // beside text: hidden from screen readers
<Icon name="link" size="lg" label="Copy link" /> // on its own: has a name`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">name</code>, 'IconName', 'Required. Autocompletes from the set.'],
            [<code key="b">size</code>, 'sm | md | lg', 'Default md (20).'],
            [<code key="c">label</code>, 'string', 'Only when the icon stands alone.'],
          ]}
        />
        <h3 className={base.h3}>Adding an icon</h3>
        <ol className={s.legend}>
          <li><span className={s.numDark}>1</span><span>Take the icon from Lucide, 24 grid, two unit line.</span></li>
          <li><span className={s.numDark}>2</span><span>Paste its path into <code>icons.ts</code> under its Lucide name. Nothing else changes.</span></li>
          <li><span className={s.numDark}>3</span><span>Add one line to the “Use for” list on this page.</span></li>
        </ol>
        <p className={base.intro}>Icons in other components (top bar, chips, menus) still use their own copies. They move onto this set one component at a time.</p>
      </Section>
    </div>
  );
}
