import {
  createIcons,
  Menu, X, ArrowLeft, ArrowRight, MapPin, Phone, MessageCircle,
  Building2, Home, ShieldCheck, Ruler, WalletCards, HardHat,
  CheckCircle2, Clock3, ChevronLeft, Star, Quote, Mail,
  Play, UsersRound, Award,
  Target, Eye, Gem, Handshake, CalendarDays, Layers3,
  BadgeCheck, Send, LoaderCircle, SlidersHorizontal, Search,
  Sparkles, Navigation, Headphones, ExternalLink, CircleCheck,
  KeyRound,
} from 'lucide';

document.documentElement.classList.add('motion-ok');

const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:'
  ? 'http://localhost:5001'
  : 'https://api.engazdevelopments.com';

const icons = {
  Menu, X, ArrowLeft, ArrowRight, MapPin, Phone, MessageCircle,
  Building2, Home, ShieldCheck, Ruler, WalletCards, HardHat,
  CheckCircle2, Clock3, ChevronLeft, Star, Quote, Mail,
  Play, UsersRound, Award,
  Target, Eye, Gem, Handshake, CalendarDays, Layers3,
  BadgeCheck, Send, LoaderCircle, SlidersHorizontal, Search,
  Sparkles, Navigation, Headphones, ExternalLink, CircleCheck,
  KeyRound,
};

const navItems = [
  ['index.html', 'الرئيسية'],
  ['projects.html', 'مشروعاتنا'],
  ['portfolio.html', 'سابقة الأعمال'],
  ['about.html', 'عن الشركة'],
  ['testimonials.html', 'آراء العملاء'],
  ['contact.html', 'اتصل بنا'],
];

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function headerTemplate() {
  const links = navItems.map(([href, label]) => `
    <a class="nav-link ${currentPage === href ? 'active' : ''}" href="${href}" ${currentPage === href ? 'aria-current="page"' : ''}>${label}</a>
  `).join('');

  const mobileLinks = navItems.map(([href, label]) => `
    <a class="mobile-nav-link" href="${href}" ${currentPage === href ? 'aria-current="page"' : ''}>
      <span>${label}</span><i data-lucide="chevron-left" class="size-5 text-gold-300"></i>
    </a>
  `).join('');

  return `
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-sand-50/92 backdrop-blur-xl" data-header>
      <div class="site-container flex h-[72px] items-center justify-between gap-4 lg:h-20">
        <a href="index.html" class="flex shrink-0 items-center gap-3" aria-label="إنجاز للتطوير العقاري - الرئيسية">
          <span class="grid size-11 place-items-center overflow-hidden rounded-xl border border-gold-400/50 bg-white shadow-sm lg:size-12">
            <img src="images/logo_engaz.png" width="48" height="48" alt="" class="size-full object-contain p-1">
          </span>
          <span class="leading-none">
            <strong class="block text-lg font-black tracking-[.08em] text-ink-950">ENGAZ</strong>
            <span class="mt-1 block text-[9px] font-bold text-gold-600 sm:text-[10px]">للتطوير العقاري</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">${links}</nav>

        <a href="contact.html#consultation" class="btn btn-gold hidden lg:inline-flex">
          احجز استشارتك <i data-lucide="arrow-left" class="size-4"></i>
        </a>

        <button type="button" class="grid size-12 place-items-center rounded-xl border border-slate-300 bg-white text-ink-950 lg:hidden" data-menu-button aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobile-menu">
          <i data-lucide="menu" class="size-6" data-menu-icon></i>
        </button>
      </div>
    </header>

    <div id="mobile-menu" class="fixed inset-0 z-[60] hidden lg:hidden" data-mobile-menu aria-hidden="true">
      <button class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" data-menu-close aria-label="إغلاق القائمة"></button>
      <aside class="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] translate-x-full flex-col bg-ink-950 px-5 pb-6 pt-4 text-white transition-transform duration-300" data-menu-panel>
        <div class="mb-5 flex h-14 items-center justify-between border-b border-white/10 pb-4">
          <span class="text-sm font-black text-gold-300">القائمة الرئيسية</span>
          <button type="button" class="grid size-11 place-items-center rounded-xl bg-white/8" data-menu-close aria-label="إغلاق القائمة"><i data-lucide="x" class="size-6"></i></button>
        </div>
        <nav aria-label="التنقل على الهاتف">${mobileLinks}</nav>
        <div class="mt-auto grid gap-3 pt-6">
          <a href="contact.html#consultation" class="btn btn-gold w-full">احجز استشارة مجانية</a>
          <a href="https://wa.me/201030405054" target="_blank" rel="noopener" class="btn border border-white/15 bg-white/8 text-white" data-channel="whatsapp"><i data-lucide="message-circle" class="size-5"></i> واتساب</a>
        </div>
      </aside>
    </div>`;
}

