export const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'campaign_id', 'adset_id', 'ad_id', 'adset_name', 'ad_name'];
const storageKey = 'engaz:campaign:v1';

export function campaignContext() {
  let stored = {};
  try { stored = JSON.parse(window.sessionStorage.getItem(storageKey) || '{}'); } catch { /* Attribution must not block browsing in restricted webviews. */ }
  const current = new URLSearchParams(window.location.search);
  const incoming = Object.fromEntries(campaignKeys.filter((key) => current.has(key)).map((key) => [key, current.get(key).slice(0, 500)]));
  const changed = Object.keys(incoming).some((key) => incoming[key] !== stored.parameters?.[key]);
  const parameters = changed ? incoming : { ...stored.parameters, ...incoming };
  const context = {
    parameters,
    landingPage: changed || !stored.landingPage ? window.location.href : stored.landingPage,
    referrer: changed || !stored.landingPage ? document.referrer : stored.referrer || '',
    clickTimestamp: changed || !stored.clickTimestamp ? Date.now() : stored.clickTimestamp,
  };
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(context)); } catch { /* Storage can be disabled; the current URL remains usable. */ }
  return { ...context, query: new URLSearchParams(context.parameters) };
}
