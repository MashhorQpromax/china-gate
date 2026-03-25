// Device fingerprint generation (client-side)
export function generateFingerprint(): string {
  const components: string[] = [];

  // Screen
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);
  components.push(`${window.devicePixelRatio || 1}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');

  // Language
  components.push(navigator.language || '');

  // Platform
  components.push(navigator.platform || '');

  // Touch support
  components.push(`${('ontouchstart' in window) || navigator.maxTouchPoints > 0}`);

  // Canvas fingerprint (lightweight)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('ChinaGate', 2, 2);
      components.push(canvas.toDataURL().slice(-50));
    }
  } catch {
    components.push('no-canvas');
  }

  // WebGL renderer
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
      }
    }
  } catch {
    components.push('no-webgl');
  }

  // Hash all components
  const raw = components.join('|||');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `fp_${Math.abs(hash).toString(36)}`;
}
