import { Button } from '../../Button';
import { icons } from '../../Button/docs/icons';

/** The repository every component page points at. */
export const REPO_URL = 'https://github.com/harishp1008/skillwiz-design-system';

export interface SourceLink {
  /** Link text, sentence case, says where it goes: “Badge source”. */
  label: string;
  /** Path inside the repo, from the root: `src/components/Badge`. */
  path: string;
}

/** “Source” links on a component page. Uses the Link button (style guide §15.1): navigation is an anchor, trailing arrow, opens in a new tab. */
export function SourceLinks({ items }: { items: SourceLink[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--sw-space-8) var(--sw-space-24)' }}>
      {items.map((it) => (
        <Button
          key={it.path}
          variant="link"
          href={`${REPO_URL}/tree/main/${it.path}`}
          target="_blank"
          rel="noreferrer"
          label={it.label}
          icon={icons.externalLink}
          iconPosition="trailing"
        />
      ))}
    </div>
  );
}
