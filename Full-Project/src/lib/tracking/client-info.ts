// Collect comprehensive client information
export interface ClientInfo {
  // Browser
  browserName: string;
  browserVersion: string;
  // OS
  osName: string;
  osVersion: string;
  // Device
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  deviceBrand: string;
  deviceModel: string;
  // Screen
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  touchSupport: boolean;
  // Locale
  language: string;
  timezone: string;
  // Connection
  connectionType: string;
  // User Agent
  userAgent: string;
  // Referrer
  referrerUrl: string;
  referrerDomain: string;
}

function parseBrowser(ua: string): { name: string; version: string } {
  const browsers = [
    { name: 'Edge', pattern: /Edg(?:e|A|iOS)?\/(\d+[\d.]*)/ },
    { name: 'Opera', pattern: /(?:OPR|Opera)\/(\d+[\d.]*)/ },
    { name: 'Samsung Internet', pattern: /SamsungBrowser\/(\d+[\d.]*)/ },
    { name: 'UC Browser', pattern: /UCBrowser\/(\d+[\d.]*)/ },
    { name: 'Firefox', pattern: /Firefox\/(\d+[\d.]*)/ },
    { name: 'Chrome', pattern: /Chrome\/(\d+[\d.]*)/ },
    { name: 'Safari', pattern: /Version\/(\d+[\d.]*).*Safari/ },
    { name: 'IE', pattern: /(?:MSIE |rv:)(\d+[\d.]*)/ },
  ];

  for (const browser of browsers) {
    const match = ua.match(browser.pattern);
    if (match) {
      return { name: browser.name, version: match[1] };
    }
  }
  return { name: 'Unknown', version: '' };
}

function parseOS(ua: string): { name: string; version: string } {
  const systems = [
    { name: 'Windows', pattern: /Windows NT (\d+[\d.]*)/ },
    { name: 'macOS', pattern: /Mac OS X (\d+[._\d]*)/ },
    { name: 'iOS', pattern: /(?:iPhone|iPad|iPod).*OS (\d+[._\d]*)/ },
    { name: 'Android', pattern: /Android (\d+[\d.]*)/ },
    { name: 'Linux', pattern: /Linux/ },
    { name: 'Chrome OS', pattern: /CrOS/ },
  ];

  for (const os of systems) {
    const match = ua.match(os.pattern);
    if (match) {
      const version = match[1] ? match[1].replace(/_/g, '.') : '';
      return { name: os.name, version };
    }
  }
  return { name: 'Unknown', version: '' };
}

function parseDevice(ua: string): { type: 'desktop' | 'mobile' | 'tablet' | 'unknown'; brand: string; model: string } {
  // Tablet detection
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    const brand = /iPad/i.test(ua) ? 'Apple' :
                  /Samsung/i.test(ua) ? 'Samsung' :
                  /Huawei/i.test(ua) ? 'Huawei' : 'Unknown';
    return { type: 'tablet', brand, model: '' };
  }

  // Mobile detection
  if (/Mobile|iPhone|Android.*Mobile|Windows Phone/i.test(ua)) {
    let brand = 'Unknown';
    let model = '';

    if (/iPhone/i.test(ua)) {
      brand = 'Apple';
      model = 'iPhone';
    } else if (/Samsung/i.test(ua)) {
      brand = 'Samsung';
      const m = ua.match(/SM-\w+/);
      model = m ? m[0] : '';
    } else if (/Huawei/i.test(ua)) {
      brand = 'Huawei';
    } else if (/Xiaomi|Redmi/i.test(ua)) {
      brand = 'Xiaomi';
    } else if (/OPPO/i.test(ua)) {
      brand = 'OPPO';
    } else if (/vivo/i.test(ua)) {
      brand = 'Vivo';
    }

    return { type: 'mobile', brand, model };
  }

  return { type: 'desktop', brand: '', model: '' };
}

function getConnectionType(): string {
  const nav = navigator as any;
  if (nav.connection) {
    return nav.connection.effectiveType || nav.connection.type || 'unknown';
  }
  return 'unknown';
}

function getReferrerDomain(referrer: string): string {
  try {
    if (!referrer) return 'direct';
    return new URL(referrer).hostname;
  } catch {
    return 'unknown';
  }
}

export function collectClientInfo(): ClientInfo {
  const ua = navigator.userAgent;
  const browser = parseBrowser(ua);
  const os = parseOS(ua);
  const device = parseDevice(ua);

  return {
    browserName: browser.name,
    browserVersion: browser.version,
    osName: os.name,
    osVersion: os.version,
    deviceType: device.type,
    deviceBrand: device.brand,
    deviceModel: device.model,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: ('ontouchstart' in window) || navigator.maxTouchPoints > 0,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    connectionType: getConnectionType(),
    userAgent: ua,
    referrerUrl: document.referrer || '',
    referrerDomain: getReferrerDomain(document.referrer),
  };
}
