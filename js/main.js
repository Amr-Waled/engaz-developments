// --- 1. Configuration & API URL ---
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5001'
    : 'https://api.engazdevelopments.com';

// --- Active Navigation Link highlighting ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// --- 3. Hero Carousel Slider ---
if (document.querySelector('.hero-slide')) {
    let currentSlideIdx = 0;
    const slides = document.querySelectorAll('.hero-slide');
    
    function rotateSlides() {
        slides[currentSlideIdx].classList.remove('active');
        currentSlideIdx = (currentSlideIdx + 1) % slides.length;
        slides[currentSlideIdx].classList.add('active');
    }
    setInterval(rotateSlides, 4500);
}

// --- 4. Fallback Data ---
const FALLBACK_PROJECTS = [
    { name: 'مول طنطا تاون (تجاري وإداري وطبي)', location: 'طنطا (شارع الجيش)', image: 'images/tanta-town-mall-hd.jpg', status: 'active', developer: 'Engaz Developments', desc: 'أيقونة تجارية وإدارية وطبية بقلب مدينة طنطا بوسط الدلتا، يضم محلات تجارية وعيادات طبية ومكاتب وشقق بفرص استثمار استثنائية.', specs: ['تكييف مركزي متطور', 'بوابات أمنية وإدارة متكاملة', 'مساحات مرنة للمطاعم والكافيهات', 'مصعد مخصص للعيادات الطبية'], payment: 'مقدم 20% وتسهيلات في السداد على أقساط متساوية تصل إلى 5 سنوات.' },
    { name: 'مول صيدناوي بسيون (تجاري وإداري وطبي وسكني)', location: 'بسيون (الغربية)', image: 'images/sednawy-mall-hd.jpg', status: 'active', developer: 'Engaz Developments', desc: 'المول التجاري والإداري والسكني الأهم بقلب مدينة بسيون بوسط الدلتا، يضم محلات تجارية وعيادات طبية ومكاتب وشقق بفرص استثمار استثنائية.', specs: ['تكييف مركزي متطور', 'بوابات أمنية وإدارة متكاملة', 'مساحات مرنة للمطاعم والكافيهات', 'مصعد مخصص للعيادات الطبية'], payment: 'مقدم 40% دفعة أولى وتسهيلات في السداد للمتبقي على أقساط متساوية.' },
    { name: 'مشروع H165 - النورس هاوس (جاري التشطيب)', location: 'ربوة التجمع (القاهرة الجديدة)', image: 'images/h165.jpg', status: 'active', developer: 'Engaz Developments', desc: 'عمارة سكنية راقية بمشروع النورس هاوس بربوة التجمع الخامس، في مرحلة التشطيبات النهائية للواجهات والمداخل.', specs: ['مرحلة الإنشاء: جاري التشطيب والواجهات', 'تشطيب واجهات فاخرة', 'مداخل رخام ومصاعد حديثة', 'تقسيمات داخلية ممتازة'], payment: 'تقسيط ميسر بمقدم حجز يبدأ من 25% على 5 سنوات.' },
    { name: 'مشروع H79 - بيت الوطن (أعمال الحفر والأساسات)', location: 'الحي الرابع - بيت الوطن (التجمع)', image: 'images/beit-al-watan-project-engaz-developments.jpg', status: 'active', developer: 'Engaz Developments', desc: 'مشروع سكني متميز ببيت الوطن الحي الرابع، جاري تنفيذ أعمال الحفر والأساسات الهندسية.', specs: ['مرحلة الإنشاء: أعمال الحفر والأساسات', 'موقع استراتيجي بالحي الرابع', 'إطلالة متميزة ومساحات متنوعة', 'جراجات ومخازن خاصة'], payment: 'مقدم 20% وتقسيط حتى 5 سنوات بدون فوائد.' },
    { name: 'مشروع F216 - بيت الوطن (هيكل خرساني)', location: 'الحي الرابع - بيت الوطن (التجمع)', image: 'images/beit_alwatan.jpg', status: 'active', developer: 'Engaz Developments', desc: 'وحدات سكنية فاخرة ببيت الوطن التجمع الخامس، جاري صب وتنفيذ الهيكل الخرساني بالكامل.', specs: ['مرحلة الإنشاء: تنفيذ الهيكل الخرساني', 'واجهات معمارية فاخرة', 'موقع متميز بالحي الرابع', 'تقسيمات هندسية استغلالية ممتاز'], payment: 'مقدم 25% وتقسيط ميسر على 5 سنوات.' },
    { name: 'مشروع F218 - بيت الوطن (هيكل خرساني)', location: 'الحي الرابع - بيت الوطن (التجمع)', image: 'images/beit_alwatan.jpg', status: 'active', developer: 'Engaz Developments', desc: 'مشروع عمارة سكنية راقية ببيت الوطن التجمع الخامس، جاري تنفيذ وصيانة الهيكل الخرساني للمبنى.', specs: ['مرحلة الإنشاء: تنفيذ الهيكل الخرساني', 'تصميم عصري جذاب', 'تأمين وكاميرات مراقبة', 'مداخل فندقية'], payment: 'مقدم 25% وتقسيط على 5 سنوات بأقساط متساوية.' },
    { name: 'مشروع F129 - بيت الوطن (اكتمال المبنى)', location: 'الحي الرابع - بيت الوطن (التجمع)', image: 'images/watan-real.jpg', status: 'active', developer: 'Engaz Developments', desc: 'مشروع سكني مميز ببيت الوطن التجمع الخامس، تم اكتمال الهيكل الإنشائي وجاري التشطيب الخارجي.', specs: ['مرحلة الإنشاء: اكتمال المبنى وجاري التشطيب', 'تشطيبات خارجية فاخرة', 'مصاعد مستوردة عالية الجودة', 'موقع حيوي متكامل'], payment: 'مقدم 30% وتقسيط حتى 4 سنوات.' },
    { name: 'مشروع A100 - النورث هاوس (الدور الأول)', location: 'منطقة النورث هاوس (القاهرة الجديدة)', image: 'images/beit-al-watan-project-engaz-developments.jpg', status: 'active', developer: 'Engaz Developments', desc: 'مشروع سكني راقي بمنطقة النورث هاوس، تم الانتهاء من الأساسات وجاري تنفيذ سقف الدور الأول.', specs: ['مرحلة الإنشاء: جاري تنفيذ الدور الأول', 'موقع شمالي متميز بالنورث هاوس', 'تصميمات هندسية عصرية', 'مواقف سيارات خاصة'], payment: 'مقدم 20% وتقسيط ميسر يصل إلى 6 سنوات.' },
    { name: 'مشروع C87 - بيت الوطن (اكتمال الهيكل)', location: 'الحي الرابع - بيت الوطن (التجمع)', image: 'images/watan-real.jpg', status: 'active', developer: 'Engaz Developments', desc: 'عمارة سكنية فاخرة ببيت الوطن التجمع الخامس، تم اكتمال الهيكل الإنشائي الخرساني بالكامل.', specs: ['مرحلة الإنشاء: اكتمال الهيكل الخرساني بالكامل', 'واجهات كلاسيكية مودرن', 'مباشرة على شوارع رئيسية', 'مساحات متنوعة 180m-220m'], payment: 'مقدم 30% تقسيط حتى 5 سنوات.' },
    { name: 'مشروع H151 - ربوة التجمع (تم التسليم بالكامل)', location: 'ربوة التجمع (القاهرة الجديدة)', image: 'images/h151-real-hd.jpg', status: 'completed', developer: 'Engaz Developments', desc: 'عمارة سكنية فاخرة تم بناؤها وتسليمها بالكامل للملاك بربوة التجمع الخامس بواجهات حجرية ومداخل رخام.', specs: ['مرحلة المشروع: تم التسليم والبيع بالكامل 100%', 'واجهات حجرية فاخرة', 'مداخل رخام فندقية', 'مصاعد مستوردة تعمل بكفاءة'], payment: 'تم التسليم والبيع بالكامل للملاك بنسبة 100% (مباع بالكامل).' },
    { name: 'فلل المنصورة الجديدة الساحلية (مباع 100%)', location: 'المنصورة الجديدة', image: 'images/mansoura-villas-opt.jpg', status: 'completed', developer: 'Engaz Developments', desc: 'مجموعة فلل سكنية ساحلية فاخرة على ساحل البحر الأبيض المتوسط بالمنصورة الجديدة، تم بناؤها وتنسيق حدائقها وتسليمها وبيعه بالكامل للملاك بنسبة 100%.', specs: ['تشطيب خارجي بالكامل وتنسيق حدائق', 'موقع ممتاز على ساحل البحر المتوسط', 'تصميمات معمارية فاخرة', 'تم التسليم والبيع بالكامل للملاك'], payment: 'تم التسليم والبيع بالكامل للملاك بنسبة 100% (مباع بالكامل).' },
    { name: 'برج الفيروز (تجاري وإداري فقط - مباع 100%)', location: 'تلا (المنوفية)', image: 'images/fayrouz-tower-opt.jpg', status: 'completed', developer: 'Engaz Developments', desc: 'صرح تجاري وإداري بالكامل يضم محلات تجارية ومكاتب إدارية بمدينة تلا تم بناؤه وتسليمه وبيعه بالكامل للملاك بنسبة 100% (بدون أي وحدات سكنية).', specs: ['مداخل إدارية وتجارية فندقية', 'مصاعد إيطالية سريعة وآمنة', 'حراسة وأمن على مدار الساعة', 'واجهات كلاسيكية فاخرة'], payment: 'تم التسليم والبيع بالكامل للملاك بنسبة 100% (مباع بالكامل).' },
    { name: 'برج النادي & الكورنيش (قيد التخطيط والطرح)', location: 'بسيون (بجوار النادي والكورنيش)', image: 'images/teachers-syndicate-night.jpg', status: 'planned', developer: 'Engaz Developments', desc: 'مشروعات أبراج إدارية وتجارية جديدة قيد التخطيط والهندسة في مواقع استراتيجية حيوية للغاية.', specs: ['موقع متميز بجوار الخدمات والنادي', 'تصميمات هندسية ألترا مودرن', 'مواقف سيارات ومصاعد حديثة', 'إطلالات مفتوحة واسعة'], payment: 'طرح قريباً بنظام حجز الأولوية والتخصيص المباشر.' }
];

