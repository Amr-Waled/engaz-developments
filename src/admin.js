const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state, dirty = false, pending = false, page = 'index.html';
const status = (text, error = false) => { $('#cms-status').textContent = text; $('#cms-status').dataset.error = String(error); };
async function api(action, method = 'GET', body) {
  const response = await fetch(`/api/site-admin?action=${action}`, { method, credentials:'same-origin', headers:{'x-engaz-admin':'1',...(body ? {'Content-Type':'application/json'} : {})}, ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(22000) });
  const result = await response.json(); if (!response.ok) { if(response.status===401) showLogin(); throw new Error(result.error || 'تعذر إتمام العملية'); } return result;
}
function showLogin() { $('#login-panel').hidden=false; $('#editor-panel').hidden=true; $('#logout').hidden=true; $('#cms-user').textContent=''; state=null; }
function controls() {
  document.querySelectorAll('#fields input,#fields textarea,#page-select,#field-search,#field-type').forEach((input)=>{input.disabled=pending;});
  $('#save').disabled = pending || !dirty;
  $('#publish').disabled = pending || dirty || !state || state.revision === state.publishedRevision;
  $('#preview').setAttribute('aria-disabled', String(pending || dirty));
  $('#preview').href = `/api/site-admin?action=preview&page=${encodeURIComponent(page)}`;
  $('#revision-status').textContent = state ? `مسودة ${state.revision} · المنشور ${state.publishedRevision}${dirty ? ' · تعديلات لم تُحفظ' : ' · كل التعديلات محفوظة'}` : '';
}
function setDirty() { dirty=true; controls(); }
const effective = (field) => Object.hasOwn(state.content.values,field.key) ? state.content.values[field.key] : field.default;
function renderFields() {
  const keys = state.catalog.pages.find((p)=>p.id===page).fields;
  const query = $('#field-search').value.trim().toLowerCase();
  const type = $('#field-type').value;
  const fields = state.catalog.fields.filter((f)=>keys.includes(f.key) && (type==='all' || (type==='seo' ? f.key.includes(':meta:') : f.type===type && !f.key.includes(':meta:'))) && (!query || `${f.label} ${typeof effective(f)==='string' ? effective(f) : ''}`.toLowerCase().includes(query)));
  $('#fields').innerHTML=fields.map((f)=>{ const value=effective(f); const id=`field-${state.catalog.fields.indexOf(f)}`; return `<section class="cms-field" data-key="${escape(f.key)}"><div class="cms-field-top"><div><label for="${id}">${escape(f.label)}</label>${f.shared ? '<small>مشترك بين صفحات الموقع</small>' : ''}</div><button type="button" data-reset>استرجاع الأصل</button></div>${f.type==='text' ? `<textarea id="${id}" data-text maxlength="${f.maxLength}" rows="${value.length>160 ? 4 : 2}" ${f.required ? 'required' : ''}>${escape(value)}</textarea>` : `<img class="cms-image-preview" src="${escape(value.src)}" alt="${escape(value.alt)}"><div class="cms-image-tools"><label class="cms-secondary">اختيار صورة جديدة<input type="file" data-file accept="image/jpeg,image/png,image/webp" hidden></label><label><input type="checkbox" data-hide ${value.hidden ? 'checked' : ''}>إخفاء الصورة من الموقع</label></div><label for="${id}">وصف الصورة</label><input id="${id}" data-alt maxlength="500" value="${escape(value.alt)}"><p class="cms-muted">JPG أو PNG أو WebP. تُضغط الصورة وتُحفظ في مكتبة الموقع، والصورة القديمة تظل متاحة للإصدارات السابقة.</p>`}</section>`}).join('');
  $('#no-results').hidden=fields.length>0; controls();
}
async function loadState() {
  state=await api('state'); dirty=false;
  $('#login-panel').hidden=true; $('#editor-panel').hidden=false; $('#logout').hidden=false;
  $('#cms-user').textContent=state.user.name;
  $('#page-select').innerHTML=state.catalog.pages.map((p)=>`<option value="${escape(p.id)}">${escape(p.label)}</option>`).join('');
  $('#page-select').value=page; renderFields();
}
async function perform(fn) { if(pending)return; pending=true; controls(); try{await fn();}catch(error){status(error.name==='TimeoutError' ? 'الاتصال اتأخر. أعد تحميل اللوحة للتأكد من حالة الحفظ قبل المحاولة مرة أخرى.' : error.message,true);}finally{pending=false;controls();} }
$('#login-form').addEventListener('submit',async(event)=>{event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;try{await api('login','POST',{email:$('#email').value,password:$('#password').value});$('#password').value='';await loadState();status('تم تسجيل الدخول. اختَر الصفحة التي تريد تعديلها.');}catch(error){status(error.message,true);}finally{button.disabled=false;}});
$('#logout').addEventListener('click',()=>{if(dirty)return status('احفظ المسودة قبل تسجيل الخروج حتى لا تفقد تعديلاتك.',true);perform(async()=>{await api('logout','POST',{});showLogin();status('تم تسجيل الخروج.');});});
$('#page-select').addEventListener('change',()=>{page=$('#page-select').value;$('#field-search').value='';renderFields();});
$('#field-search').addEventListener('input',renderFields);
$('#field-type').addEventListener('change',renderFields);
$('#fields').addEventListener('input',(event)=>{const card=event.target.closest('[data-key]');if(!card||!state)return;const field=state.catalog.fields.find((f)=>f.key===card.dataset.key);if(event.target.matches('[data-text]'))state.content.values[field.key]=event.target.value;else if(event.target.matches('[data-alt]'))state.content.values[field.key]={...effective(field),alt:event.target.value};else return;setDirty();});
$('#fields').addEventListener('click',(event)=>{const reset=event.target.closest('[data-reset]');if(!reset||pending)return;delete state.content.values[reset.closest('[data-key]').dataset.key];setDirty();renderFields();});
$('#fields').addEventListener('change',async(event)=>{const card=event.target.closest('[data-key]');if(!card||pending||!state)return;const field=state.catalog.fields.find((f)=>f.key===card.dataset.key);if(event.target.matches('[data-hide]')){state.content.values[field.key]={...effective(field),hidden:event.target.checked};setDirty();return;}if(!event.target.matches('[data-file]'))return;const file=event.target.files[0];if(!file)return;
  await perform(async()=>{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20*1024*1024)throw new Error('اختَر صورة JPG أو PNG أو WebP أصغر من 20MB.');status('جارٍ تجهيز الصورة ورفعها…');const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>24000000){bitmap.close();throw new Error('الصورة كبيرة جدًا. صدّر نسخة أصغر من 24 ميجابكسل.');}const scale=Math.min(1,1920/bitmap.width,1920/bitmap.height);const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const blob=await new Promise((resolve)=>canvas.toBlob(resolve,'image/webp',.82));if(!blob||blob.size>2*1024*1024)throw new Error('صدّر نسخة أصغر من الصورة ثم أعد الرفع.');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});const uploaded=await api('upload','POST',{base64:data,fileName:file.name});state.content.values[field.key]={src:uploaded.src,alt:effective(field).alt,hidden:false,width:uploaded.width,height:uploaded.height};setDirty();renderFields();status('الصورة مرفوعة. احفظ المسودة وراجعها قبل النشر.');});
});
$('#save').addEventListener('click',()=>perform(async()=>{const saved=await api('draft','PUT',{revision:state.revision,values:state.content.values});state.revision=saved.revision;state.content=saved.content;dirty=false;status('تم حفظ المسودة. الموقع المنشور لم يتغير.');}));
$('#publish').addEventListener('click',()=>perform(async()=>{const result=await api('publish','POST',{revision:state.revision});state.publishedRevision=result.revision;status('تم النشر. قد يستغرق ظهور التعديل على كل الصفحات حتى دقيقة.');}));
$('#history-toggle').addEventListener('click',()=>perform(async()=>{const history=await api('history');$('#history').hidden=false;$('#history').innerHTML=history.length ? history.map((item)=>`<div class="cms-history-item"><span>الإصدار ${item.source_revision} · ${escape(new Date(item.created_at).toLocaleString('ar-EG'))}</span><button data-restore="${item.id}">استرجاع كمسودة</button></div>`).join('') : '<p class="cms-muted">لا توجد إصدارات منشورة سابقة بعد.</p>';}));
$('#history').addEventListener('click',(event)=>{const button=event.target.closest('[data-restore]');if(!button)return;if(dirty)return status('احفظ التعديلات الحالية أولًا قبل استرجاع إصدار سابق.',true);perform(async()=>{const saved=await api('restore','POST',{id:Number(button.dataset.restore),revision:state.revision});state.revision=saved.revision;state.content=saved.content;renderFields();status('تم استرجاع الإصدار كمسودة. راجعه قبل نشره.');});});
window.addEventListener('beforeunload',(event)=>{if(dirty){event.preventDefault();event.returnValue='';}});
loadState().catch((error)=>{showLogin();if(error.message!=='سجّل الدخول بحساب CRM المصرح له')status(error.message,true);});
