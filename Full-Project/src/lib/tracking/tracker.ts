'use client';

import { collectClientInfo, ClientInfo } from './client-info';
import { generateFingerprint } from './fingerprint';

// Singleton tracker
class ChinaGateTracker {
  private sessionId: string | null = null;
  private clientInfo: ClientInfo | null = null;
  private fingerprint: string | null = null;
  private lastPagePath: string = '';
  private pageEnteredAt: number = 0;
  private maxScrollDepth: number = 0;
  private isInitialized: boolean = false;
  private eventQueue: any[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  // Initialize tracker after login
  async init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.clientInfo = collectClientInfo();
    this.fingerprint = generateFingerprint();
    this.isInitialized = true;

    // Start session
    await this.startSession();

    // Track initial page view
    this.trackPageView();

    // Listen for route changes
    this.setupRouteListener();

    // Listen for scroll depth
    this.setupScrollListener();

    // Listen for visibility changes (tab switch / close)
    this.setupVisibilityListener();

    // Flush events periodically
    this.flushTimer = setInterval(() => this.flushEvents(), 10000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.onPageLeave();
      this.flushEvents(true);
      this.endSession();
    });
  }

  private async startSession() {
    const token = localStorage.getItem('access_token');
    if (!token || !this.clientInfo) return;

    try {
      const res = await fetch('/api/tracking/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'start',
          clientInfo: this.clientInfo,
          fingerprint: this.fingerprint,
          landingPage: window.location.pathname,
          referrerUrl: document.referrer || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        this.sessionId = data.sessionId;
        localStorage.setItem('tracking_session_id', data.sessionId);
      }
    } catch (err) {
      console.error('Failed to start tracking session:', err);
    }
  }

  private async endSession() {
    const token = localStorage.getItem('access_token');
    const sessionId = this.sessionId || localStorage.getItem('tracking_session_id');
    if (!token || !sessionId) return;

    // Use sendBeacon for reliability on page unload
    const payload = JSON.stringify({
      action: 'end',
      sessionId,
      exitPage: window.location.pathname,
    });

    navigator.sendBeacon('/api/tracking/session', payload);
  }

  // Track page views
  trackPageView(customPath?: string) {
    const path = customPath || window.location.pathname;
    if (path === this.lastPagePath) return;

    // Record time on previous page
    this.onPageLeave();

    this.lastPagePath = path;
    this.pageEnteredAt = Date.now();
    this.maxScrollDepth = 0;

    this.queueEvent({
      eventType: 'page_view',
      eventName: `Viewed ${path}`,
      eventCategory: this.categorizePagePath(path),
      pageUrl: window.location.href,
      pagePath: path,
      pageTitle: document.title,
      eventData: {
        referrerUrl: document.referrer,
        referrerDomain: this.getDomain(document.referrer),
      },
    });
  }

  // Track clicks on important elements
  trackClick(elementId: string, elementText: string, extraData?: Record<string, any>) {
    this.queueEvent({
      eventType: 'click',
      eventName: `Clicked ${elementText || elementId}`,
      eventCategory: 'interaction',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      elementId,
      elementText: elementText?.substring(0, 100),
      eventData: extraData || {},
    });
  }

  // Track search queries
  trackSearch(query: string, resultsCount?: number) {
    this.queueEvent({
      eventType: 'search',
      eventName: `Searched: ${query}`,
      eventCategory: 'search',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: { query, resultsCount },
    });
  }

  // Track product views
  trackProductView(productId: string, productName: string, category?: string) {
    this.queueEvent({
      eventType: 'product_view',
      eventName: `Viewed product: ${productName}`,
      eventCategory: category || 'product',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: { productId, productName, category },
    });
  }

  // Track deal interactions
  trackDealAction(action: 'create' | 'update' | 'view', dealId: string, extraData?: Record<string, any>) {
    this.queueEvent({
      eventType: `deal_${action}` as any,
      eventName: `Deal ${action}: ${dealId}`,
      eventCategory: 'deal',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: { dealId, ...extraData },
    });
  }

  // Track form submissions
  trackFormSubmit(formName: string, success: boolean, extraData?: Record<string, any>) {
    this.queueEvent({
      eventType: 'form_submit',
      eventName: `Form: ${formName} - ${success ? 'success' : 'failed'}`,
      eventCategory: 'form',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: { formName, success, ...extraData },
    });
  }

  // Track errors
  trackError(errorMessage: string, errorStack?: string) {
    this.queueEvent({
      eventType: 'error_encountered',
      eventName: `Error: ${errorMessage.substring(0, 100)}`,
      eventCategory: 'error',
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: { errorMessage, errorStack: errorStack?.substring(0, 500) },
    });
  }

  // Track custom events
  trackCustomEvent(name: string, category: string, data?: Record<string, any>) {
    this.queueEvent({
      eventType: 'custom',
      eventName: name,
      eventCategory: category,
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      eventData: data || {},
    });
  }

  // --- Internal helpers ---

  private onPageLeave() {
    if (!this.pageEnteredAt || !this.lastPagePath) return;

    const timeOnPage = Math.round((Date.now() - this.pageEnteredAt) / 1000);
    if (timeOnPage < 1) return;

    // Send page time data
    this.queueEvent({
      eventType: 'page_view',
      eventName: `Time on page: ${this.lastPagePath}`,
      eventCategory: 'engagement',
      pageUrl: window.location.href,
      pagePath: this.lastPagePath,
      eventData: {
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        isUpdate: true,
      },
    });
  }

  private queueEvent(event: any) {
    this.eventQueue.push({
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId || localStorage.getItem('tracking_session_id'),
    });

    // Flush if queue gets large
    if (this.eventQueue.length >= 10) {
      this.flushEvents();
    }
  }

  private async flushEvents(useBeacon: boolean = false) {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const payload = JSON.stringify({ events });

    if (useBeacon) {
      navigator.sendBeacon('/api/tracking/events', payload);
      return;
    }

    try {
      await fetch('/api/tracking/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: payload,
      });
    } catch (err) {
      // Re-queue on failure
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  private setupRouteListener() {
    // Listen for Next.js route changes via popstate
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 100);
    });

    // Intercept pushState for SPA navigation
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(() => tracker.trackPageView(), 100);
    };
  }

  private setupScrollListener() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const depth = Math.round((scrollTop / docHeight) * 100);
            if (depth > this.maxScrollDepth) {
              this.maxScrollDepth = depth;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.onPageLeave();
        this.flushEvents(true);
      }
    });
  }

  private categorizePagePath(path: string): string {
    if (path === '/') return 'home';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/marketplace')) return 'marketplace';
    if (path.startsWith('/deals')) return 'deals';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/lc') || path.startsWith('/lg')) return 'banking';
    if (path.startsWith('/shipping')) return 'shipping';
    if (path.startsWith('/customs')) return 'customs';
    if (path.startsWith('/partnerships')) return 'partnerships';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/login') || path.startsWith('/register')) return 'auth';
    return 'other';
  }

  private getDomain(url: string): string {
    try {
      if (!url) return 'direct';
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents(true);
    this.isInitialized = false;
  }
}

// Export singleton instance
export const tracker = new ChinaGateTracker();
export default tracker;
