import type { ReactNode } from 'react';

/** Line icons for the top bar (Lucide shapes, 2px stroke, currentColor). The shared Icon component is a later step. */
const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const navIcons = {
  mail: (
    <Svg>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  ),
  message: (
    <Svg>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  ),
  bell: (
    <Svg>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Svg>
  ),
  pin: (
    <Svg>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  chevronDown: (
    <Svg>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  menu: (
    <Svg>
      <path d="M4 12h16M4 6h16M4 18h16" />
    </Svg>
  ),
  check: (
    <Svg>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  ),
  checkCircle: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  xCircle: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </Svg>
  ),
};