function footerTemplate() {
  return `
    <footer class="bg-ink-950 pb-24 pt-14 text-white md:pb-8 lg:pt-20">
      <div class="site-container">
        <div class="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <div class="mb-5 flex items-center gap-3">
              <span class="grid size-12 place-items-center overflow-hidden rounded-xl bg-white"><img src="images/logo_engaz.png" alt="" class="size-full object-contain p-1"></span>
              <div><strong class="block text-xl font-black tracking-wider">ENGAZ</strong><span class="text-xs text-gold-300">للتطوير العقاري والمقاولات</span></div>
            </div>
            <p class="max-w-sm text-sm leading-7 text-slate-300">نطوّر مشروعات سكنية وتجارية بمعايير تنفيذ واضحة، ونبني علاقات طويلة المدى أساسها الثقة والالتزام.</p>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-black text-gold-300">استكشف</h2>
            <div class="grid gap-3 text-sm text-slate-300">
              <a href="projects.html" class="flex min-h-11 items-center hover:text-white">المشروعات الحالية</a><a href="portfolio.html" class="flex min-h-11 items-center hover:text-white">سابقة الأعمال</a><a href="about.html" class="flex min-h-11 items-center hover:text-white">عن إنجاز</a><a href="testimonials.html" class="flex min-h-11 items-center hover:text-white">آراء العملاء</a>
            </div>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-black text-gold-300">تواصل معنا</h2>
            <div class="grid gap-3 text-sm text-slate-300">
              <a href="tel:+201030405054" dir="ltr" class="flex min-h-11 w-fit items-center hover:text-white" data-channel="phone-egypt">+20 10 3040 5054</a>
              <a href="tel:+966503040505" dir="ltr" class="flex min-h-11 w-fit items-center hover:text-white" data-channel="phone-saudi">+966 50 304 0505</a>
              <a href="contact.html" class="flex min-h-11 items-center hover:text-white">الفروع ومواعيد التواصل</a>
            </div>
          </div>
          <div>
            <h2 class="mb-4 text-sm font-black text-gold-300">تابع إنجاز</h2>
            <div class="flex gap-2">
              <a class="grid size-11 place-items-center rounded-xl bg-white/8 hover:bg-white/15" href="https://www.facebook.com/Engazrealestate.eg/" target="_blank" rel="noopener" aria-label="فيسبوك" data-channel="facebook"><svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a class="grid size-11 place-items-center rounded-xl bg-white/8 hover:bg-white/15" href="https://www.instagram.com/engazdevelopments/" target="_blank" rel="noopener" aria-label="إنستجرام" data-channel="instagram"><svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              <a class="grid size-11 place-items-center rounded-xl bg-white/8 hover:bg-white/15" href="https://www.tiktok.com/@engazdevelopments" target="_blank" rel="noopener" aria-label="تيك توك" data-channel="tiktok"><svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.72-.02-.5-.03-1-.01-1.48.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
              <a class="grid size-11 place-items-center rounded-xl bg-white/8 hover:bg-white/15" href="https://www.linkedin.com/company/engaz-developments" target="_blank" rel="noopener" aria-label="لينكدإن" data-channel="linkedin"><svg class="size-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 إنجاز للتطوير العقاري. جميع الحقوق محفوظة.</p>
          <div class="flex gap-4"><a href="privacy.html" class="flex min-h-11 items-center hover:text-white">سياسة الخصوصية</a><a href="contact.html" class="flex min-h-11 items-center hover:text-white">الدعم والتواصل</a></div>
        </div>
      </div>
    </footer>

    <a href="https://wa.me/201030405054?text=${encodeURIComponent('مرحباً إنجاز، أريد معرفة تفاصيل المشروعات المتاحة')}" target="_blank" rel="noopener" class="fixed bottom-6 left-6 z-40 hidden size-14 place-items-center rounded-2xl bg-whatsapp text-white shadow-xl transition hover:-translate-y-1 md:grid" aria-label="تواصل عبر واتساب" data-channel="whatsapp"><i data-lucide="message-circle" class="size-7"></i></a>

    <nav class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-slate-200 bg-white/96 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(7,23,29,.08)] backdrop-blur-xl md:hidden" aria-label="إجراءات سريعة">
      <a href="projects.html" class="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-extrabold text-ink-950"><i data-lucide="building-2" class="size-5 text-gold-600"></i>المشروعات</a>
      <a href="https://wa.me/201030405054" target="_blank" rel="noopener" class="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-whatsapp text-[10px] font-extrabold text-white" data-channel="whatsapp"><i data-lucide="message-circle" class="size-5"></i>واتساب</a>
      <a href="contact.html#consultation" class="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-extrabold text-ink-950"><i data-lucide="calendar-days" class="size-5 text-gold-600"></i>استشارة</a>
    </nav>`;
}

