import assert from 'node:assert/strict';
import { campaignContext } from '../src/attribution.mjs';

const storage = new Map();
globalThis.window = {
  location: { href: 'https://engazdevelopments.com/?utm_source=facebook&utm_campaign=launch&fbclid=click-one&ad_id=ad-one', search: '?utm_source=facebook&utm_campaign=launch&fbclid=click-one&ad_id=ad-one' },
  sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
};
globalThis.document = { referrer: 'https://www.facebook.com/' };
const initial = campaignContext();
assert.equal(initial.query.get('ad_id'), 'ad-one');
window.location = { href: 'https://engazdevelopments.com/contact.html', search: '' };
document.referrer = 'https://engazdevelopments.com/project-h165.html';
const contact = campaignContext();
assert.equal(contact.query.get('utm_campaign'), 'launch');
assert.equal(contact.landingPage, initial.landingPage);
assert.equal(contact.referrer, 'https://www.facebook.com/');
assert.equal(contact.clickTimestamp, initial.clickTimestamp);
window.location = { href: 'https://engazdevelopments.com/basyoun.html?utm_source=instagram&utm_campaign=basyoun', search: '?utm_source=instagram&utm_campaign=basyoun' };
const next = campaignContext();
assert.equal(next.query.get('utm_source'), 'instagram');
assert.equal(next.query.get('fbclid'), null);
assert.equal(next.query.get('ad_id'), null);
window.sessionStorage.getItem = () => { throw new Error('Storage blocked by webview'); };
window.sessionStorage.setItem = () => { throw new Error('Storage blocked by webview'); };
assert.equal(campaignContext().query.get('utm_campaign'), 'basyoun');
console.log('Attribution checks passed: paid entry, subsequent pages, original landing/referrer, new campaign and blocked storage.');
