const cms=require('../server/cms-runtime.cjs');
const {publishedProjects}=require('../server/company-projects.cjs');
module.exports=async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.setHeader('Allow','GET, HEAD');return res.end();}
 const page=typeof req.query.page==='string'?req.query.page:'index.html';
 try{
  const [{content},projects]=await Promise.all([cms.published(),publishedProjects()]);
  const slug=page.match(/^project-([a-z0-9-]+)\.html$/)?.[1],project=slug&&projects.find(p=>p.slug===slug);
  const exists=slug?Boolean(project?.visible):Object.hasOwn(cms.pages,page)&&page!=='404.html';
  const template=exists?(cms.pages[page]||(slug?cms.pages['project-h165.html']:null)):cms.pages['404.html'];
  const {renderContent}=await import('../src/cms.mjs'),{renderProjects}=await import('../src/company-projects.mjs');
  const rendered=renderContent(template,page,content,cms.catalog);
  res.statusCode=exists?200:404;res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, max-age=0, s-maxage=15, stale-while-revalidate=30');
  res.end(req.method==='HEAD'?'':renderProjects(rendered,page,projects));
 }catch{res.statusCode=503;res.setHeader('Retry-After','30');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>إنجاز</title><h1>نعيد تحميل بيانات الموقع</h1><p>يرجى المحاولة بعد قليل.</p></html>');}
};