function mountShell() {
  document.querySelectorAll('[data-site-header]').forEach((node) => { node.innerHTML = headerTemplate(); });
  document.querySelectorAll('[data-site-footer]').forEach((node) => { node.innerHTML = footerTemplate(); });
}

function initChannelTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-channel]');
    if (!link) return;
    const channel = link.dataset.channel;
    const details = { channel, page_path: window.location.pathname };
    if (typeof window.fbq === 'function') window.fbq('trackCustom', 'ContactChannelClick', details);
    if (typeof window.gtag === 'function') window.gtag('event', 'contact_channel_click', details);
  });
}

function initMenu() {
  const menu = document.querySelector('[data-mobile-menu]');
  const panel = document.querySelector('[data-menu-panel]');
  const trigger = document.querySelector('[data-menu-button]');
  if (!menu || !panel || !trigger) return;
  let lastFocused = null;

  const focusable = () => [...panel.querySelectorAll('a[href], button:not([disabled])')];

  const open = () => {
    lastFocused = document.activeElement;
    menu.classList.remove('hidden');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => {
      panel.classList.remove('translate-x-full');
      focusable()[0]?.focus();
    });
  };
  const close = () => {
    panel.classList.add('translate-x-full');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    window.setTimeout(() => { menu.classList.add('hidden'); menu.setAttribute('aria-hidden', 'true'); }, 250);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };
  trigger.addEventListener('click', open);
  menu.querySelectorAll('[data-menu-close]').forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') close();
    if (event.key !== 'Tab' || menu.getAttribute('aria-hidden') !== 'false') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function showToast(message, type = 'success') {
  const old = document.querySelector('[data-toast]');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.dataset.toast = '';
  toast.className = `toast fixed bottom-24 left-4 right-4 z-[80] mx-auto flex max-w-md items-start gap-3 rounded-2xl border p-4 text-sm font-bold shadow-2xl md:bottom-8 ${type === 'success' ? 'border-emerald-200 bg-white text-emerald-800' : 'border-red-200 bg-white text-red-700'}`;
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'circle-check' : 'x'}" class="mt-0.5 size-5 shrink-0"></i><span></span>`;
  toast.querySelector('span').textContent = message;
  document.body.appendChild(toast);
  createIcons({ icons });
  window.setTimeout(() => toast.remove(), 5000);
}

const budgets = {
  'under-1500000': [0, 1500000],
  '1500000-3000000': [1500000, 3000000],
  '3000000-5000000': [3000000, 5000000],
  'over-5000000': [5000000, null],
};