const FALLBACK_TESTIMONIALS = [
    { client_name: 'أحمد محمود العشري', project_name: 'برج الفيروز (تلا)', rating: 5, comment: 'شراء شقة من إنجاز كان أفضل قرار استثماري اتخذته. التزام تام بموعد التسليم وتشطيبات فاخرة تفوق التوقعات.' },
    { client_name: 'د. سارة عبدالحميد', project_name: 'مول طنطا تاون', rating: 5, comment: 'تعاقدت على عيادة طبية بمول طنطا تاون، المشروع ناجح جداً والمبيعات والتسويق ساعدوني بكافة التفاصيل التمويلية والقانونية.' },
    { client_name: 'المهندس كريم السعدني', project_name: 'ربوة التجمع (القاهرة)', rating: 5, comment: 'مصداقية متناهية وأمان قانوني كامل. تعاقدت على شقة بالرياض عبر فرع الياسمين وكانت الإجراءات بمنتهى السلاسة والسرعة.' }
];

let activeProjects = [];

// --- 5. Projects Loading & Rendering ---
async function fetchProjects() {
    try {
        const res = await fetch(`${API_URL}/api/public/projects`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (data && data.length > 0) {
            console.log('Projects loaded from Server database.');
            return data.map(p => ({
                id: p.id,
                name: p.name,
                location: p.location || 'غير محدد',
                image: p.image || '',
                status: p.status || 'active',
                developer: p.developer || 'Engaz Developments',
                desc: p.description || 'لم يتم إضافة وصف للمشروع بعد.',
                specs: p.specs ? p.specs.split(',').map(s => s.trim()) : ['موقع جغرافي استراتيجي متميز للغاية.', 'واجهات معمارية فاخرة مقاومة للعوامل الجوية.', 'مداخل فندقية فخمة من الرخام والجرانيت.', 'مصاعد كهربائية إيطالية متطورة.'],
                payment: p.payment_plan || 'أنظمة سداد مرنة تبدأ بمقدم 20% وأقساط متساوية تصل إلى 5 سنوات.',
                brochure_url: p.brochure_url || ''
            }));
        }
    } catch (e) {
        console.warn('API Server offline, loading fallback local projects.', e);
    }
    return FALLBACK_PROJECTS.map((p, idx) => ({ ...p, id: idx + 100 }));
}

function renderProjects(list) {
    const grid = document.getElementById('dynamicProjectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (list.length === 0) {
        grid.innerHTML = '<div style="grid-column: span 3; text-align: center; padding: 3rem; color: var(--text-secondary);">لا توجد مشاريع مطابقة لخيارات البحث.</div>';
        return;
    }

    list.forEach((p, idx) => {
        const isSoldOut = p.status === 'completed';
        const isPlanned = p.status === 'planned';
        
        const badgeText = isSoldOut ? 'تم البيع بالكامل (مباع 100%)' :
                          isPlanned ? 'قيد التخطيط والطرح المستقبلي' : 'متاح للحجز المباشر';

        const badgeStyle = isSoldOut ? 'style="background: rgba(239, 68, 68, 0.95) !important; color: #ffffff !important; border: 1px solid #dc2626 !important; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4) !important;"' : '';

        const imgUrl = p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

        const card = document.createElement('article');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="${imgUrl}" alt="${p.name}" class="project-card-img" onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';">
                <span class="project-status-badge" ${badgeStyle}>${badgeText}</span>
            </div>
            <div class="project-info">
                <span class="project-code">${p.developer}</span>
                <h4 class="project-name">${p.name}</h4>
                <p class="project-desc">${p.desc}</p>
                <div class="project-card-footer">
                    <span class="project-location"><i class="fa-solid fa-location-dot"></i> ${p.location.split('(')[0].trim()}</span>
                    <button class="btn-detail" onclick="openProjectModal(${idx})">تفاصيل المشروع <i class="fa-solid fa-chevron-left"></i></button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 6. Smart Search Filters ---
function filterProjects() {
    const searchInput = document.getElementById('filter-search');
    const cityInput = document.getElementById('filter-city');
    const statusInput = document.getElementById('filter-status');
    
    if (!searchInput || !cityInput || !statusInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const city = cityInput.value;
    const status = statusInput.value;

    const filtered = activeProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
        const matchesCity = city === 'all' || p.location.includes(city);
        const matchesStatus = status === 'all' || p.status === status;
        return matchesSearch && matchesCity && matchesStatus;
    });
    renderProjects(filtered);
}

// --- 7. Project Detail Modal ---
window.switchModalTab = function(tabName) {
    document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));

    const clickedBtn = document.querySelector(`.modal-tab-btn[onclick*="${tabName}"]`);
    if (clickedBtn) clickedBtn.classList.add('active');

    const activeContent = document.getElementById(`tab-${tabName}`);
    if (activeContent) activeContent.classList.add('active');
};

function getProjectVal(projName) {
    if (projName.includes('ربوة') || projName.includes('التجمع')) return '1';
    if (projName.includes('صيدناوي') || projName.includes('مول')) return '2';
    if (projName.includes('المعلمين') || projName.includes('برج')) return '3';
    return '4';
}

window.openProjectModal = async function(idx) {
    const modal = document.getElementById('projectDetailsModal');
    if (!modal) return;
    
    const p = activeProjects[idx];
    if (!p) return;

    if (window.fbq) {
        fbq('track', 'ViewContent', {
            content_name: p.name,
            content_category: 'Real Estate Project',
            content_ids: [p.id || idx]
        });
    }

    document.getElementById('modalProjectTitle').innerText = p.name;
    document.getElementById('modalProjectSubtitle').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${p.location} | <i class="fa-solid fa-building"></i> ${p.developer}`;
    document.getElementById('modalProjectDesc').innerText = p.desc;
    document.getElementById('modalProjectImg').src = p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';
    
    document.getElementById('modalMetaLocation').innerText = p.location;
    
    const modalStatusEl = document.getElementById('modalMetaStatus');
    const modalBookingEl = document.getElementById('modalMetaBooking');
    const registerBtn = document.getElementById('btnModalRegisterInterest');

    if (p.status === 'completed') {
        modalStatusEl.innerHTML = '<span style="color: #ef4444; font-weight: 800;">تم البيع والتسليم بالكامل للملاك 100%</span>';
        if (modalBookingEl) {
            modalBookingEl.innerText = 'غير متوفرة (مباع بالكامل)';
            modalBookingEl.style.color = '#ef4444';
        }
        if (registerBtn) {
            registerBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
            registerBtn.style.color = '#ffffff';
            registerBtn.innerHTML = 'الوحدات مباعة بالكامل 100% (استفسر عن الـ Resale)';
        }
    } else if (p.status === 'planned') {
        modalStatusEl.innerHTML = '<span style="color: #3b82f6; font-weight: 800;">قيد التخطيط والطرح المستقبلي المستقبلي</span>';
        if (modalBookingEl) {
            modalBookingEl.innerText = 'حجز الأولوية قريباً';
            modalBookingEl.style.color = '#3b82f6';
        }
        if (registerBtn) {
            registerBtn.style.background = 'var(--gold-gradient)';
            registerBtn.style.color = '#000000';
            registerBtn.innerHTML = 'تسجيل الأولوية قبل الطرح المباشر';
        }
    } else {
        modalStatusEl.innerHTML = '<span style="color: #10b981; font-weight: 800;">متاح للحجز المباشر</span>';
        if (modalBookingEl) {
            modalBookingEl.innerText = 'متوفرة الآن';
            modalBookingEl.style.color = '#10b981';
        }
        if (registerBtn) {
            registerBtn.style.background = 'var(--gold-gradient)';
            registerBtn.style.color = '#000000';
            registerBtn.innerHTML = 'طلب عرض سعر / حجز الوحدة';
        }
    }
    
    const specsList = document.getElementById('modalProjectSpecsList');
    specsList.innerHTML = '';
    const specs = p.specs || ['موقع جغرافي متميز جداً وثمين.', 'مداخل فاخرة رخام بالكامل.', 'مصاعد كهربائية حديثة وعالية الأمان.'];
    specs.forEach(s => {
        specsList.innerHTML += `<li>${s}</li>`;
    });

    document.getElementById('modalPaymentPlanText').innerText = p.payment || 'خطط سداد وتسهيلات مرنة تبدأ بمقدم 20% والتقسيط للمتبقي على 5 سنوات.';

    const progressContainer = document.getElementById('modalProjectProgressList');
    progressContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">جاري تحميل تحديثات الإنشاءات من الموقع...</p>';
    
    try {
        if (p.id) {
            const progressRes = await fetch(`${API_URL}/api/public/projects/${p.id}/progress`);
            const progressData = await progressRes.json();
            
            if (progressData && progressData.length > 0) {
                progressContainer.innerHTML = '';
                progressData.forEach(item => {
                    let imgHtml = '';
                    if (item.image) {
                        imgHtml = `<img src="${item.image}" alt="${item.stage}" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; margin-top: 10px;">`;
                    }
                    progressContainer.innerHTML += `
                        <div class="progress-log-card">
                            <div class="progress-log-header">
                                <span class="progress-log-title">${item.stage}</span>
                                <span class="progress-log-percentage">${item.percentage}% مكتمل</span>
                            </div>
                            <div class="progress-log-bar-bg">
                                <div class="progress-log-bar-fill" style="width: ${item.percentage}%;"></div>
                            </div>
                            ${item.notes ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin: 5px 0 0 0;">${item.notes}</p>` : ''}
                            ${imgHtml}
                        </div>
                    `;
                });
            } else {
                progressContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">أعمال الأساسات والتخطيط المبدئي قيد التشغيل والترخيص.</p>';
            }
        } else {
            progressContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">أعمال الأساسات والتخطيط المبدئي قيد التشغيل والترخيص.</p>';
        }
    } catch (err) {
        progressContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">أعمال الأساسات والتخطيط المبدئي قيد التشغيل والترخيص.</p>';
    }

    const brochureBtn = document.getElementById('btnModalDownloadBrochure');
    if (p.brochure_url) {
        brochureBtn.style.display = 'block';
        brochureBtn.onclick = function() {
            document.getElementById('brochure_project_id').value = p.id || '';
            document.getElementById('brochure_project_name').value = p.name;
            document.getElementById('brochure_pdf_url').value = p.brochure_url;
            
            document.getElementById('brochureDownloadModal').style.display = 'flex';
        };
    } else {
        brochureBtn.style.display = 'none';
    }

    switchModalTab('desc');

    if(registerBtn) {
        registerBtn.onclick = function() {
            modal.style.display = 'none';
            
            const btnProjectCard = document.querySelector(`.segmented-grid .seg-card[onclick*="project"][onclick*="'${getProjectVal(p.name)}'"]`);
            if (btnProjectCard) {
                btnProjectCard.click();
            }
            
            const registerEl = document.getElementById('register-interest');
            if (registerEl) registerEl.scrollIntoView({ behavior: 'smooth' });
        };
    }

    modal.style.display = 'flex';
};

// --- 8. Brochure Download Modal ---
const btnCloseBrochureModal = document.getElementById('btnCloseBrochureModal');
if (btnCloseBrochureModal) {
    btnCloseBrochureModal.addEventListener('click', () => {
        document.getElementById('brochureDownloadModal').style.display = 'none';
    });
}

const brochureForm = document.getElementById('brochureLeadForm');
if (brochureForm) {
    brochureForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('btnSubmitBrochureForm');
        const statusMessage = document.getElementById('brochureStatusMessage');
        
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال طلبك والتحميل...';
        
        statusMessage.style.display = 'none';
        statusMessage.style.background = 'none';
        statusMessage.style.color = '#fff';

        const name = document.getElementById('brochure_name').value.trim();
        const phone = document.getElementById('brochure_phone').value.trim();
        const whatsapp = document.getElementById('brochure_whatsapp').value.trim();
        const projName = document.getElementById('brochure_project_name').value;
        const brochureUrl = document.getElementById('brochure_pdf_url').value;
        const projId = document.getElementById('brochure_project_id').value;

        if (!name || name.length < 3) {
            statusMessage.style.display = 'block';
            statusMessage.style.background = 'rgba(231, 76, 60, 0.15)';
            statusMessage.style.color = '#e74c3c';
            statusMessage.innerHTML = 'الاسم بالكامل يجب ألا يقل عن 3 أحرف.';
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'إرسال وتحميل ملف الـ PDF الآن';
            return;
        }

        const finalWhatsapp = whatsapp || phone;

        const phoneRegex = /^\+?[0-9\s\-]{8,20}$/;
        if (!phoneRegex.test(phone)) {
            statusMessage.style.display = 'block';
            statusMessage.style.background = 'rgba(231, 76, 60, 0.15)';
            statusMessage.style.color = '#e74c3c';
            statusMessage.innerHTML = 'رقم الهاتف غير صحيح، يرجى إدخال أرقام فقط (8 أرقام على الأقل).';
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'إرسال وتحميل ملف الـ PDF الآن';
            return;
        }

        const formData = {
            name: name,
            phone: phone,
            whatsapp: finalWhatsapp,
            email: null,
            project_interest: projId ? parseInt(projId) : null,
            unit_type: 'Not Specified',
            notes: `طلب تحميل بروشور ومخطط مشروع: ${projName}`,
            source: 'Web Brochure Download Form',
            status: 'new'
        };

        try {
            const response = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                statusMessage.style.display = 'block';
                statusMessage.style.background = 'rgba(46, 204, 113, 0.15)';
                statusMessage.style.color = '#2ecc71';
                statusMessage.innerHTML = 'تم حفظ بياناتك بنجاح! جاري تحميل المخطط الهندسي والكتالوج الآن...';
                if (window.fbq) fbq('track', 'SubmitApplication', { content_name: 'Brochure Gated Download', project: projName });
                localStorage.setItem('leadSubmitted', 'true');
                window.open(brochureUrl, '_blank');
                setTimeout(() => {
                    document.getElementById('brochureDownloadModal').style.display = 'none';
                    brochureForm.reset();
                    statusMessage.style.display = 'none';
                }, 3000);
            } else {
                throw new Error(data.error || 'حدث خطأ أثناء تسجيل طلبك، يرجى المحاولة لاحقاً.');
            }
        } catch (error) {
            const isNetworkError = error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('Failed');
            if (isNetworkError) {
                try {
                    const savedLeads = JSON.parse(localStorage.getItem('offline_demo_leads') || '[]');
                    savedLeads.push({ ...formData, created_at: new Date().toISOString() });
                    localStorage.setItem('offline_demo_leads', JSON.stringify(savedLeads));
                } catch(e){}
                statusMessage.style.display = 'block';
                statusMessage.style.background = 'rgba(46, 204, 113, 0.15)';
                statusMessage.style.color = '#2ecc71';
                statusMessage.innerHTML = 'تم حفظ بياناتك بنجاح! جاري تحميل المخطط الهندسي والكتالوج الآن...';
                if (brochureUrl) window.open(brochureUrl, '_blank');
                setTimeout(() => {
                    document.getElementById('brochureDownloadModal').style.display = 'none';
                    brochureForm.reset();
                    statusMessage.style.display = 'none';
                }, 3000);
            } else {
                statusMessage.style.display = 'block';
                statusMessage.style.background = 'rgba(231, 76, 60, 0.15)';
                statusMessage.style.color = '#e74c3c';
                statusMessage.innerHTML = 'عذراً: ' + error.message;
            }
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'إرسال وتحميل ملف الـ PDF الآن';
        }
    });
}

// --- 9. Lead Wizard (4-step form) ---
if (document.getElementById('leadCaptureForm')) {
    let currentStep = 1;
    const totalSteps = 4;

    window.selectSegment = function(group, val, element) {
        const parentGrid = element.closest('.segmented-grid');
        parentGrid.querySelectorAll('.seg-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');

        if (group === 'goal') {
            document.getElementById('wizard_unit_type').value = val;
        } else if (group === 'project') {
            document.getElementById('wizard_project').value = val;
        } else if (group === 'budget') {
            document.getElementById('wizard_budget').value = val;
        }

        setTimeout(() => {
            changeStep(1);
        }, 300);
    };

    window.changeStep = function(n) {
        if (n === 1) {
            if (currentStep === 1 && !document.getElementById('wizard_unit_type').value) {
                alert('يرجى اختيار هدفك الاستثماري أولاً');
                return;
            }
            if (currentStep === 2 && !document.getElementById('wizard_project').value) {
                alert('يرجى اختيار المنطقة الاستثمارية أولاً');
                return;
            }
            if (currentStep === 3 && !document.getElementById('wizard_budget').value) {
                alert('يرجى اختيار الميزانية الاستثمارية أولاً');
                return;
            }
        }

        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`step-i-${currentStep}`).classList.remove('active');
        if (n > 0) {
            document.getElementById(`step-i-${currentStep}`).classList.add('completed');
        }

        currentStep += n;
        if (currentStep < 1) currentStep = 1;
        if (currentStep > totalSteps) currentStep = totalSteps;

        document.getElementById(`step-${currentStep}`).classList.add('active');
        document.getElementById(`step-i-${currentStep}`).classList.add('active');
        document.getElementById(`step-i-${currentStep}`).classList.remove('completed');

        const progressLine = document.getElementById('wizard-progress-line');
        const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if(progressLine) progressLine.style.width = `${pct}%`;

        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const btnSubmit = document.getElementById('btnSubmitLead');

        if (currentStep === 1) {
            if(btnPrev) btnPrev.style.display = 'none';
        } else {
            if(btnPrev) btnPrev.style.display = 'block';
        }

        if (currentStep === totalSteps) {
            if(btnNext) btnNext.style.display = 'none';
            if(btnSubmit) btnSubmit.style.display = 'block';
        } else {
            if(btnNext) btnNext.style.display = 'block';
            if(btnSubmit) btnSubmit.style.display = 'none';
        }
    };

    const leadForm = document.getElementById('leadCaptureForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btnSubmitLead');
            const statusMessage = document.getElementById('formStatusMessage');
            
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تسجيل طلبك...';
            
            statusMessage.className = 'form-message';
            statusMessage.style.display = 'none';

            const name = document.getElementById('lead_name').value.trim();
            const phone = document.getElementById('lead_phone').value.trim();
            const whatsapp = document.getElementById('lead_whatsapp').value.trim();
            const email = document.getElementById('lead_email').value.trim();

            if (!name || name.length < 3) {
                statusMessage.className = 'form-message error';
                statusMessage.innerHTML = 'الاسم بالكامل يجب ألا يقل عن 3 أحرف.';
                statusMessage.style.display = 'block';
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'إرسال البيانات والتسجيل';
                return;
            }

            const finalWhatsapp = whatsapp || phone;

            const phoneRegex = /^\+?[0-9\s\-]{8,20}$/;
            if (!phoneRegex.test(phone)) {
                statusMessage.className = 'form-message error';
                statusMessage.innerHTML = 'رقم الهاتف غير صحيح، يرجى إدخال أرقام فقط (8 أرقام على الأقل).';
                statusMessage.style.display = 'block';
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'إرسال البيانات والتسجيل';
                return;
            }

            const budgetSelected = document.getElementById('wizard_budget').value;
            const fullNotes = `الميزانية المقترحة: ${budgetSelected}\nملاحظات العميل: ${document.getElementById('lead_notes').value.trim()}`;

            const projVal = document.getElementById('wizard_project').value;
            const projIdParsed = projVal ? parseInt(projVal) : null;

            const formData = {
                name: name,
                phone: phone,
                whatsapp: finalWhatsapp,
                email: email || null,
                project_interest: isNaN(projIdParsed) ? null : projIdParsed,
                unit_type: document.getElementById('wizard_unit_type').value || 'Not Specified',
                notes: fullNotes,
                source: 'Web Landing Page',
                status: 'new'
            };

            try {
                const response = await fetch(`${API_URL}/api/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (response.ok) {
                    statusMessage.classList.add('success');
                    statusMessage.innerHTML = 'تم تسجيل بياناتك وخطة استثمارك بنجاح! سيتواصل معك أحد مستشارينا العقاريين خلال دقائق لتوضيح الأسعار والتقسيط المتاح.';
                    statusMessage.style.display = 'block';
                    if (window.fbq) fbq('track', 'Lead', { content_name: 'Wizard Form Submission', value: 0.00, currency: 'EGP' });
                    
                    setTimeout(() => {
                        leadForm.reset();
                        document.querySelectorAll('.seg-card').forEach(c => c.classList.remove('selected'));
                        document.getElementById('wizard_unit_type').value = '';
                        document.getElementById('wizard_project').value = '';
                        document.getElementById('wizard_budget').value = '';
                        
                        document.getElementById(`step-${currentStep}`).classList.remove('active');
                        document.getElementById(`step-i-${currentStep}`).classList.remove('active');
                        document.getElementById(`step-i-${currentStep}`).classList.remove('completed');
                        currentStep = 1;
                        document.getElementById('step-1').classList.add('active');
                        document.getElementById('step-i-1').classList.add('active');
                        if (document.getElementById('btn-prev')) document.getElementById('btn-prev').style.display = 'none';
                        if (document.getElementById('btn-next')) document.getElementById('btn-next').style.display = 'block';
                        btnSubmit.style.display = 'none';
                        if (document.getElementById('wizard-progress-line')) document.getElementById('wizard-progress-line').style.width = '0%';
                        statusMessage.style.display = 'none';
                    }, 4000);
                } else {
                    throw new Error(data.error || 'حدث خطأ أثناء إرسال البيانات، يرجى المحاولة مرة أخرى.');
                }
            } catch (error) {
                const isNetworkError = error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('Failed');
                if (isNetworkError) {
                    try {
                        const savedLeads = JSON.parse(localStorage.getItem('offline_demo_leads') || '[]');
                        savedLeads.push({ ...formData, created_at: new Date().toISOString() });
                        localStorage.setItem('offline_demo_leads', JSON.stringify(savedLeads));
                    } catch(e){}
                    statusMessage.className = 'form-message success';
                    statusMessage.innerHTML = 'تم تسجيل بياناتك وخطة استثمارك بنجاح! سيتواصل معك أحد مستشارينا العقاريين خلال دقائق لتوضيح الأسعار والتقسيط المتاح.';
                    statusMessage.style.display = 'block';
                    setTimeout(() => {
                        leadForm.reset();
                        document.querySelectorAll('.seg-card').forEach(c => c.classList.remove('selected'));
                        document.getElementById('wizard_unit_type').value = '';
                        document.getElementById('wizard_project').value = '';
                        document.getElementById('wizard_budget').value = '';
                        
                        document.getElementById(`step-${currentStep}`).classList.remove('active');
                        document.getElementById(`step-i-${currentStep}`).classList.remove('active');
                        document.getElementById(`step-i-${currentStep}`).classList.remove('completed');
                        currentStep = 1;
                        document.getElementById('step-1').classList.add('active');
                        document.getElementById('step-i-1').classList.add('active');
                        if (document.getElementById('btn-prev')) document.getElementById('btn-prev').style.display = 'none';
                        if (document.getElementById('btn-next')) document.getElementById('btn-next').style.display = 'block';
                        btnSubmit.style.display = 'none';
                        if (document.getElementById('wizard-progress-line')) document.getElementById('wizard-progress-line').style.width = '0%';
                        statusMessage.style.display = 'none';
                    }, 4000);
                } else {
                    statusMessage.className = 'form-message error';
                    statusMessage.innerHTML = 'عذراً: ' + error.message;
                    statusMessage.style.display = 'block';
                }
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'إرسال البيانات والتسجيل';
            }
        });
    }
}

