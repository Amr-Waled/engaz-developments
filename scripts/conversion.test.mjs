import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { normalizeLeadPhone } from '../src/lead-phone.mjs';
import { measurementPayload, trackSiteEvent, createFormJourney } from '../src/measurement.mjs';
const require = createRequire(import.meta.url);
const { createPublishedCache } = require('../server/published-cache.cjs');

test('phone normalization preserves identity across local, Arabic and international forms', () => {
  for (const input of ['01012345678', '١٠١٢٣٤٥٦٧٨', '۰۱۰۱۲۳۴۵۶۷۸', '+20 (10) 1234-5678', '00201012345678']) assert.equal(normalizeLeadPhone(input), '+201012345678');
  for (const input of ['0501234567', '501234567', '+966501234567', '00966501234567']) assert.equal(normalizeLeadPhone(input), '+966501234567');
  assert.equal(normalizeLeadPhone('+971501234567'), '+971501234567');
  assert.equal(normalizeLeadPhone('0096565012345'), '+96565012345');
  assert.equal(normalizeLeadPhone('+447400123456'), '+447400123456');
  for (const value of ['', 'hello +201012345678', '+999123456789', '12345', '010123456789', '+201012345678 ext 2', '++201012345678']) assert.equal(normalizeLeadPhone(value), null);
});

test('measurement excludes contact details, free text and query strings', () => {
  assert.deepEqual(measurementPayload({ form: 'quick', project: 'h165', reason: 'invalid_phone', phone: '+201012345678', name: 'Person', email: 'person@example.test', notes: 'secret', query: '?phone=123', duplicate: false }), { form: 'quick', project: 'h165', reason: 'invalid_phone', duplicate: false });
  assert.deepEqual(measurementPayload({ form: 'person@example.test', project: '?phone=123', reason: 'Sensitive arbitrary error' }), {});
});

test('funnel events stay out of previews and cannot block submissions', () => {
  const events = [];
  const target = { location: { hostname: 'preview.vercel.app' }, fbq: (...a) => events.push(a) };
  trackSiteEvent('lead_form_success', {}, target);
  assert.equal(events.length, 0);
  target.location.hostname = 'engazdevelopments.com';
  trackSiteEvent('lead_form_success', { duplicate: false }, target);
  assert.deepEqual(events[0], ['trackCustom', 'LeadFormSuccess', { duplicate: false }]);
  target.fbq = () => { throw new Error('blocked SDK'); };
  assert.doesNotThrow(() => trackSiteEvent('lead_form_start', {}, target));
});

test('journeys do not double-count starts/exits or treat successful forms as abandoned', () => {
  const events = []; const journey = createFormJourney((...args) => events.push(args));
  journey.start(); journey.start(); journey.error('invalid_phone'); journey.success(false); journey.exit('page_exit');
  journey.start(); journey.exit('modal_closed'); journey.exit('page_exit');
  assert.deepEqual(events.map(e => e[0]), ['lead_form_start', 'lead_form_error', 'lead_form_success', 'lead_form_start', 'lead_form_exit']);
});

test('CMS cold starts retain the deployment snapshot; later failures retain newer publications', async () => {
  let clock = 100; let fail = true; let calls = 0;
  const snapshot = { content: { values: { headline: 'Approved at deployment' } }, revision: 1 };
  const published = createPublishedCache(snapshot, async () => { calls++; if (fail) throw new Error('offline'); return { content: { values: { headline: 'New publication' } }, revision: 2 }; }, () => clock);
  assert.equal((await published()).content.values.headline, 'Approved at deployment');
  await published(); assert.equal(calls, 1);
  clock += 11000; fail = false;
  const [a,b] = await Promise.all([published(), published()]);
  assert.equal(calls, 2); assert.equal(a.revision, 2); assert.equal(b.revision, 2);
  clock += 11000; fail = true;
  assert.equal((await published()).content.values.headline, 'New publication');
});

test('CMS accepts intentional empty publication and rejects malformed updates', async () => {
  let clock = 100; let values = {};
  const published = createPublishedCache({ content: { values: { old: 'removed' } } }, async () => ({ content: { values } }), () => clock);
  assert.deepEqual((await published()).content.values, {});
  clock += 11000; values = [];
  assert.deepEqual((await published()).content.values, {});
});
