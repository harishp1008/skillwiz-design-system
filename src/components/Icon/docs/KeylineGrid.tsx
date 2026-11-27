import { pathsOf, type IconName } from '../icons';

/** The 24 grid with live area, padding and keyline shapes. Drawn at 15 pixels a unit so the lines read clearly. Colours come from semantic tokens. */
export function KeylineGrid({ icon, shapes = true, label }: { icon?: IconName; shapes?: boolean; label: string }) {
  const line = 'var(--sw-color-border-default)';
  const key = 'var(--sw-color-action-default)';
  const pad = 'var(--sw-color-feedback-warning-solid)';
  const units = Array.from({ length: 25 }, (_, i) => i);
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={label} style={{ width: 'calc(var(--sw-space-64) * 5)', maxWidth: '100%', height: 'auto', background: 'var(--sw-color-surface-default)', border: '1px solid var(--sw-color-border-default)' }}>
      {units.map((i) => (
        <g key={i} stroke={line} strokeWidth="0.05">
          <path d={`M${i} 0V24`} />
          <path d={`M0 ${i}H24`} />
        </g>
      ))}
      {/* padding: two units on every side */}
      <path d="M0 0H24V24H0Z M2 2V22H22V2Z" fill={pad} fillOpacity="0.14" fillRule="evenodd" />
      <rect x="2" y="2" width="20" height="20" fill="none" stroke={pad} strokeWidth="0.12" strokeDasharray="0.5 0.4" />
      {shapes ? (
        <g fill="none" stroke={key} strokeWidth="0.14">
          <circle cx="12" cy="12" r="10" />
          <rect x="3" y="3" width="18" height="18" rx="0.5" />
          <rect x="4" y="2" width="16" height="20" rx="0.5" />
          <rect x="2" y="4" width="20" height="16" rx="0.5" />
        </g>
      ) : null}
      {icon ? (
        <g fill="none" stroke="var(--sw-color-text-heading)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          {pathsOf(icon).map((d) => <path key={d} d={d} />)}
        </g>
      ) : null}
    </svg>
  );
}