// --- 10. Stats Counter Animation ---
if (document.getElementById('stats-counter-area')) {
    function runCounters() {
        const statsArea = document.getElementById('stats-counter-area');
        if (!statsArea) return;
        const counters = statsArea.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const targetStr = counter.getAttribute('data-target') || '0';
            const target = parseInt(targetStr, 10);
            if (isNaN(target)) return;
            const hasPlus = targetStr.includes('+') || target >= 10;
            let current = 0;
            const increment = Math.ceil(target / 25) || 1;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = (hasPlus ? '+' : '') + target;
                    clearInterval(timer);
                } else {
                    counter.innerText = (hasPlus ? '+' : '') + current;
                }
            }, 30);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const statsArea = document.getElementById('stats-counter-area');
        if (statsArea) {
            let counterInitialized = false;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counterInitialized) {
                        runCounters();
                        counterInitialized = true;
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(statsArea);

            setTimeout(() => {
                if (!counterInitialized) {
                    runCounters();
                    counterInitialized = true;
                }
            }, 800);
        }
    });
}

// --- 11. FAQ Accordion ---
if (document.querySelector('.faq-item')) {
    document.addEventListener('DOMContentLoaded', () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if(question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherAns = otherItem.querySelector('.faq-answer');
                        if(otherAns) otherAns.style.maxHeight = null;
                    });

                    if (!isActive) {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq-answer');
                        if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
                    }
                });
            }
        });
    });
}

