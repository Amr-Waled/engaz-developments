import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

// Keep Egyptian and Saudi local entry compatible; other countries use + or 00.
export function normalizeLeadPhone(value) {
  let input = String(value || '').trim()
    .replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit <= '٩' ? 1632 : 1776)))
    .replace(/[\s().\-\u200e\u200f\u061c]/g, '');
  if (!/^\+?\d+$/.test(input)) return null;
  if (input.startsWith('00')) input = '+' + input.slice(2);
  if (!input.startsWith('+')) {
    if (/^0?1[0125]\d{8}$/.test(input)) input = '+20' + input.replace(/^0/, '');
    else if (/^0?5\d{8}$/.test(input)) input = '+966' + input.replace(/^0/, '');
    else if (/^(20|966)\d+$/.test(input)) input = '+' + input;
    else return null;
  }
  const number = parsePhoneNumberFromString(input);
  return number?.isValid() ? number.number : null;
}
