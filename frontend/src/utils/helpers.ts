// WHAT: Small reusable utility functions
// IMPORTS: Nothing (pure functions)
// USED BY: Any page or component that needs formatting
// CONTAINS: formatPrice(), formatDate(), truncateText(), getStatusColor(), getCloudinaryUrl()


import { CLOUDINARY_CLOUD_NAME } from '../config/constants';

export function getStatusColor(status: string): 'warning' | 'info' | 'secondary' | 'success' | 'error' | 'default' {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'shipped':
      return 'secondary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()} IQD`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getCloudinaryUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
}

// NOTES:
// → getStatusColor: maps each order status word to an MUI Chip-recognized
//   color name (not raw hex). pending=warning(yellow), confirmed=info(blue),
//   shipped=secondary(purple), delivered=success(green), cancelled=error(red).
//   default='default' (gray) protects against unexpected/typo'd status strings.
// → formatPrice: uses built-in .toLocaleString() to auto-add comma separators
//   (15000 → "15,000"), then appends " IQD" — returns one ready-to-display
//   string, no formatting logic needed in the calling component.
// → formatDate: converts a raw ISO timestamp string into a readable
//   "Aug 20, 2026, 2:32 PM" format using built-in Intl formatting via
//   toLocaleString — includes both date and time per Zhegir's request.
// → truncateText: has a default maxLength of 50 so it can be called as
//   truncateText(text) with no second argument, but any component can
//   override it — e.g. truncateText(text, 100) for a longer preview.
//   Returns the original text unchanged if it's already short enough.
// → getCloudinaryUrl: imports CLOUDINARY_CLOUD_NAME from config/constants.ts.
//   ⚠️ IMPORTANT: this constant does NOT exist in constants.ts yet — Zhegir
//   is asking a teammate to add it. Until then, this file will fail to
//   compile/import correctly. This was a deliberate choice over hardcoding
//   a placeholder cloud name, so the missing dependency is visible instead
//   of silently wrong.

/** STORY
 * helpers.ts is the mall's back-office toolkit — the price tag printer
 * (formatPrice), the receipt clock (formatDate), the shelf-sign trimmer
 * (truncateText), the traffic-light control box (getStatusColor), and the
 * locker-number-to-address lookup (getCloudinaryUrl) — five small tools
 * every department in the mall reaches for, kept in one shared drawer
 * instead of five different reinvented ones.
 */