// --- 12. Before/After Comparison Slider ---
if (document.querySelector('.before-after-container')) {
    function updateBeforeAfterSlider(val) {
        const afterImg = document.getElementById('sliderAfterImg');
        const divider = document.getElementById('sliderDividerLine');
        if (afterImg && divider) {
            afterImg.style.clipPath = 'polygon(0 0, ' + val + '% 0, ' + val + '% 100%, 0 100%)';
            divider.style.left = val + '%';
        }
    }

    const beforeAfterData = {
        fayrouz: {
            before: 'images/el-fayrouz-tower-before-engaz-developments.jpg',
            after: 'images/el-fayrouz-tower-after-engaz-developments.jpg'
        },
        sidnawy: {
            before: 'images/sednawy-before.jpg',
            after: 'images/sednawy-after.jpg'
        },
        teachers: {
            before: 'images/teachers-syndicate-before-engaz-developments.jpg',
            after: 'images/teachers-syndicate-after-engaz-developments.jpg'
        },
        mansoura: {
            before: 'images/new-mansoura-villas-before-engaz-developments.jpg',
            after: 'images/new-mansoura-villas-after-engaz-developments.jpg'
        }
    };

    window.switchBeforeAfterProject = function(projectId) {
        const data = beforeAfterData[projectId];
        if (!data) return;
        
        document.querySelectorAll('.before-after-selector .btn-before-after').forEach(btn => btn.classList.remove('active'));
        const tabEl = document.getElementById('tab-ba-' + projectId);
        if(tabEl) tabEl.classList.add('active');
        
        const beforeImg = document.querySelector('.before-img img');
        const afterImg = document.querySelector('.after-img img');
        
        if (beforeImg && afterImg) {
            beforeImg.src = data.before;
            afterImg.src = data.after;
        }
        
        const range = document.getElementById('beforeAfterRange');
        if (range) {
            range.value = 50;
            updateBeforeAfterSlider(50);
        }
    };
}

