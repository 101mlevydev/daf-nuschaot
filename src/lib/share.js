// Lightweight WhatsApp share helpers used to drive virality.
export const SHARE_URL_OVERRIDE = ''

export function shareUrl(extra = '') {
  const base = SHARE_URL_OVERRIDE || (location.origin + location.pathname)
  return base + extra
}

export function shareWhatsApp(msg, extra = '') {
  window.open('https://wa.me/?text=' + encodeURIComponent(msg + ' ' + shareUrl(extra)), '_blank')
}

export default { SHARE_URL_OVERRIDE, shareUrl, shareWhatsApp }
