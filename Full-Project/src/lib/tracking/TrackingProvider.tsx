'use client';

import { useEffect } from 'react';
import { tracker } from './tracker';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      tracker.init();
    }

    return () => {
      tracker.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default TrackingProvider;