// --- 13. Portfolio Filters ---
if (document.getElementById('portfolio-grid')) {
    window.filterPortfolio = function(category, element) {
        document.querySelectorAll('#portfolio-filters .btn-before-after').forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
        
        const cards = document.querySelectorAll('#portfolio-grid .previous-project-card');
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    };
}

// --- 14. Theme Switcher (Dark/Light) ---
const themeBtn = document.getElementById('theme-switcher-btn');
if (themeBtn) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'white-gold') {
        document.documentElement.classList.add('theme-white-gold');
    }

    themeBtn.addEventListener('click', () => {
        const isWhite = document.documentElement.classList.toggle('theme-white-gold');
        localStorage.setItem('theme', isWhite ? 'white-gold' : 'petroleum-gold');
    });
}

// --- 15. Facebook Pixel Events ---
document.addEventListener('DOMContentLoaded', () => {
    const whatsappBtn = document.getElementById('floating-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (window.fbq) fbq('track', 'Contact', { content_name: 'WhatsApp Floating Button' });
        });
    }
    document.querySelectorAll('.btn-branch-contact').forEach(btn => {
        btn.addEventListener('click', () => {
            const branchTitle = btn.closest('.branch-card')?.querySelector('.branch-title')?.textContent || 'Branch';
            if (window.fbq) fbq('track', 'Contact', { content_name: `WhatsApp Branch: ${branchTitle}` });
        });
    });
    
    // Track whatsapp links
    document.body.addEventListener('click', async function(e) {
        const waLink = e.target.closest('a[href*="wa.me"]');
        if (waLink) {
            const nameVal = document.getElementById('lead_name')?.value.trim() || document.getElementById('brochure_name')?.value.trim() || '';
            const phoneVal = document.getElementById('lead_phone')?.value.trim() || document.getElementById('brochure_phone')?.value.trim() || '';
            const waVal = document.getElementById('lead_whatsapp')?.value.trim() || document.getElementById('brochure_whatsapp')?.value.trim() || '';
            
            const payload = {
                name: nameVal || 'زائر ضغط واتساب مباشر',
                phone: phoneVal || '000000000',
                whatsapp: waVal || '000000000',
                email: document.getElementById('lead_email')?.value.trim() || null,
                source: 'Website WhatsApp Click',
                status: 'new',
                project_interest: parseInt(document.getElementById('wizard_project')?.value || document.getElementById('brochure_project_id')?.value) || null,
                unit_type: document.getElementById('wizard_unit_type')?.value || 'Not Specified',
                notes: `الزائر ضغط على رابط واتساب: ${waLink.href}. ` + (nameVal ? `البيانات المدخلة جزئياً في النموذج: الاسم=${nameVal}، الهاتف=${phoneVal}، واتساب=${waVal}` : 'لم يكتب أي بيانات في نموذج التسجيل بعد.')
            };

            try {
                await fetch(`${API_URL}/api/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                console.log('WhatsApp click logged to CRM successfully');
            } catch (err) {
                console.error('Error logging WhatsApp click to CRM:', err);
            }
        }
    });
});

// --- 16. Scroll Animations (IntersectionObserver) ---
document.addEventListener('DOMContentLoaded', () => {
    const animateTargets = [
        '.project-card', '.testimonial-card', '.branch-card',
        '.partner-logo-box', '.section-title', '.section-subtitle',
        '.about-text', '.stat-item', '.segmented-grid',
        '.wizard-step-container', '.previous-project-card'
    ];
    
    animateTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });
});

// --- 17. Discount Popup Modal ---
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('discountLeadMagnetModal');
    const closeBtn = document.getElementById('btnCloseDiscountModal');
    const form = document.getElementById('discountLeadForm');
    const statusMsg = document.getElementById('discountStatusMessage');

    if (!popup) return;

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    // Exit Intent: Show popup only when user moves mouse toward browser top (intent to leave)
    let popupTriggered = false;
    const handleExitIntent = (e) => {
        if (popupTriggered) return;
        if (e.clientY < 60) { // Mouse heading toward browser bar
            if (!sessionStorage.getItem('discount_popup_shown')) {
                popup.style.display = 'flex';
                sessionStorage.setItem('discount_popup_shown', 'true');
                popupTriggered = true;
            }
            document.removeEventListener('mousemove', handleExitIntent);
        }
    };
    // Also show after 45s of inactivity — only once per session
    const inactivityTimer = setTimeout(() => {
        if (!popupTriggered && !sessionStorage.getItem('discount_popup_shown')) {
            popup.style.display = 'flex';
            sessionStorage.setItem('discount_popup_shown', 'true');
            popupTriggered = true;
        }
    }, 45000);
    document.addEventListener('mousemove', handleExitIntent);

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('discount_name').value;
            const phone = document.getElementById('discount_phone').value;
            const email = document.getElementById('discount_email').value;
            const submitBtn = document.getElementById('btnSubmitDiscountForm');

            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري الحفظ وإرسال كود الخصم...';
            statusMsg.style.display = 'none';

            try {
                const response = await fetch(`${API_URL}/api/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        whatsapp: phone,
                        email: email,
                        source: 'Website Popup',
                        notes: 'طلب كود الخصم ENGAZ10 عبر نافذة الماركتنج المنبثقة الترحيبية.'
                    })
                });

                if (!response.ok) throw new Error(await response.text());

                if (window.fbq) fbq('track', 'Lead', { content_name: 'Lead Magnet Popup', status: 'Discount Claimed' });

                statusMsg.style.display = 'block';
                statusMsg.style.background = 'rgba(16, 185, 129, 0.1)';
                statusMsg.style.color = '#10b981';
                statusMsg.style.border = '1px solid #10b981';
                statusMsg.innerHTML = 'تم إرسال كود الخصم بنجاح! كود الخصم الخاص بك هو <strong>ENGAZ10</strong>.';

                submitBtn.disabled = false;
                submitBtn.style.background = '#25D366';
                submitBtn.style.color = '#fff';
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> تفعيل الخصم وبدء المحادثة الفورية';
                submitBtn.onclick = (event) => {
                    event.preventDefault();
                    window.open(`https://api.whatsapp.com/send?phone=201030405054&text=${encodeURIComponent('أهلاً إنجاز، لقد حصلت على كود الخصم ENGAZ10 من الموقع الترحيبي، واسمي ' + name + '. أود تفعيله ومعرفة تفاصيل مشاريعكم.')}`, '_blank');
                };
            } catch (err) {
                const isNetworkError = err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Failed');
                if (isNetworkError) {
                    try {
                        const savedLeads = JSON.parse(localStorage.getItem('offline_demo_leads') || '[]');
                        savedLeads.push({ name, phone, email, source: 'Website Popup', notes: 'طلب كود الخصم ENGAZ10 عبر نافذة الماركتنج المنبثقة الترحيبية.', created_at: new Date().toISOString() });
                        localStorage.setItem('offline_demo_leads', JSON.stringify(savedLeads));
                    } catch(e){}

                    statusMsg.style.display = 'block';
                    statusMsg.style.background = 'rgba(16, 185, 129, 0.1)';
                    statusMsg.style.color = '#10b981';
                    statusMsg.style.border = '1px solid #10b981';
                    statusMsg.innerHTML = 'تم إرسال كود الخصم بنجاح! كود الخصم الخاص بك هو <strong>ENGAZ10</strong>.';

                    submitBtn.disabled = false;
                    submitBtn.style.background = '#25D366';
                    submitBtn.style.color = '#fff';
                    submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> تفعيل الخصم وبدء المحادثة الفورية';
                    submitBtn.onclick = (event) => {
                        event.preventDefault();
                        window.open(`https://api.whatsapp.com/send?phone=201030405054&text=${encodeURIComponent('أهلاً إنجاز، لقد حصلت على كود الخصم ENGAZ10 من الموقع الترحيبي، واسمي ' + name + '. أود تفعيله ومعرفة تفاصيل مشاريعكم.')}`, '_blank');
                    };
                } else {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'احصل على الخصم الفوري وتفاصيل العرض';
                    statusMsg.style.display = 'block';
                    statusMsg.style.background = 'rgba(239, 68, 68, 0.1)';
                    statusMsg.style.color = '#ef4444';
                    statusMsg.style.border = '1px solid #ef4444';
                    statusMsg.textContent = 'حدث خطأ: ' + err.message;
                }
            }
        });
    }
});

