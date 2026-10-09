const catalog = require('../src/generated/cms-catalog.json');
const pages = require('../src/generated/cms-pages.json');
const API = process.env.NODE_ENV === 'test' && process.env.CMS_TEST_API ? process.env.CMS_TEST_API : 'https://api.engazdevelopments.com';
const snapshot = require('../src/generated/published-snapshot.json');
const { createPublishedCache } = require('./published-cache.cjs');
const cookieToken = (req) => (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith('engaz_cms='))?.slice(10) || '';
const published = createPublishedCache(snapshot, async () => {
    const response = await fetch(API + '/api/website/public', { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error('CMS unavailable');
    return response.json();
});
function json(res, status, body) { res.statusCode = status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(body)); }
function csrf(req) {
  const host = req.headers.host;
  const expected = `${process.env.NODE_ENV === 'test' ? 'http' : 'https'}://${host}`;
  return req.headers.origin === expected && req.headers['x-engaz-admin'] === '1';
}
async function backend(path, token, method = 'GET', body) {
  return fetch(API + path, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type':'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
}
module.exports = { catalog, pages, cookieToken, published, backend, json, csrf };