function initLeadForms() {
  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      const status = form.querySelector('[data-form-status]');
      const values = new FormData(form);
      const name = String(values.get('name') || '').trim();
      const phone = String(values.get('phone') || '').replace(/[\s()-]/g, '');
      const budget = budgets[values.get('budget')] || [null, null];

      const validPhone = /^(?:(?:\+?20|0)?1[0125]\d{8}|(?:\+?966|0)?5\d{8})$/.test(phone);
      if (name.length < 3 || !validPhone) {
        showToast('راجع الاسم ورقم الهاتف المصري أو السعودي ثم حاول مرة أخرى.', 'error');
        return;
      }

      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = '<i data-lucide="loader-circle" class="size-5 animate-spin"></i> جارٍ الإرسال';
      createIcons({ icons });
      if (status) status.textContent = '';

      const campaignContext = new URLSearchParams(window.location.search);
      const campaignNote = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
        .filter((key) => campaignContext.get(key))
        .map((key) => `${key}=${campaignContext.get(key)}`)
        .join(' | ');
      const payload = {
        name,
        phone,
        whatsapp: phone,
        source: 'Website',
        status: 'new',
        unit_type: values.get('unit_type') || null,
        budget_min: budget[0],
        budget_max: budget[1],
        notes: [values.get('notes') || `طلب استشارة من صفحة ${document.title}`, campaignNote, `referrer=${document.referrer || 'direct'}`].filter(Boolean).join(' | '),
      };

      try {
        const response = await fetch(`${API_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('تعذر حفظ الطلب');
        form.reset();
        if (status) status.textContent = 'تم استلام طلبك. سيتواصل معك مستشار إنجاز قريبًا.';
        showToast('تم إرسال طلبك بنجاح. سنتواصل معك قريبًا.');
        if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Website consultation' });
      } catch {
        if (status) status.textContent = 'تعذر الإرسال الآن. يمكنك التواصل معنا مباشرة عبر واتساب.';
        showToast('تعذر الإرسال الآن. تواصل معنا عبر واتساب وسنساعدك فورًا.', 'error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
        createIcons({ icons });
      }
    });
  });
}

function initFilters() {
  const filterRoot = document.querySelector('[data-project-filters]');
  if (!filterRoot) return;
  const buttons = [...filterRoot.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-project-card]')];
  const count = document.querySelector('[data-results-count]');
  const empty = document.querySelector('[data-filter-empty]');
  const search = document.querySelector('[data-project-search]');
  let active = 'all';

  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = active === 'all' || card.dataset.category?.split(' ').includes(active);
      const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
      const show = matchesCategory && matchesSearch;
      card.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} مشروع`;
    empty?.classList.toggle('hidden', visible !== 0);
  };

  buttons.forEach((button) => button.addEventListener('click', () => {
    active = button.dataset.filter;
    buttons.forEach((item) => item.classList.toggle('active', item === button));
    apply();
  }));
  search?.addEventListener('input', apply);
  apply();
}

const fallbackTestimonials = [];

function testimonialCard(item) {
  const card = document.createElement('article');
  card.className = 'surface-card flex h-full flex-col p-6 sm:p-7';
  const stars = Math.min(5, Math.max(1, Number(item.rating) || 5));
  card.innerHTML = `
    <div class="mb-5 flex items-center justify-between"><div class="flex gap-1 text-gold-500" data-stars></div><i data-lucide="quote" class="size-8 text-sand-100"></i></div>
    <p class="grow text-base leading-8 text-slate-700" data-comment></p>
    <div class="mt-6 border-t border-slate-100 pt-5"><strong class="block text-sm text-ink-950" data-name></strong><span class="mt-1 block text-xs text-slate-500" data-project></span></div>`;
  card.querySelector('[data-stars]').innerHTML = Array.from({ length: stars }, () => '<i data-lucide="star" class="size-4 fill-current"></i>').join('');
  card.querySelector('[data-comment]').textContent = `“${item.comment || item.content || ''}”`;
  card.querySelector('[data-name]').textContent = item.client_name || item.name || 'عميل إنجاز';
  card.querySelector('[data-project]').textContent = item.project_name || 'أحد مشروعات إنجاز';
  return card;
}

async function loadTestimonials() {
  const container = document.querySelector('[data-testimonials]');
  if (!container) return;
  let items = fallbackTestimonials;
  try {
    const response = await fetch(`${API_URL}/api/public/testimonials`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length) items = data;
    }
  } catch { /* Static fallback intentionally remains visible. */ }
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = `<div class="surface-card col-span-full px-6 py-12 text-center sm:px-10"><span class="icon-box mx-auto mb-4"><i data-lucide="badge-check" class="size-5"></i></span><h2 class="text-xl font-black text-ink-950">قريبًا: تجارب موثقة من عملائنا</h2><p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">نراجع كل تجربة قبل نشرها حفاظًا على الدقة والخصوصية. يمكنك الآن مشاهدة أعمالنا المنفذة أو التحدث مباشرة مع أحد مستشارينا.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href="portfolio.html" class="btn btn-primary">شاهد سابقة الأعمال</a><a href="contact.html#consultation" class="btn btn-secondary">تحدث مع مستشار</a></div></div>`;
    createIcons({ icons });
    container.setAttribute('aria-busy', 'false');
    return;
  }
  items.forEach((item) => container.appendChild(testimonialCard(item)));
  container.setAttribute('aria-busy', 'false');
  createIcons({ icons });
}

function initReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  elements.forEach((element) => observer.observe(element));
}

function initBeforeAfter() {
  document.querySelectorAll('[data-before-after]').forEach((root) => {
    const range = root.querySelector('input[type="range"]');
    const after = root.querySelector('[data-after]');
    const divider = root.querySelector('[data-divider]');
    if (!range || !after || !divider) return;
    const update = () => {
      const value = Number(range.value);
      after.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      divider.style.left = `${value}%`;
    };
    range.addEventListener('input', update);
    update();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mountShell();
  createIcons({ icons, attrs: { 'stroke-width': 1.8 } });
  initMenu();
  initChannelTracking();
  initLeadForms();
  initFilters();
  initReveals();
  initBeforeAfter();
  loadTestimonials();
});