// --- 18. Testimonials Loading ---
async function fetchAndRenderTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    let testimonialsList = [];
    try {
        const res = await fetch(`${API_URL}/api/public/testimonials`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                testimonialsList = data;
            }
        }
    } catch (e) {
        console.warn('Failed to load live testimonials, falling back.', e);
    }

    if (testimonialsList.length === 0) {
        testimonialsList = FALLBACK_TESTIMONIALS;
    }

    container.innerHTML = '';
    testimonialsList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-rating">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
            <p class="testimonial-text">"${item.comment}"</p>
            <div class="testimonial-user">
                <div class="testimonial-avatar">${item.client_name.charAt(0)}</div>
                <div>
                    <span class="testimonial-name">${item.client_name}</span>
                    <span class="testimonial-project">عميل مشروع: ${item.project_name || 'إنجاز'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 19. Smooth Scrolling & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = targetElem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    document.querySelector('nav')?.classList.remove('mobile-active');
                }
            }
        });
    });

    // Close Modals on click outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('projectDetailsModal');
        const brochureModal = document.getElementById('brochureDownloadModal');
        if (modal && e.target === modal) modal.style.display = 'none';
        if (brochureModal && e.target === brochureModal) brochureModal.style.display = 'none';
    });

    const btnCloseModal = document.getElementById('btnCloseModal');
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            const modal = document.getElementById('projectDetailsModal');
            if (modal) modal.style.display = 'none';
        });
    }

    // Initialize projects and testimonials
    if (document.getElementById('dynamicProjectsGrid')) {
        fetchProjects().then(projects => {
            activeProjects = projects;
            renderProjects(activeProjects);
        });
    }

    fetchAndRenderTestimonials();

    const searchFilter = document.getElementById('filter-search');
    const cityFilter = document.getElementById('filter-city');
    const statusFilter = document.getElementById('filter-status');
    if(searchFilter) searchFilter.addEventListener('input', filterProjects);
    if(cityFilter) cityFilter.addEventListener('change', filterProjects);
    if(statusFilter) statusFilter.addEventListener('change', filterProjects);
});

// --- 20. Mobile Menu Toggle ---
// Assuming mobile menu toggle logic here if there is any button, 
// normally this would toggle `.mobile-active` on the `<nav>`

// --- 21. Category Filtering Helper ---
function filterProjectsByCategory(cat) {
    const cityFilter = document.getElementById('filter-city');
    if (!cityFilter) return;
    if (cat === 'residential') cityFilter.value = 'التجمع';
    else if (cat === 'commercial') cityFilter.value = 'بسيون';
    else cityFilter.value = 'all';
    
    const event = new Event('change');
    cityFilter.dispatchEvent(event);
}
