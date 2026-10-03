const catalog = require('../src/generated/cms-catalog.json');
const pages = require('../src/generated/cms-pages.json');
const API = process.env.NODE_ENV === 'test' && process.env.CMS_TEST_API ? process.env.CMS_TEST_API : 'https://api.engazdevelopments.com';
let cache = { until: 0, content: { values: {} }, updatedAt: null };
const cookieToken = (req) => (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith('engaz_cms='))?.slice(10) || '';
async function published() {
  if (Date.now() < cache.until) return cache;
  try {
    const response = await fetch(API + '/api/website/public', { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error('CMS unavailable');
    const result = await response.json();
    if (!result.content?.values || typeof result.content.values !== 'object') throw new Error('Invalid published content');
    cache = { until: Date.now() + 10000, ...result };
  } catch { cache.until = Date.now() + 10000; }
  return cache;
}
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
