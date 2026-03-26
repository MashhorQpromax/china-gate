'use client';

import { useEffect, useState } from 'react';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('جاري تسجيل الدخول...');

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get tokens from URL hash fragment
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const providerToken = params.get('provider_token');
        const providerRefreshToken = params.get('provider_refresh_token');

        if (!accessToken) {
          // Maybe there is a code in query params instead
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get('code');
          if (code) {
            // Redirect to API callback for code exchange
            window.location.href = `/api/auth/callback?code=${code}`;
            return;
          }
          setStatus('فشل تسجيل الدخول - لم يتم العثور على بيانات المصادقة');
          setTimeout(() => {
            window.location.href = '/login?error=no_token';
          }, 2000);
          return;
        }

        // Send tokens to server to set httpOnly cookies
        const response = await fetch('/api/auth/callback/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            provider_token: providerToken,
            provider_refresh_token: providerRefreshToken,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('تم تسجيل الدخول بنجاح! جاري التحويل...');
          window.location.href = data.data.redirectTo || '/dashboard/buyer';
        } else {
          setStatus('فشل تسجيل الدخول');
          setTimeout(() => {
            window.location.href = '/login?error=session_failed';
          }, 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('حدث خطأ أثناء تسجيل الدخول');
        setTimeout(() => {
          window.location.href = '/login?error=callback_error';
        }, 2000);
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">{status}</p>
      </div>
    </div>
  );
}
