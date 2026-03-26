/**
 * Auth Sync Utility
 *
 * Ensures user_profile is in localStorage for UI display.
 * This handles the case where OAuth login sets cookies but not localStorage.
 * Call this on app load or when pages detect missing profile data.
 */

export async function syncUserProfile(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Check if profile already exists in localStorage
  const existing = localStorage.getItem('user_profile');
  if (existing) return true;

  // Check if we have profile data from OAuth callback cookie
  const cookieProfile = getCookie('user_profile_data');
  if (cookieProfile) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieProfile));
      localStorage.setItem('user_profile', JSON.stringify(parsed));
      return true;
    } catch {
      // Cookie data is malformed, fetch from API instead
    }
  }

  // No localStorage and no cookie - try fetching from API (cookie auth will handle it)
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      if (data.user?.profile) {
        localStorage.setItem('user_profile', JSON.stringify(data.user.profile));
        return true;
      }
    }
  } catch {
    // API fetch failed - user is likely not authenticated
  }

  return false;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Clear all auth data from localStorage (for logout)
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_profile');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
