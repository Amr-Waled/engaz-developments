import {load} from 'cheerio';
import {projectCard} from './project-card.mjs';
import {projectOptionsTemplate} from './shell.mjs';
export function renderProjects(html,page,catalog){
 const $=load(html),visible=catalog.filter(p=>p.visible),bySlug=new Map(catalog.map(p=>[p.slug,p]));
 $('[data-project-card]').each((_,node)=>{const el=$(node),slug=el.find('a[href^="project-"]').first().attr('href')?.match(/^project-(.+)\.html$/)?.[1],p=bySlug.get(slug);if(p&&(!p.visible||(['basyoun.html','new-cairo.html'].includes(page)&&p.location!==page.replace('.html',''))))el.remove();else if(p?.managed)el.replaceWith(projectCard(p));});
 $('.region-group').each((_,node)=>{if(!$(node).find('[data-project-card]').length)$(node).remove();});
 if(['projects.html','basyoun.html','new-cairo.html'].includes(page)){
  const region=page==='projects.html'?null:page.replace('.html','');
  const missing=visible.filter(p=>(!region||p.location===region)&&!$('a[href="project-'+p.slug+'.html"]').filter((_,n)=>$(n).closest('[data-project-card]').length).length);
  let grid=page==='projects.html'?$('.discovery-grid').first():$('#region-projects .discovery-grid').first();
  if(!grid.length&&$('#region-projects').length){$('#region-projects').append('<div class="discovery-grid"></div>');grid=$('#region-projects .discovery-grid');}
  grid.append(missing.map(projectCard).join(''));
 }
 const slug=page.match(/^project-(.+)\.html$/)?.[1],project=bySlug.get(slug);
 if(project?.managed&&project.visible){
  const url='https://engazdevelopments.com/project-'+slug+'.html',title=project.name+' | '+project.address+' | إنجاز';
  $('body').attr('data-current-project',slug).attr('data-project-name',project.name);
  $('title').text(title);$('link[rel="canonical"]').attr('href',url);$('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',project.description);$('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);$('meta[property="og:url"]').attr('content',url);$('meta[property="og:image"],meta[name="twitter:image"]').attr('content',new URL(project.image.src,'https://engazdevelopments.com/').href);
  $('.detail-heading h1').text(project.name);$('.detail-heading p:not(.section-kicker)').text(project.description);$('.detail-heading .section-kicker').text(project.address);$('.detail-heading>a').attr('href','projects.html?location='+project.location);
  $('.breadcrumb [aria-current="page"]').text(project.name);$('.breadcrumb a[href$="cairo.html"],.breadcrumb a[href="basyoun.html"]').attr('href','projects.html?location='+project.location).text(project.address);
  if(!$('#project-image img').length)$('#project-image>a').first().append('<img fetchpriority="high">');
  $('#project-image img').removeAttr('srcset').removeAttr('data-cms-image').attr({src:project.image.src,alt:project.image.alt,width:project.image.width,height:project.image.height});$('#project-image a').attr('href',project.image.src).attr('aria-label','عرض صورة '+project.name);$('#project-image figcaption span').text(project.image.caption);
  const facts=$('.detail-facts');facts.find('dd').eq(0).text(project.address);facts.find('dd').eq(1).text(project.use);facts.find('dd').eq(2).text(project.stageLabel);facts.find('.image-note').text(project.image.caption);
  for(const [label,value] of [['خطة السداد',project.paymentPlan],['التفاصيل',project.specs]])if(value){const section=$('<section class="detail-facts"></section>');section.append($('<h2></h2>').text(label),$('<p></p>').text(value));facts.after(section);}
  $('.project-enquiry .section-kicker').text('تواصل بخصوص '+project.name);$('.project-enquiry h2').text('تفاصيل المشروع');$('.project-enquiry>p:not(.section-kicker):not(.enquiry-note)').text('تواصل مع فريق إنجاز لتأكيد المساحات والأسعار والتوافر الحالي.');$('.enquiry-note').text('الأسعار وتوافر الوحدات يؤكدهما فريق المبيعات وقت الاستفسار.');
  $('[data-project-interest]').attr('data-project-interest',slug);$('.project-enquiry a[data-channel="whatsapp"]').each((_,n)=>{const href=$(n).attr('href');try{const u=new URL(href);u.searchParams.set('text','أريد تفاصيل مشروع '+project.name);$(n).attr('href',u.href);}catch{}});
  $('.related-projects').remove();let entities=[];try{const previous=JSON.parse($('script[type="application/ld+json"]').first().text());entities=(previous['@graph']||[]).filter(e=>['Organization','WebSite'].includes(e['@type']));}catch{}$('script[type="application/ld+json"]').remove();$('head').append('<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':[...entities,{'@type':'WebPage','@id':url+'#webpage',name:title,url,description:project.description,mainEntity:{'@id':url+'#project'}},{'@type':'Place','@id':url+'#project',name:project.name,address:project.address,description:project.description,image:new URL(project.image.src,'https://engazdevelopments.com/').href}]}).replace(/</g,'\\u003c')+'</script>');
 }
 $('script[type="application/ld+json"]').each((_,node)=>{try{const data=JSON.parse($(node).text());const update=obj=>{if(!obj||typeof obj!=='object')return;if(obj['@type']==='ItemList'){const items=visible.filter(p=>!['basyoun.html','new-cairo.html'].includes(page)||p.location===page.replace('.html',''));obj.numberOfItems=items.length;obj.itemListElement=items.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:'https://engazdevelopments.com/project-'+p.slug+'.html'}));}else for(const value of Object.values(obj))if(Array.isArray(value))value.forEach(update);else if(value&&typeof value==='object')update(value);};update(data);$(node).text(JSON.stringify(data).replace(/</g,'\\u003c'));}catch{}});
 $('select[name="project_interest"]').each((_,n)=>{$(n).empty().append('<option value="">اختر المشروع (اختياري)</option>'+projectOptionsTemplate(visible));});
 $('script[data-company-projects]').remove();$('head').append('<script type="application/json" data-company-projects>'+JSON.stringify(visible).replace(/</g,'\\u003c')+'</script>');
 return $.html();
}
