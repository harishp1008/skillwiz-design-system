import { type ReactNode } from 'react';
import { tokenMeta, tokenValues, type TokenPath } from '../../../tokens/tokens.generated';
import { Avatar, type AvatarSize } from '../Avatar';
import { AvatarGroup } from '../AvatarGroup';
import { initialsOf } from '../initials';
import { tones, toneFor, type AvatarTone } from '../tones';
import { labelIcons } from '../../shared/labelIcons';
import { SourceLinks } from '../../shared/docs/SourceLinks';
import base from '../../Button/docs/ButtonGuidelines.module.css';
import s from './AvatarGuidelines.module.css';

/* Page chrome (section, table, cards, do/don't) is shared with the Button page via its CSS module; extra layout is in AvatarGuidelines.module.css. */

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
const av = (...p: string[]) => toks(...p.map((x) => `avatar.${x}`));

function Section({ n, title, intro, children }: { n: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={base.section} aria-labelledby={`av-${n}`}>
      <h2 id={`av-${n}`} className={base.h2}>
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

/** A made-up sample photo (no real person), so the page shows the photo state without using anyone's picture. */
const samplePhoto =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9b99b"/><stop offset="1" stop-color="#9c7a5b"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="40" r="17" fill="#f1d9c3"/><path d="M14 100c0-22 16-34 36-34s36 12 36 34z" fill="#f7f4ee"/></svg>`,
  );
/** Not an image: the browser reports an error at once, with no network request. */
const brokenPhoto = 'data:image/png;base64,AAAA';

const toneNames: Record<AvatarTone, string> = { blue: 'Blue', violet: 'Violet', green: 'Green', orange: 'Orange', yellow: 'Yellow', pink: 'Pink', teal: 'Teal', indigo: 'Indigo' };
const val = (p: string) => String(tokenValues[p as TokenPath]);
const sizes: { k: AvatarSize; label: string; px: number; init: number; dot: number }[] = [
  { k: 'xs', label: 'XS', px: 24, init: 11, dot: 8 },
  { k: 'sm', label: 'S', px: 32, init: 12, dot: 10 },
  { k: 'md', label: 'M', px: 40, init: 14, dot: 12 },
  { k: 'lg', label: 'L', px: 56, init: 18, dot: 14 },
  { k: 'xl', label: 'XL', px: 80, init: 28, dot: 18 },
  { k: '2xl', label: '2XL', px: 120, init: 48, dot: 24 },
];
const nameRows: [string, string][] = [
  ['Aarav Nair', 'First letter of first name + last name'],
  ['Riya', 'One name, one letter. Never “RI”.'],
  ['Inderjeet Singh Bedi', 'First and last name; middle names skipped'],
  ['dr. meera shah', 'Titles dropped; always uppercase'],
  ['ரவி குமார் (Ravi Kumar)', 'Non-Latin script: the first character of each name, as written'],
  ['', 'User icon, not “A” from the email'],
];

const people = [
  { name: 'Aarav Nair', userId: 'AARAV2026' },
  { name: 'Riya Kapoor', userId: 'RIYA2026' },
  { name: 'Meera Shah', userId: 'MEERA2026' },
  { name: 'Rohit Das', userId: 'ROHIT2026' },
  { name: 'Inderjeet Singh', userId: 'IS2026' },
  { name: 'Nisha Kumar', userId: 'NK2026' },
];

export function AvatarGuidelines() {
  return (
    <div className={base.page}>
      <header>
        <p className={base.eyebrow}>Components</p>
        <h1 className={base.title}>Avatar</h1>
        <p className={base.lead}>
          A circle that stands for a person: their photo when they have uploaded one, otherwise their initials on one of eight paper-cut backgrounds. The same person gets the same colour on every screen.
        </p>
      </header>

      <Section n="01" title="Anatomy" intro="Initials on art (left) and a photo (right), at 120px.">
        <div className={base.card}>
          <div className={s.ana}>
            <div className={s.stage} style={{ background: 'transparent', gap: 'var(--sw-space-48)' }}>
              <Avatar name="Aarav Nair" tone="blue" size="2xl" status="active" statusLabel="Active" />
              <Avatar name="Sample photo" src={samplePhoto} size="2xl" status="active" />
            </div>
            <ol className={s.legend}>
              {[
                ['Circle', 'Every avatar is a circle. Square avatars are not used in SkillWiz.'],
                ['Background art', 'One of eight paper-cut backgrounds. Picked from the user ID, so a student keeps their colour on the wall, in reports and in messages.'],
                ['Initials', 'First letter of the first and last name. Centred over the plain middle of the art, which the art keeps free on purpose.'],
                ['Status dot', 'Optional. Presence on proctor screens only.'],
                ['Photo', 'Replaces the art and initials once it loads. Cropped to fill the circle, face centred.'],
                ['Inner outline', 'Keeps light photos from melting into a white page. Not used on initials.'],
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
            ['Sizes', '24 · 32 · 40 · 56 · 80 · 120 (M 40 is the default)'],
            ['Shape', 'Circle'],
            ['Content order', 'Photo → initials → user icon'],
            ['Initials', 'Up to 2 letters, bold, uppercase · 38–40% of the size'],
            ['Initials colour', 'The tone’s text colour (5.7 to 1 or more on its fill)'],
            ['Background, 40 and up', 'Paper art for the tone'],
            ['Background, 32 and below', 'Flat tone fill. The art turns to noise.'],
            ['Tone pick', 'Sum of the character codes of the user ID, mod 8. Same person, same colour everywhere.'],
            ['Photo', 'Cover crop · 1px inner outline, black at 10%'],
            ['Status dot', 'Bottom right · 30% of the size · 2px surface ring'],
            ['Group overlap', '−8px · 2px surface ring · at most 4, then “+N”'],
            ['Focus (when a button)', '2px focus outline, offset 2px'],
          ]}
        />
      </Section>

      <Section n="02" title="Background set" intro="Eight tones. Art at 40px and up, the art’s centre colour as a flat fill below that.">
        <div className={s.tones}>
          {tones.map((t) => (
            <div key={t} className={s.tone}>
              <div className={s.toneStage}>
                <Avatar name="Aarav Nair" tone={t} size="lg" />
                <Avatar name="Aarav Nair" tone={t} size="sm" />
                <Avatar name="Aarav Nair" tone={t} size="xs" />
              </div>
              <div className={s.toneBody}>
                <b>{toneNames[t]}</b>
                <span><span className={s.swatch} style={{ background: val(`color.avatar.${t}.bg`) }} />bg {val(`color.avatar.${t}.bg`)} · text {val(`color.avatar.${t}.text`)}</span>
                <code>--sw-color-avatar-{t}-bg</code>
                <code>--sw-color-avatar-{t}-text</code>
              </div>
            </div>
          ))}
        </div>
        <div className={s.notes}>
          <p className={s.note}><b className={base.strong}>How a tone is picked.</b> Sum the character codes of the user ID, take mod 8, index into blue, violet, green, orange, yellow, pink, teal, indigo. Never pick by name (two Aaravs would match) or at random (the colour would change on reload).</p>
          <p className={s.note}><b className={base.strong}>Why flat below 40px.</b> At 24 and 32px the art’s corner shapes become a smudge behind the letters. The flat fill is the art’s own centre colour, so the person keeps the same colour at every size.</p>
        </div>
      </Section>

      <Section n="03" title="Types" intro="Photo first, initials when there is no photo, an icon only when there is no name.">
        <div className={s.cards4}>
          <Card title="Photo" white text="When the user has uploaded one. Shown on the profile, top nav and messages. Never on the live wall, where the camera feed is the photo.">
            <Avatar name="Rohit Kumar" src={samplePhoto} size="xl" />
          </Card>
          <Card title="Initials" white text="The default. Also shown while a photo loads and if it fails, so the circle is never empty or broken.">
            <Avatar name="Rohit Kumar" userId="RK2026" size="xl" />
            <Avatar name="Rohit Kumar" userId="RK2026" src={brokenPhoto} size="md" />
          </Card>
          <Card title="No name" white text="A user icon on the muted surface, for invited users who haven’t set a name, and deleted accounts.">
            <Avatar size="xl" />
            <Avatar size="md" />
          </Card>
          <Card title="Muted" white text="Offline or not joined on proctor screens: grey fill, grey initials, photo in greyscale. The art is dropped so active students stand out.">
            <Avatar name="Rohit Das" userId="ROHIT2026" muted size="xl" />
            <Avatar name="Rohit Das" src={samplePhoto} muted size="xl" />
          </Card>
        </div>
      </Section>

      <Section n="04" title="Sizes" intro="Six sizes. Initials scale with the circle; the art switches to a flat fill at 32px and below.">
        <div className={s.sizes}>
          {sizes.map((z) => (
            <div key={z.k} className={s.sizeCol}>
              <div className={s.stack}>
                <Avatar name="Aarav Nair" tone="blue" size={z.k} status="active" />
              </div>
              <b>{z.label} · {z.px}px</b>
              <span>Initials {z.init}px · dot {z.dot}px</span>
              <span>{z.px <= 32 ? 'Flat fill' : 'Art'}</span>
              <span>Group ring 2px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="05" title="Initials" intro="How two letters are taken from a name.">
        <Table
          head={['Name', 'Shown', 'Rule']}
          rows={nameRows.map(([n, r]) => [
            n || 'No name set · aarav@lpu.in',
            <Avatar key={n} name={n || undefined} tone="violet" size="sm" decorative />,
            <span key={`${n}r`}>{r}{n ? <> <code>{initialsOf(n)}</code></> : null}</span>,
          ])}
        />
      </Section>

      <Section n="06" title="Status & groups" intro="Presence on proctor screens, and stacks of several people.">
        <div className={s.cards3}>
          <Card title="Status dot" white text="Proctor screens only. This page sets the size (30%) and ring. Offline is hollow, so colour is never the only signal.">
            {([['active', 'Active'], ['idle', 'Idle 2 min'], ['reconnecting', 'Reconnecting'], ['offline', 'Offline']] as const).map(([st, l]) => (
              <span key={st} className={s.cap}>
                <Avatar name="Rohit Das" userId="ROHIT2026" size="md" status={st} statusLabel={l} muted={st === 'offline'} />
                {l}
              </span>
            ))}
          </Card>
          <Card title="Group · 32px" white text="Up to 4, overlapping by 8px with a 2px white ring, then a grey “+N”. Message recipients, who has seen an alert.">
            <AvatarGroup size="sm" people={[...people, { name: 'Extra One' }, { name: 'Extra Two' }, { name: 'Extra Three' }]} max={4} />
          </Card>
          <Card title="Group · 40px" white text="Left-most on top. The group has one name: “Inderjeet Singh, Nisha Kumar and 1 more”.">
            <AvatarGroup size="md" max={2} people={[{ name: 'Inderjeet Singh', src: samplePhoto }, { name: 'Nisha Kumar', userId: 'NK2026' }, { name: 'Kabir Rao', userId: 'KR2026' }]} />
          </Card>
        </div>
      </Section>

      <Section n="07" title="In context" intro="Where avatars sit on SkillWiz screens, and what changes on the screens that differ today.">
        <div className={s.cards3}>
          <Card title="Student table · 32px" white text="Flat tone fill at 32px; status dot for presence; offline muted.">
            <div className={s.panel} style={{ width: '100%' }}>
              {[
                ['Rohit Das', 'ROHIT2026', 'Active now', 'active', false],
                ['Inderjeet Singh', 'IS2026', 'Idle 2 min', 'idle', false],
                ['Nisha Kumar', 'NK2026', 'Offline 1 min', 'offline', true],
              ].map(([n, id, st, status, muted]) => (
                <div key={n as string} className={s.row}>
                  <Avatar name={n as string} userId={id as string} size="sm" status={status as 'active'} muted={muted as boolean} decorative />
                  <span className={s.rowText}>{n as string}<small>{id as string} · {st as string}</small></span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Student detail header · 56px" white text="Art background, initials, status dot.">
            <div className={s.panel} style={{ width: '100%' }}>
              <div className={s.row}>
                <Avatar name="Aarav Nair" userId="AARAV2026" size="lg" status="active" decorative />
                <span className={s.rowText}><b>Aarav Nair</b><small>AARAV2026 · LPU_Class · Active now</small></span>
              </div>
            </div>
          </Card>
          <Card title="Message thread · 32px" white text="Sender avatar beside the first message of a run only.">
            <div className={s.panel} style={{ width: '100%' }}>
              <div className={s.row}>
                <Avatar name="Proctor" userId="PROCTOR" size="sm" decorative />
                <span className={s.rowText}><b>Proctor <small>10:42</small></b><small>Please face the camera for the rest of the test.</small></span>
              </div>
            </div>
          </Card>
        </div>
        <Card title="Same class, six students" white text="Tones spread across a list, so neighbours rarely share a colour and names are easier to tell apart at a glance.">
          {people.map((p) => <Avatar key={p.userId} {...p} size="xl" />)}
        </Card>
        <h3 className={base.h3}>Screens to align</h3>
        <Table
          head={['Screen', 'Today', 'Change']}
          rows={[
            ['Top nav (all screens)', '36px, blue, the same for everyone', '40px avatar to match the 40px icon buttons; tone from the user ID; photo when uploaded'],
            ['Presence board, student tables', '34px; every student the same blue', 'S 32px with flat tone fill; keep the presence dots as defined'],
            ['Live wall V2 cards', '36px initials, same blue', 'M 40px with art; muted when offline'],
            ['Admin dashboard to-do list', '40px grey initials', 'M 40px with the person’s tone; grey is reserved for offline and no-name'],
            ['Message flows', '40px initials, blue', 'S 32px beside messages; photo when uploaded'],
          ]}
        />
      </Section>

      <Section n="08" title="Usage guidelines" intro="Four rules for the backgrounds and initials.">
        <div className={s.usage}>
          <DoDont ok text="Use the flat fill at 32px and below.">
            <Avatar name="Aarav Nair" tone="blue" size="sm" />
            <Avatar name="Riya Kapoor" tone="violet" size="xs" />
          </DoDont>
          <DoDont ok={false} text="Put the art behind small avatars. The corner shapes blur into the letters.">
            <span style={{ display: 'inline-flex', width: 'var(--sw-size-avatar-sm)', height: 'var(--sw-size-avatar-sm)', borderRadius: '50%', overflow: 'hidden', transform: 'scale(1)' }}>
              <Avatar name="Aarav Nair" tone="blue" size="md" style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }} />
            </span>
          </DoDont>
          <DoDont ok text="Two letters, from first and last name.">
            <Avatar name="Inderjeet Singh Bedi" tone="green" size="md" />
          </DoDont>
          <DoDont ok={false} text="Three letters or a shrunken font. Initials stay at 2 and keep their size.">
            <span className={s.bad}>ISB</span>
          </DoDont>
          <DoDont ok text="Fall back to initials when there is no photo or it fails to load.">
            <Avatar name="Meera Shah" userId="MEERA2026" src={brokenPhoto} size="md" />
          </DoDont>
          <DoDont ok={false} text="Show a broken image or the generic user icon for a person whose name you know.">
            <Avatar size="md" />
          </DoDont>
          <DoDont ok text="Keep the tone tied to the person; show state with the dot.">
            <Avatar name="Rohit Das" userId="ROHIT2026" size="md" status="active" />
            <Avatar name="Rohit Das" userId="ROHIT2026" size="md" status="idle" />
          </DoDont>
          <DoDont ok={false} text="Change the avatar colour to mean status (green = active). Tone is identity, not state.">
            <Avatar name="Rohit Das" tone="green" size="md" />
            <Avatar name="Rohit Das" tone="orange" size="md" />
          </DoDont>
        </div>
      </Section>

      <Section n="09" title="Behaviour & accessibility" intro="An image with a name, or decoration when the name is already written next to it.">
        <Table
          head={['Topic', 'Rule']}
          rows={[
            ['Alone', <>The avatar is an image (<code>role="img"</code>) named with the person’s full name, plus their status if shown: “Rohit Das, Idle 2 min”.</>],
            ['Next to the name', <>When the name is written beside it (tables, cards), pass <code>decorative</code>: the avatar is hidden from screen readers.</>],
            ['As a button', <>Top nav and comment authors: pass <code>onClick</code> and <code>buttonLabel</code> (“Account menu”). It gets the focus ring.</>],
            ['Status dot', 'Never colour alone: offline is hollow, and the status is in the name: “Rohit Das, idle 2 min”.'],
            ['Group', 'One name for the whole group: “Aarav Nair, Riya Kapoor and 5 more”.'],
            ['Contrast', 'Initials on every tone are 5.7 to 1 or more on the flat fill and the art’s centre.'],
            ['Photos', 'Shown with object-fit cover. Loading shows initials, then fades the photo in over the short duration (opacity only, and not at all under reduced motion).'],
            ['Privacy', 'Students’ uploaded photos never appear to other students. Proctors see them only on the student detail page.'],
          ]}
        />
      </Section>

      <Section n="10" title="Tokens" intro="Eight new tone pairs, a faint photo outline and six avatar sizes. Everything else reuses existing tokens. Each row shows the component token and what it maps to.">
        <Table
          head={['Part', 'Tokens']}
          rows={[
            ['Tones (semantic)', toks(...tones.flatMap((t) => [`color.avatar.${t}.bg`, `color.avatar.${t}.text`]))],
            ['Sizes', av('size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl', 'size-2xl')],
            ['Initials', av('font-size-xs', 'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl', 'font-size-2xl', 'font-weight', 'line-height', 'radius')],
            ['Muted and no name', av('bg-muted', 'text-muted')],
            ['Photo and rings', av('outline-photo', 'outline-width', 'ring-color', 'ring-width', 'fade-duration', 'fade-easing')],
            ['Status dot', av('dot-xs', 'dot-sm', 'dot-md', 'dot-lg', 'dot-xl', 'dot-2xl', 'dot-active', 'dot-idle', 'dot-reconnecting', 'dot-offline', 'dot-offline-fill')],
            ['Group', av('group-overlap', 'group-more-bg', 'group-more-text')],
            ['Focus', av('focus-color', 'focus-width', 'focus-offset')],
          ]}
        />
      </Section>

      <Section n="11" title="Spec for code">
        <SourceLinks
          items={[
            { label: 'Avatar source', path: 'src/components/Avatar' },
            { label: 'Component tokens', path: 'tokens/component.json' },
          ]}
        />
        <pre className={s.pre}>{`import { Avatar, AvatarGroup } from '@/components';

<Avatar name="Aarav Nair" userId="AARAV2026" />                       // initials on the person's tone
<Avatar name="Rohit Das" userId="ROHIT2026" size="sm" status="idle"
        statusLabel="Idle 2 min" decorative />                       // name written beside it
<Avatar name="Aarav Nair" src={url} onClick={open} buttonLabel="Account menu" />
<AvatarGroup people={recipients} size="sm" />                        // 4, then +N`}</pre>
        <Table
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [<code key="a">name</code>, 'string', 'Full name. Drives the initials and the accessible name. Empty shows the user icon.'],
            [<code key="b">userId</code>, 'string', 'Picks the tone. Always pass it, so a person keeps their colour.'],
            [<code key="c">src</code>, 'string', 'Photo. Initials show while it loads or if it fails.'],
            [<code key="d">size</code>, 'xs | sm | md | lg | xl | 2xl', '24 · 32 · 40 · 56 · 80 · 120. Default md.'],
            [<code key="e">status</code>, 'active | idle | reconnecting | offline', 'Proctor screens only. Pair with statusLabel.'],
            [<code key="f">muted</code>, 'boolean', 'Offline or not joined.'],
            [<code key="g">decorative</code>, 'boolean', 'Name is written beside the avatar.'],
            [<code key="h">onClick, buttonLabel</code>, 'function, string', 'Makes it a button, e.g. the account menu.'],
          ]}
        />
        <div className={`${base.cards} ${base.cols2}`}>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must</h3>
              <ul className={base.rules}>
                <li>Pass <code>userId</code> so the tone is stable.</li>
                <li>Use the flat fill at 32px and below (the component does this).</li>
                <li>Show initials when the photo is missing or fails.</li>
                <li>Pair a status dot with a status label.</li>
              </ul>
            </div>
          </div>
          <div className={base.card}>
            <div className={base.cardBody}>
              <h3 className={base.cardTitle}>Must not</h3>
              <ul className={base.rules}>
                <li>Pick a tone by name, at random or by status.</li>
                <li>Use a square avatar.</li>
                <li>Show three letters or shrink the font to fit.</li>
                <li>Show a student’s photo to other students.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className={base.intro}>Tone pick: <code>toneFor(&quot;AARAV2026&quot;)</code> returns <code>{toneFor('AARAV2026')}</code>.</p>
      </Section>
    </div>
  );
}
