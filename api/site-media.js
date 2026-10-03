const cms = require('../server/cms-runtime.cjs');
module.exports = async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) return cms.json(res,405,{error:'Method not allowed'});
  const id = typeof req.query.id === 'string' && req.query.id;
  if (!/^[a-f0-9-]{36}$/.test(id || '')) return cms.json(res,404,{error:'Image not found'});
  try {
    const response = await cms.backend('/api/website/media/' + id, cms.cookieToken(req));
    if (!response.ok) return cms.json(res,response.status,{error:'Image unavailable'});
    const type = response.headers.get('content-type');
    if (type !== 'image/webp') return cms.json(res,502,{error:'Invalid image response'});
    res.setHeader('Content-Type','image/webp');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control',response.headers.get('cache-control') || 'private, no-store');
    res.end(req.method === 'HEAD' ? '' : Buffer.from(await response.arrayBuffer()));
  } catch { return cms.json(res,503,{error:'تعذر تحميل الصورة الآن'}); }
};
