const cms = require('../server/cms-runtime.cjs');
module.exports = async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.statusCode=405; res.setHeader('Allow','GET, HEAD'); return res.end(); }
  const page = typeof req.query.page === 'string' ? req.query.page : 'index.html';
  const baseline = Object.hasOwn(cms.pages, page) ? cms.pages[page] : cms.pages['404.html'];
  const { content } = await cms.published();
  const { renderContent } = await import('../src/cms.mjs');
  res.statusCode = Object.hasOwn(cms.pages, page) && page !== '404.html' ? 200 : 404;
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=15, stale-while-revalidate=30');
  res.end(req.method === 'HEAD' ? '' : renderContent(baseline, page, content, cms.catalog));
};
