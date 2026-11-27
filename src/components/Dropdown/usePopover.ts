import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DROPDOWN_FLIP_THRESHOLD } from './constants';

/** Open state, outside-click close and the flip-above rule shared by Select and Menu. */
export function usePopover(forceOpen?: boolean) {
  const [open, setOpenState] = useState(false);
  const [placement, setPlacement] = useState<'below' | 'above'>('below');
  const wrap = useRef<HTMLDivElement>(null);
  const isOpen = forceOpen ?? open;

  const setOpen = useCallback((next: boolean) => setOpenState(next), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpenState(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /* Opens below; flips above when fewer than 200px are left below. */
  useLayoutEffect(() => {
    if (!isOpen || forceOpen !== undefined || !wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPlacement(spaceBelow < DROPDOWN_FLIP_THRESHOLD && rect.top > spaceBelow ? 'above' : 'below');
  }, [isOpen, forceOpen]);

  return { wrap, open: isOpen, setOpen, placement };
}
