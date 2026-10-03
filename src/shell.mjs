function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function projectOptionsTemplate(projects) {
  return projects.map((project) => `<option value="${project.crmId ?? ''}" data-slug="${project.slug}" data-project-name="${escapeHtml(project.name)}">${escapeHtml(project.name)} — ${project.location === 'basyoun' ? 'بسيون' : 'القاهرة الجديدة'}</option>`).join('');
}

const navItems = [
  ['index.html', 'الرئيسية'],
  ['projects.html', 'مشروعاتنا'],
  ['portfolio.html', 'سابقة الأعمال'],
  ['about.html', 'عن الشركة'],
  ['contact.html', 'اتصل بنا'],
];


const socialChannels = [
  { channel: 'facebook', label: 'فيسبوك', href: 'https://www.facebook.com/Engazrealestate.eg/', icon: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
  { channel: 'instagram', label: 'إنستجرام', href: 'https://www.instagram.com/engazdevelopments/', icon: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>' },
  { channel: 'tiktok', label: 'تيك توك', href: 'https://www.tiktok.com/@engazdevelopments', icon: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.72-.02-.5-.03-1-.01-1.48.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>' },
  { channel: 'linkedin', label: 'لينكدإن', href: 'https://www.linkedin.com/company/engaz-developments', icon: '<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>' },
];

export function socialLinksTemplate(includeLinkedIn = false) {
  return socialChannels.filter(({ channel }) => includeLinkedIn || channel !== 'linkedin').map(({ channel, label, href, icon }) => `
    <a class="social-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="إنجاز على ${label} — يفتح في نافذة جديدة" title="${label}" data-channel="${channel}">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg>
    </a>`).join('');
}

export function headerTemplate(currentPage = 'index.html') {
  const interestHref = currentPage.startsWith('project-') ? `contact.html?project=${currentPage.slice(8, -5)}#consultation` : 'contact.html#consultation';
  const activeNavPage = currentPage.startsWith('project-') || ['new-cairo.html', 'basyoun.html'].includes(currentPage) ? 'projects.html' : currentPage === 'board.html' ? 'about.html' : currentPage;
  const links = navItems.map(([href, label]) => `
    <a class="nav-link ${activeNavPage === href ? 'active' : ''}" href="${href}" ${activeNavPage === href ? 'aria-current="page"' : ''}>${label}</a>
  `).join('');

  const mobileLinks = navItems.map(([href, label]) => `
    <a class="mobile-nav-link" href="${href}" ${activeNavPage === href ? 'aria-current="page"' : ''}>
      <span>${label}</span>
    </a>
  `).join('');

  return `
    <header class="site-header" data-header>
      <div class="site-container header-inner">
        <a href="index.html" class="brand-mark" aria-label="إنجاز للتطوير العقاري - الرئيسية">
          <img src="images/logo_engaz.png" width="108" height="108" alt="">
        </a>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">${links}</nav>

        <div class="header-actions">
          <nav class="social-links header-social hidden sm:flex" aria-label="حسابات إنجاز">${socialLinksTemplate()}</nav>
          <a href="${interestHref}" class="btn btn-gold header-interest" data-lead-modal-open>
            سجّل اهتمامك
          </a>
          <button type="button" class="menu-trigger lg:hidden" data-menu-button aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobile-menu">
            <i data-lucide="menu" class="size-6" data-menu-icon></i>
          </button>
        </div>
      </div>
    </header>
    <noscript><style>.menu-trigger,[data-lead-form],.listing-controls{display:none!important}</style><nav class="site-container region-guide-links" aria-label="روابط الموقع"><a href="projects.html">كل المشروعات</a><a href="new-cairo.html">القاهرة الجديدة</a><a href="basyoun.html">بسيون</a><a href="contact.html">اتصل بنا</a></nav></noscript>

    <div id="mobile-menu" class="fixed inset-0 z-[60] hidden lg:hidden" data-mobile-menu aria-hidden="true">
      <button class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" data-menu-close aria-label="إغلاق القائمة"></button>
      <aside class="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] translate-x-full flex-col bg-ink-950 px-5 pb-6 pt-4 text-white transition-transform duration-300" data-menu-panel>
        <div class="mb-5 flex h-14 items-center justify-between border-b border-white/10 pb-4">
          <span class="text-sm font-semibold text-gold-300">القائمة الرئيسية</span>
          <button type="button" class="grid size-11 place-items-center rounded-xl bg-white/8" data-menu-close aria-label="إغلاق القائمة"><i data-lucide="x" class="size-6"></i></button>
        </div>
        <nav aria-label="التنقل على الهاتف">${mobileLinks}</nav>
        <div class="mt-auto grid gap-3 pt-6"><nav class="social-links menu-social" aria-label="حسابات إنجاز">${socialLinksTemplate()}</nav>
          <a href="contact.html#consultation" class="btn btn-gold w-full">سجّل اهتمامك</a>
          <a href="https://wa.me/201030405054" target="_blank" rel="noopener" class="btn border border-white/15 bg-white/8 text-white" data-channel="whatsapp"><svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.62a11.94 11.94 0 0 0 5.85 1.49h.01c6.6 0 11.97-5.37 11.97-11.98 0-3.2-1.24-6.21-3.49-8.41ZM12.04 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.67.96.98-3.58-.23-.37a9.89 9.89 0 0 1-1.51-5.29c0-5.49 4.46-9.95 9.95-9.95 2.66 0 5.16 1.04 7.04 2.92a9.88 9.88 0 0 1 2.91 7.04c0 5.49-4.46 9.96-9.95 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.49-.89-.79-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.07 2.91 1.22 3.11c.15.2 2.11 3.23 5.1 4.53.71.31 1.27.49 1.7.63.71.22 1.35.19 1.86.11.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg> واتساب</a>
        </div>
      </aside>
    </div>`;
}

export function footerTemplate(name = '', projects = []) {
  const projectSlug = projects.find((project) => project.name === name)?.slug;
  const interestHref = projectSlug ? `contact.html?project=${projectSlug}#consultation` : 'contact.html#consultation';
  const whatsappHref = name ? `https://wa.me/201030405054?text=${encodeURIComponent(`مرحباً إنجاز، أريد معلومات عن مشروع ${name}`)}` : 'https://wa.me/201030405054';
  return `
    <footer class="bg-ink-950 pb-24 pt-10 text-white md:pb-8">
      <div class="site-container">
        <div class="footer-columns grid grid-cols-2 gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div class="col-span-2 lg:col-span-1">
            <div class="mb-5 flex items-center gap-3">
              <span class="grid size-12 place-items-center overflow-hidden rounded-xl bg-white"><img src="images/logo_engaz.png" alt="" class="size-full object-contain p-1"></span>
              <div><strong class="block text-xl font-semibold">ENGAZ</strong><span class="text-xs text-gold-300">للتطوير العقاري والمقاولات</span></div>
            </div>
            <p class="max-w-sm text-sm leading-7 text-slate-300">التطوير العقاري والمقاولات منذ 2012. مشروعات في القاهرة الجديدة والدلتا.</p>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-semibold text-gold-300">استكشف</h2>
            <div class="grid gap-3 text-sm text-slate-300">
              <a href="projects.html" class="flex min-h-11 items-center hover:text-white">المشروعات</a><a href="new-cairo.html" class="flex min-h-11 items-center hover:text-white">القاهرة الجديدة</a><a href="basyoun.html" class="flex min-h-11 items-center hover:text-white">بسيون</a><a href="portfolio.html" class="flex min-h-11 items-center hover:text-white">سابقة الأعمال</a><a href="testimonials.html" class="flex min-h-11 items-center hover:text-white">آراء العملاء</a><a href="about.html" class="flex min-h-11 items-center hover:text-white">عن إنجاز</a><a href="board.html" class="flex min-h-11 items-center hover:text-white">مجلس الإدارة</a><a href="contact.html" class="flex min-h-11 items-center hover:text-white">الفروع والتواصل</a>
            </div>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-semibold text-gold-300">تواصل معنا</h2>
            <div class="grid gap-3 text-sm text-slate-300">
              <a href="tel:+201030405054" dir="ltr" class="flex min-h-11 w-fit items-center hover:text-white" data-channel="phone-egypt">+20 10 3040 5054</a>
              <a href="tel:+966503040505" dir="ltr" class="flex min-h-11 w-fit items-center hover:text-white" data-channel="phone-saudi">+966 50 304 0505</a>
              <a href="contact.html" class="flex min-h-11 items-center hover:text-white">الفروع وطرق التواصل</a>
            </div>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-semibold text-gold-300">تابع إنجاز</h2>
            <nav class="social-links footer-social" aria-label="حسابات إنجاز">${socialLinksTemplate(true)}</nav>
          </div>
        </div>
        <div class="flex flex-col gap-3 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 إنجاز للتطوير العقاري. جميع الحقوق محفوظة.</p>
          <div class="flex gap-4"><a href="privacy.html" class="flex min-h-11 items-center hover:text-white">سياسة الخصوصية</a><a href="contact.html" class="flex min-h-11 items-center hover:text-white">الدعم والتواصل</a></div>
        </div>
      </div>
    </footer>

    <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer" class="floating-whatsapp fixed bottom-6 left-5 z-40 hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-card transition hover:bg-emerald-600 md:grid" aria-label="تواصل مع إنجاز على واتساب" title="تواصل على واتساب" data-channel="whatsapp"><svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.62a11.94 11.94 0 0 0 5.85 1.49h.01c6.6 0 11.97-5.37 11.97-11.98 0-3.2-1.24-6.21-3.49-8.41ZM12.04 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.67.96.98-3.58-.23-.37a9.89 9.89 0 0 1-1.51-5.29c0-5.49 4.46-9.95 9.95-9.95 2.66 0 5.16 1.04 7.04 2.92a9.88 9.88 0 0 1 2.91 7.04c0 5.49-4.46 9.96-9.95 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.49-.89-.79-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.07 2.91 1.22 3.11c.15.2 2.11 3.23 5.1 4.53.71.31 1.27.49 1.7.63.71.22 1.35.19 1.86.11.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg></a>

    <nav class="mobile-actions" aria-label="إجراءات سريعة"><a href="projects.html">المشروعات</a><a href="${whatsappHref}" target="_blank" rel="noopener" data-channel="whatsapp">واتساب</a><a href="${interestHref}" class="mobile-interest" data-lead-modal-open>سجّل اهتمامك</a></nav>

    <div class="fixed inset-0 z-[70] hidden" data-lead-modal aria-hidden="true">
      <button type="button" class="absolute inset-0 bg-ink-950/75 backdrop-blur-sm" data-lead-modal-close aria-label="إغلاق نموذج تسجيل الاهتمام"></button>
      <section class="absolute inset-x-0 bottom-0 max-h-[92svh] translate-y-6 overflow-y-auto rounded-t-3xl bg-white p-6 opacity-0 shadow-2xl transition duration-300 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,620px)] sm:-translate-x-1/2 sm:-translate-y-[46%] sm:rounded-3xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="quick-lead-title" data-lead-modal-panel>
        <div class="flex items-start justify-between gap-5">
          <div><p class="text-xs font-semibold text-gold-600">طلب معلومات</p><h2 id="quick-lead-title" class="mt-2 text-2xl font-semibold text-ink-950 sm:text-3xl">سجّل اهتمامك</h2><p class="mt-2 text-sm leading-7 text-slate-600">اترك اسمك ورقمك ليتواصل معك فريق إنجاز.</p></div>
          <button type="button" class="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-ink-950 hover:bg-sand-100" data-lead-modal-close aria-label="إغلاق"><i data-lucide="x" class="size-5"></i></button>
        </div>
        <p class="lead-context" data-lead-context></p><form class="mt-6 grid gap-4 sm:grid-cols-2" data-lead-form novalidate>
          <input type="hidden" name="source" value="Website quick lead">
          <label class="grid gap-2 text-sm font-medium text-ink-950">الاسم بالكامل<input class="field" name="name" type="text" autocomplete="name" minlength="3" placeholder="اكتب اسمك" required></label>
          <label class="grid gap-2 text-sm font-medium text-ink-950">رقم الهاتف<input class="field text-right" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="01xxxxxxxxx" required></label>
          <details class="lead-optional sm:col-span-2"><summary>إضافة المشروع ونوع الوحدة <span>(اختياري)</span></summary><div class="grid gap-4 sm:grid-cols-2">          <label class="grid gap-2 text-sm font-medium text-ink-950">المشروع <span class="font-normal text-slate-400">(اختياري)</span><select class="field" name="project_interest">
            <option value="">لم أحدد مشروعًا</option>
            ${projectOptionsTemplate(projects)}
          </select></label>
          <label class="grid gap-2 text-sm font-medium text-ink-950">نوع الوحدة <span class="font-normal text-slate-400">(اختياري)</span><select class="field" name="unit_type"><option value="">لم أحدد النوع</option><option value="apartment">سكنية</option><option value="shop">تجارية</option><option value="office">إدارية</option><option value="clinic">طبية</option><option value="villa">فيلا</option></select></label>
</div></details>
          <label class="flex items-start gap-3 text-xs leading-6 text-slate-600 sm:col-span-2"><input type="checkbox" class="mt-1 size-4 accent-gold-500" required><span>أوافق على تواصل فريق إنجاز معي بخصوص هذا الطلب وفق <a href="privacy.html" class="font-bold underline">سياسة الخصوصية</a>.</span></label>
          <div class="sm:col-span-2"><button type="submit" class="btn btn-primary w-full">اطلب معاودة الاتصال </button><p class="mt-2 min-h-6 text-sm font-bold text-emerald-700" role="status" aria-live="polite" data-form-status></p></div>
        </form>
      </section>
    </div>`;
}
