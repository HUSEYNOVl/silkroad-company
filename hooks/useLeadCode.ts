'use client';

import {useCallback, useEffect, useState} from 'react';

const storageKey = 'silk-road-lead-code';

export function useLeadCode() {
  const [leadCode, setLeadCodeState] = useState<string | null>(null);

  useEffect(() => {
    setLeadCodeState(window.localStorage.getItem(storageKey));
  }, []);

  const setLeadCode = useCallback((code: string | null) => {
    setLeadCodeState(code);
    if (code) {
      window.localStorage.setItem(storageKey, code);
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  return {leadCode, setLeadCode};
}
