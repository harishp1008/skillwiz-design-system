import type { ReactNode } from 'react';

/** Line icons for selects and menus (Lucide shapes, 2px stroke, currentColor). Decorative: the label always carries the meaning. */
const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const dropdownIcons = {
  chevronDown: <Svg><path d="m6 9 6 6 6-6" /></Svg>,
  chevronUp: <Svg><path d="m18 15-6-6-6 6" /></Svg>,
  arrowRight: <Svg><path d="m9 18 6-6-6-6" /></Svg>,
  check: <Svg><path d="M20 6 9 17l-5-5" /></Svg>,
  close: <Svg><path d="M18 6 6 18M6 6l12 12" /></Svg>,
  search: <Svg><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Svg>,
  pin: <Svg><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></Svg>,
  plus: <Svg><path d="M5 12h14M12 5v14" /></Svg>,
  more: <Svg><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Svg>,
  alert: <Svg><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Svg>,
  message: <Svg><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Svg>,
  download: <Svg><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></Svg>,
  copy: <Svg><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Svg>,
  flag: <Svg><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" /></Svg>,
  trash: <Svg><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></Svg>,
  eye: <Svg><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></Svg>,
};
