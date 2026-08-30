import { useEffect } from 'react';

export function useBlockScroll(isOpen) {
  const open = isOpen;

  useEffect(() => {
    if (open) {
      document.querySelector('html').classList.add('overflow-hidden');
    } else {
      document.querySelector('html').classList.remove('overflow-hidden');
    }

    return () => {
      document.querySelector('html').classList.remove('overflow-hidden');
    };
  }, [open]);
}
