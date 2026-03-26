'use client';

import { useEffect } from 'react';
import { tracker } from './tracker';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize if user is logged in
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      tracker.init();
    }

    return () => {
      tracker.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default TrackingProvider;
