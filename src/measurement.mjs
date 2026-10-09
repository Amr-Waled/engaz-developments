const events = {
  project_view: 'ProjectView',
  lead_form_start: 'LeadFormStart',
  lead_form_error: 'LeadFormError',
  lead_form_success: 'LeadFormSuccess',
  lead_form_exit: 'LeadFormExit',
};
const reasons = new Set(['invalid_fields', 'invalid_phone', 'invalid_name', 'request_failed', 'timeout', 'modal_closed', 'page_exit']);

// Never pass form values, free text, query strings or contact details to analytics.
export function measurementPayload(context = {}) {
  const payload = {};
  if (['quick', 'contact'].includes(context.form)) payload.form = context.form;
  if (/^[a-z0-9-]{1,40}$/.test(context.project || '')) payload.project = context.project;
  if (reasons.has(context.reason)) payload.reason = context.reason;
  if (typeof context.duplicate === 'boolean') payload.duplicate = context.duplicate;
  return payload;
}

export function trackSiteEvent(name, context = {}, target = window) {
  if (!events[name] || !['engazdevelopments.com', 'www.engazdevelopments.com'].includes(target.location?.hostname)) return;
  const payload = measurementPayload(context);
  // Measurement failures must never interrupt a customer's enquiry.
  try { if (typeof target.fbq === 'function') target.fbq('trackCustom', events[name], payload); } catch {}
  try { if (typeof target.gtag === 'function') target.gtag('event', name, payload); } catch {}
}

export function createFormJourney(emit) {
  let active = false;
  return {
    start() { if (!active) { active = true; emit('lead_form_start'); } },
    error(reason) { emit('lead_form_error', { reason }); },
    success(duplicate) { active = false; emit('lead_form_success', { duplicate }); },
    exit(reason) { if (active) { active = false; emit('lead_form_exit', { reason }); } },
  };
}
