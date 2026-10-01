'use client';

import { useEffect } from 'react';

export function FlowbiteInit() {
  useEffect(() => {
    // Dynamic import to prevent SSR issues and initialize Flowbite data-attributes
    import('flowbite')
      .then(({ initFlowbite }) => {
        initFlowbite();
      })
      .catch((err) => {
        console.debug('[FlowbiteInit] Flowbite JS init:', err);
      });
  }, []);

  return null;
}
