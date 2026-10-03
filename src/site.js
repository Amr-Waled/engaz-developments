import { headerTemplate, footerTemplate, socialLinksTemplate } from './shell.mjs';
import { campaignContext, campaignKeys } from './attribution.mjs';
import { createIcons, Menu, X, Search, LoaderCircle } from 'lucide';
import projects from './data/projects.json';

document.documentElement.classList.add('motion-ok');

const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:'
  ? 'http://localhost:5001'
  : 'https://api.engazdevelopments.com';

const icons = { Menu, X, Search, LoaderCircle };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function mountShell() {
  document.querySelectorAll('[data-site-header]').forEach((node) => { if (!node.firstElementChild) node.innerHTML = headerTemplate(window.location.pathname.split('/').pop() || 'index.html'); });
  document.querySelectorAll('[data-site-footer]').forEach((node) => { if (!node.firstElementChild) node.innerHTML = footerTemplate(document.body.dataset.projectName, projects); });
  document.querySelectorAll('[data-social-links]').forEach((node) => {
    if (!node.firstElementChild) node.innerHTML = socialLinksTemplate(node.dataset.socialLinks === 'all');
  });
}

function initChannelTracking() {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('[data-channel]');
    if (!link) return;
    const channel = link.dataset.channel;
    const details = { channel, page_path: window.location.pathname, project: document.body.dataset.currentProject || null };
    if (typeof window.fbq === 'function') window.fbq('trackCustom', 'ContactChannelClick', details);
    if (['whatsapp', 'phone-egypt', 'phone-saudi'].includes(channel) && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', { content_name: channel, content_category: 'contact_intent', project: details.project });
    }
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

function initLeadModal() {
  const modal = document.querySelector('[data-lead-modal]');
  const panel = modal?.querySelector('[data-lead-modal-panel]');
  const openers = [...document.querySelectorAll('[data-lead-modal-open]')];
  if (!modal || !panel || !openers.length) return;
  let lastFocused = null;
  let closeTimer = null;

  const focusable = () => [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), summary')].filter((element) => element.getClientRects().length > 0);
  const open = (event) => {
    event?.preventDefault();
    const slug = event?.currentTarget?.dataset.projectInterest || document.body.dataset.currentProject;
    const select = panel.querySelector('select[name="project_interest"]');
    const option = slug ? [...select.options].find((item) => item.dataset.slug === slug) : select.selectedOptions[0];
    if (option) option.selected = true;
    const context = panel.querySelector('[data-lead-context]');
    if (context) context.textContent = option?.dataset.projectName ? `استفسارك عن مشروع ${option.dataset.projectName}` : '';
    if (closeTimer) window.clearTimeout(closeTimer);
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => {
      panel.classList.remove('translate-y-6', 'opacity-0', 'sm:-translate-y-[46%]');
      panel.classList.add('sm:-translate-y-1/2');
      panel.querySelector('input[name="name"]')?.focus();
    });
  };
  const close = () => {
    panel.classList.add('translate-y-6', 'opacity-0', 'sm:-translate-y-[46%]');
    panel.classList.remove('sm:-translate-y-1/2');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    closeTimer = window.setTimeout(() => modal.classList.add('hidden'), 280);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  openers.forEach((button) => button.addEventListener('click', open));
  modal.querySelectorAll('[data-lead-modal-close]').forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (modal.getAttribute('aria-hidden') !== 'false') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
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
  toast.innerHTML = `<span></span>`;
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

function cookieValue(name) {
  const prefix = `${name}=`;
  const item = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
}

function initProjectSelection() {
  const project = document.body.dataset.currentProject || new URLSearchParams(window.location.search).get('project');
  if (!project) return;
  document.querySelectorAll('select[name="project_interest"]').forEach((select) => {
    const option = [...select.options].find((item) => item.dataset.slug === project);
    if (option) option.selected = true;
  });
}

function initCampaignLinks() {
  const query = campaignContext().query;
  const campaign = campaignKeys.filter((key) => query.has(key)).map((key) => [key, query.get(key)]);
  if (!campaign.length) return;
  document.querySelectorAll('a[href]').forEach((link) => {
    const url = new URL(link.getAttribute('href'), window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;
    campaign.forEach(([key, value]) => { if (!url.searchParams.has(key)) url.searchParams.set(key, value); });
    link.href = url.href;
  });
  document.querySelectorAll('form.project-finder').forEach((form) => {
    campaign.forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = key; input.value = value;
      form.appendChild(input);
    });
  });
}

function initFinder() {
  const form = document.querySelector('.project-finder');
  if (!form) return;
  const location = form.querySelector('[name="location"]');
  const type = form.querySelector('[name="type"]');
  const update = () => {
    const available = new Set(projects.filter((project) => location.value === 'all' || project.location === location.value).flatMap((project) => project.categories));
    [...type.options].forEach((option) => { option.disabled = option.value !== 'all' && !available.has(option.value); });
    if (type.selectedOptions[0]?.disabled) type.value = 'all';
  };
  location.addEventListener('change', update);
  update();
}

function initLeadForms() {
  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.dataset.submitting === 'true') return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      const status = form.querySelector('[data-form-status]');
      const values = new FormData(form);
      const name = String(values.get('name') || '').trim();
      const phone = String(values.get('phone') || '').replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit <= '٩' ? 1632 : 1776))).replace(/[\s()-]/g, '');
      const email = String(values.get('email') || '').trim();
      const budget = budgets[values.get('budget')] || [null, null];
      const projectSelect = form.querySelector('select[name="project_interest"]');
      const projectOption = projectSelect?.selectedOptions?.[0];
      const projectInterest = Number.parseInt(String(values.get('project_interest') || ''), 10);
      const projectName = projectOption?.dataset.projectName || '';

      const validPhone = /^(?:(?:\+?20|0)?1[0125]\d{8}|(?:\+?966|0)?5\d{8})$/.test(phone);
      if (name.length < 3 || !validPhone) {
        if (status) status.textContent = 'راجع الاسم ورقم الهاتف المصري أو السعودي ثم حاول مرة أخرى.';
        showToast('راجع الاسم ورقم الهاتف المصري أو السعودي ثم حاول مرة أخرى.', 'error');
        return;
      }

      const original = submit.innerHTML;
      form.dataset.submitting = 'true';
      submit.disabled = true;
      submit.innerHTML = '<i data-lucide="loader-circle" class="size-5 animate-spin"></i> جارٍ الإرسال';
      createIcons({ icons });
      if (status) status.textContent = '';

      const attribution = campaignContext();
      const campaignQuery = attribution.query;
      const fbclid = campaignQuery.get('fbclid') || '';
      const fbc = cookieValue('_fbc') || (fbclid ? `fb.1.${attribution.clickTimestamp}.${fbclid}` : '');
      const campaignNote = campaignKeys.filter((key) => key !== 'fbclid')
        .filter((key) => campaignQuery.get(key))
        .map((key) => `${key}=${campaignQuery.get(key)}`)
        .join(' | ');
      const payload = {
        name,
        phone,
        whatsapp: phone,
        email: email || null,
        source: values.get('source') || 'Website',
        status: 'new',
        unit_type: values.get('unit_type') || null,
        budget_min: budget[0],
        budget_max: budget[1],
        project_interest: Number.isInteger(projectInterest) ? projectInterest : null,
        campaign: campaignQuery.get('utm_campaign') || null,
        campaign_name: campaignQuery.get('utm_campaign') || null,
        campaign_id: campaignQuery.get('campaign_id') || null,
        adset_id: campaignQuery.get('adset_id') || null,
        ad_id: campaignQuery.get('ad_id') || null,
        adset_name: campaignQuery.get('adset_name') || null,
        ad_name: campaignQuery.get('ad_name') || null,
        platform: campaignQuery.get('utm_source') || 'Website',
        fbp: cookieValue('_fbp') || null,
        fbc: fbc || null,
        fbclid: fbclid || null,
        utm_source: campaignQuery.get('utm_source') || null,
        utm_medium: campaignQuery.get('utm_medium') || null,
        utm_campaign: campaignQuery.get('utm_campaign') || null,
        utm_content: campaignQuery.get('utm_content') || null,
        landing_page: attribution.landingPage,
        referrer_url: attribution.referrer || null,
        notes: [projectName ? `المشروع المطلوب: ${projectName}` : '', values.get('notes') || `طلب استشارة من صفحة ${document.title}`, campaignNote, `referrer=${document.referrer || 'direct'}`].filter(Boolean).join(' | '),
      };

      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 20000);
        let response;
        try {
        response = await fetch(`${API_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        } finally { window.clearTimeout(timeout); }
        if (!response.ok) throw new Error('تعذر حفظ الطلب');
        const savedLead = await response.json();
        if (!savedLead || (savedLead.success !== true && !savedLead.id)) throw new Error('لم يتم تأكيد حفظ الطلب');
        form.reset();
        initProjectSelection();
        if (status) status.textContent = 'تم استلام طلبك. سيتواصل معك مستشار إنجاز قريبًا.';
        showToast('تم إرسال طلبك بنجاح. سنتواصل معك قريبًا.');
        if (window.fbq && savedLead.id && !savedLead.duplicate) {
          window.fbq('track', 'Lead', { content_name: projectName || 'Website consultation', content_category: values.get('unit_type') || 'property_enquiry' }, { eventID: `lead:${savedLead.id}:new:0` });
        } else if (window.fbq && savedLead.duplicate) {
          window.fbq('trackCustom', 'RepeatInquiry', { content_name: projectName || 'Website consultation' });
        }
      } catch {
        if (status) status.textContent = 'تعذر الإرسال الآن. يمكنك التواصل معنا مباشرة عبر واتساب.';
        showToast('تعذر الإرسال الآن. تواصل معنا عبر واتساب وسنساعدك فورًا.', 'error');
      } finally {
        delete form.dataset.submitting;
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
  const categorySelect = filterRoot.querySelector('[data-category-select]');
  const stageSelect = filterRoot.querySelector('[data-stage-select]');
  const locationButtons = [...filterRoot.querySelectorAll('[data-location-filter]')];
  const cards = [...document.querySelectorAll('[data-project-card]')];
  const count = document.querySelector('[data-results-count]');
  const empty = document.querySelector('[data-filter-empty]');
  const search = document.querySelector('[data-project-search]');
  let activeCategory = 'all';
  let activeLocation = 'all';
  let activeStage = 'all';
  const requested = new URLSearchParams(window.location.search);
  const requestedCategory = requested.get('type');
  const requestedLocation = requested.get('location');
  if ([...categorySelect.options].some((option) => option.value === requestedCategory)) activeCategory = requestedCategory;
  const requestedStage = requested.get('stage');
  if ([...stageSelect.options].some((option) => option.value === requestedStage)) activeStage = requestedStage;
  if (requestedCategory === 'completed') activeStage = 'delivered';
  if (locationButtons.some((button) => button.dataset.locationFilter === requestedLocation)) activeLocation = requestedLocation;
  if (search) search.value = requested.get('q') || '';

  const syncControls = () => {
    categorySelect.value = activeCategory;
    stageSelect.value = activeStage;
    locationButtons.forEach((item) => {
      const isActive = item.dataset.locationFilter === activeLocation;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
  };

  const syncUrl = () => {
    if (window.location.protocol === 'file:') return;
    const params = new URLSearchParams(window.location.search);
    if (activeCategory === 'all') params.delete('type'); else params.set('type', activeCategory);
    if (activeLocation === 'all') params.delete('location'); else params.set('location', activeLocation);
    if (activeStage === 'all') params.delete('stage'); else params.set('stage', activeStage);
    if (search?.value.trim()) params.set('q', search.value.trim()); else params.delete('q');
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  };

  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category?.split(' ').includes(activeCategory);
      const matchesLocation = activeLocation === 'all' || card.dataset.location === activeLocation;
      const matchesStage = activeStage === 'all' || card.dataset.stage === activeStage;
      const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
      const show = matchesCategory && matchesLocation && matchesStage && matchesSearch;
      card.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });
    if (count) {
      count.textContent = visible === 1 ? 'مشروع واحد' : visible === 2 ? 'مشروعان' : visible >= 3 && visible <= 10 ? `${visible} مشروعات` : `${visible} مشروع`;
    }
    empty?.classList.toggle('hidden', visible !== 0);
    const filtered = activeCategory !== 'all' || activeLocation !== 'all' || activeStage !== 'all' || Boolean(query);
    filterRoot.querySelector('.listing-results [data-filter-reset]')?.classList.toggle('invisible', !filtered);
  };

  categorySelect.addEventListener('change', () => {
    activeCategory = categorySelect.value;
    syncControls();
    syncUrl();
    apply();
  });
  stageSelect.addEventListener('change', () => {
    activeStage = stageSelect.value;
    syncControls();
    syncUrl();
    apply();
  });
  locationButtons.forEach((button) => button.addEventListener('click', () => {
    activeLocation = button.dataset.locationFilter;
    syncControls();
    syncUrl();
    apply();
  }));
  search?.addEventListener('input', () => { syncUrl(); apply(); });
  filterRoot.querySelectorAll('[data-filter-reset]').forEach((button) => button.addEventListener('click', () => {
    activeCategory = activeLocation = activeStage = 'all';
    if (search) search.value = '';
    syncControls(); syncUrl(); apply();
  }));
  syncControls();
  apply();
}

const fallbackTestimonials = [];

function testimonialCard(item) {
  const card = document.createElement('article');
  card.className = 'surface-card flex h-full flex-col p-6 sm:p-7';
  const stars = Math.min(5, Math.max(1, Number(item.rating) || 5));
  card.innerHTML = `
    <div class="mb-5 flex items-center justify-between"><div class="flex gap-1 text-gold-500" data-stars></div></div>
    <p class="grow text-base leading-8 text-slate-700" data-comment></p>
    <div class="mt-6 border-t border-slate-100 pt-5"><strong class="block text-sm text-ink-950" data-name></strong><span class="mt-1 block text-xs text-slate-500" data-project></span></div>`;
  card.querySelector('[data-stars]').innerHTML = Array.from({ length: stars }, () => '').join('');
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
    container.innerHTML = `<div class="surface-card col-span-full px-6 py-12 text-center sm:px-10"><h2 class="text-xl font-semibold text-ink-950">قريبًا: تجارب موثقة من عملائنا</h2><p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">نراجع كل تجربة قبل نشرها حفاظًا على الدقة والخصوصية. يمكنك الآن مشاهدة أعمالنا المنفذة أو التحدث مباشرة مع أحد مستشارينا.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href="portfolio.html" class="btn btn-primary">شاهد سابقة الأعمال</a><a href="contact.html#consultation" class="btn btn-secondary">تحدث مع مستشار</a></div></div>`;
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

document.addEventListener('DOMContentLoaded', () => {
  mountShell();
  createIcons({ icons, attrs: { 'stroke-width': 1.8 } });
  initMenu();
  initLeadModal();
  initChannelTracking();
  initProjectSelection();
  initCampaignLinks();
  initFinder();
  initLeadForms();
  initFilters();
  initReveals();
  loadTestimonials();
});
