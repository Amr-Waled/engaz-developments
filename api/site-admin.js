const cms = require('../server/cms-runtime.cjs');
const setSession = (res, token) => res.setHeader('Set-Cookie', `engaz_cms=${token}; Path=/api; HttpOnly; SameSite=Strict; ${process.env.NODE_ENV === 'test' ? '' : 'Secure; '}Max-Age=${token ? 43200 : 0}`);
const allowed = { state:['GET','/api/website/admin'], draft:['PUT','/api/website/draft'], publish:['POST','/api/website/publish'], history:['GET','/api/website/revisions'], restore:['POST','/api/website/restore'], upload:['POST','/api/website/media'] };
module.exports = async (req, res) => {
  res.setHeader('Cache-Control','private, no-store'); res.setHeader('X-Robots-Tag','noindex, nofollow');
  const action = req.query.action;
  if (!['GET','HEAD'].includes(req.method) && !cms.csrf(req)) return cms.json(res,403,{error:'طلب غير مصرح به. افتح اللوحة من نفس الموقع.'});
  try {
    if (action === 'logout' && req.method === 'POST') { setSession(res,''); return cms.json(res,200,{success:true}); }
    if (action === 'login' && req.method === 'POST') {
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 256) return cms.json(res,400,{error:'بيانات دخول غير صالحة'});
      const response = await cms.backend('/api/auth/login',null,'POST',{email,password});
      const login = await response.json();
      if (!response.ok) return cms.json(res,response.status,{error:login.error || 'تعذر تسجيل الدخول'});
      if (!['admin','ceo','marketing_manager'].includes(login.user?.role)) return cms.json(res,403,{error:'حسابك لا يملك صلاحية إدارة الموقع'});
      if (login.user.must_change_password) return cms.json(res,403,{error:'غيّر كلمة المرور المؤقتة من الـCRM أولًا'});
      const access = await cms.backend('/api/website/admin',login.token);
      if (!access.ok) return cms.json(res,503,{error:'خدمة إدارة الموقع لم تُفعّل على السيرفر بعد'});
      setSession(res,login.token); return cms.json(res,200,{success:true,user:{name:login.user.name,role:login.user.role}});
    }
    const token = cms.cookieToken(req);
    if (!token) return cms.json(res,401,{error:'سجّل الدخول بحساب CRM المصرح له'});
    if (action === 'preview' && req.method === 'GET') {
      const page = req.query.page; if (!Object.hasOwn(cms.pages,page)) return cms.json(res,404,{error:'الصفحة غير موجودة'});
      const response = await cms.backend('/api/website/admin',token);
      if (!response.ok) return cms.json(res,response.status,{error:'انتهت الجلسة أو لا توجد صلاحية'});
      const state = await response.json(); const { renderContent } = await import('../src/cms.mjs');
      const { load } = await import('cheerio'); const $ = load(renderContent(cms.pages[page],page,state.content,cms.catalog));
      $('script').remove(); $('form').replaceWith('<p>هذه معاينة المسودة. إرسال الطلبات متاح على الموقع المنشور.</p>');
      $('head').append('<base href="/">');
      res.setHeader('Content-Type','text/html; charset=utf-8'); return res.end($.html());
    }
    const route = allowed[action];
    if (!route || req.method !== route[0]) return cms.json(res,405,{error:'عملية غير مسموحة'});
    const response = await cms.backend(route[1],token,req.method,['POST','PUT'].includes(req.method) ? req.body : undefined);
    if (response.status === 401) setSession(res,'');
    const result = await response.json().catch(() => ({error:'خدمة المحتوى غير متاحة. أعد المحاولة.'}));
    return cms.json(res,response.status,result);
  } catch { return cms.json(res,503,{error:'تعذر الوصول لخدمة الإدارة الآن. لم نؤكد حفظ أي تعديل.'}); }
};
