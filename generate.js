const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function getBlock(startStr, endStr) {
    const start = content.indexOf(startStr);
    if (start === -1) return '';
    let end = content.length;
    if (endStr) {
        end = content.indexOf(endStr, start);
        if (end === -1) end = content.length;
    }
    return content.substring(start, end);
}

const headHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | إنجاز للإستثمار العقاري والمقاولات</title>
    <meta name="description" content="{{DESC}}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{DESC}}">
    <meta property="og:image" content="/images/og-image.jpg">
    <meta property="og:locale" content="ar_EG">
    
    <link rel="canonical" href="https://engazdevelopments.com/{{PAGE}}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    
    <!-- Facebook Pixel -->
    <script>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '202610203040506');
      fbq('track', 'PageView');
    </script>
</head>
<body>
    <!-- Glow Effects -->
    <div class="glow-effect" style="top: 5%; left: 0; background: var(--gold-gradient);"></div>
    <div class="glow-effect" style="bottom: 10%; right: 0; background: var(--petrol-gradient, var(--royal-gradient));"></div>

    <!-- SHARED HEADER -->
    <header>
        <a href="index.html" class="logo-area" style="display: flex; align-items: center; gap: 14px; text-decoration: none;">
            <div class="logo-img-wrapper" style="width: 54px; height: 54px; border-radius: 14px; background: #fff; border: 1.5px solid var(--accent-gold); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 20px rgba(184, 149, 46, 0.35); transition: transform 0.3s ease;">
                <img src="images/logo_engaz.png" alt="ENGAZ Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;">
            </div>
            <div class="logo-text">
                <h1 style="color: var(--text-primary, #fff); font-weight: 900; font-size: 1.4rem; margin: 0; letter-spacing: -0.5px; line-height: 1.1;">ENGAZ</h1>
                <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.82rem; display: block; margin-top: 2px;">إنجاز للإستثمار العقاري والمقاولات</span>
            </div>
        </a>
        <button class="mobile-menu-btn" onclick="document.querySelector('nav').classList.toggle('mobile-active'); this.querySelector('i').classList.toggle('fa-bars'); this.querySelector('i').classList.toggle('fa-xmark');" aria-label="Toggle menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav>
            <a href="index.html">الرئيسية</a>
            <a href="projects.html">مشاريعنا</a>
            <a href="portfolio.html">سابقة أعمالنا</a>
            <a href="about.html">عن الشركة</a>
            <a href="contact.html" class="nav-btn"><i class="fa-solid fa-phone"></i> تواصل معنا</a>
        </nav>
    </header>

    <main>
`;

const footHtml = `
    </main>

    <!-- SHARED FOOTER -->
    <footer>
        <div class="footer-grid">
            <div class="footer-col">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 1rem;">
                    <div style="width: 52px; height: 52px; border-radius: 14px; background: #fff; border: 1.5px solid var(--accent-gold); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 20px rgba(184, 149, 46, 0.4);">
                        <img src="images/logo_engaz.png" alt="ENGAZ Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;">
                    </div>
                    <div>
                        <h4 style="margin: 0; color: #ffffff; font-weight: 900; font-size: 1.25rem;">ENGAZ</h4>
                        <span style="color: var(--accent-gold); font-size: 0.82rem; font-weight: 700;">إنجاز للإستثمار العقاري والمقاولات</span>
                    </div>
                </div>
                <p>إنجاز للإستثمار العقاري والمقاولات - نبني مجتمعات سكنية وتجارية فاخرة تدوم طويلاً.</p>
                <div class="footer-socials">
                    <a href="https://www.facebook.com/Engazrealestate.eg/" class="social-link" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="https://wa.me/201030405054" class="social-link" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                    <a href="https://www.instagram.com/engazdevelopments/" class="social-link" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h4>مكاتبنا وفروعنا</h4>
                <p>📍 طنطا - شارع الجيش - مول طنطا تاون (الفرع الرئيسي)</p>
                <p>📍 الرياض - حي الياسمين - طريق الملك عبدالعزيز</p>
                <p>📍 بسيون - شارع 23 يوليو - بجوار نقابة المعلمين</p>
                <p>📞 مبيعات مصر: 01030405054</p>
                <p>📞 مبيعات السعودية: +966503040505</p>
            </div>
            <div class="footer-col">
                <h4>روابط سريعة</h4>
                <a href="projects.html">معرض المشاريع</a>
                <a href="contact.html">طلب عرض السعر</a>
                <a href="about.html">نبذة عن الشركة</a>
                <a href="portfolio.html">سابقة الأعمال</a>
            </div>
        </div>
        <p class="copyright-text">جميع الحقوق محفوظة © 2026 | إنجاز للإستثمار العقاري والمقاولات</p>
    </footer>

    <!-- Floating WhatsApp -->
    <a href="https://wa.me/201030405054" class="floating-whatsapp" target="_blank" rel="noopener noreferrer" id="floating-whatsapp-btn">
        <i class="fa-brands fa-whatsapp"></i>
    </a>

    <!-- Theme Switcher -->
    <button class="theme-switcher-btn" id="theme-switcher-btn" title="تبديل الإضاءة" aria-label="تبديل الإضاءة">
        <i class="fa-solid fa-circle-half-stroke"></i>
    </button>

    <!-- Mobile Sticky Bar -->
    <div class="mobile-sticky-contact-bar">
        <a href="tel:+201030405054" class="sticky-contact-item call"><i class="fa-solid fa-phone"></i> <span>اتصل الآن</span></a>
        <a href="https://wa.me/201030405054" class="sticky-contact-item whatsapp" target="_blank"><i class="fa-brands fa-whatsapp"></i> <span>واتساب</span></a>
        <a href="contact.html" class="sticky-contact-item consult"><i class="fa-solid fa-file-signature"></i> <span>استشارة مجانية</span></a>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
`;

function createPage(filename, title, desc, bodyContent, modals = '') {
    let out = headHtml.replace(/{{TITLE}}/g, title).replace(/{{DESC}}/g, desc).replace(/{{PAGE}}/g, filename);
    out += bodyContent;
    out += modals;
    out += footHtml;
    fs.writeFileSync(filename, out);
}

// Blocks:
const hero = getBlock('<div class="hero-slider-container">', '<section class="vision-mission-section"');
const vision = getBlock('<section class="vision-mission-section"', '<section class="project-categories-section"');
const categories = getBlock('<section class="project-categories-section"', '<!-- Search Filters -->');
const stats = getBlock('<section class="stats-section"', '<section class="projects-section"');
const partners = getBlock('<section class="partners-section">', '<section id="about-engaz"');
const discountModal = getBlock('<div class="modal-overlay" id="discountModal">', '<div class="modal-overlay" id="brochureModal">') || getBlock('<div class="modal-overlay" id="discountModal">', '<section class="testimonials-section"');

const search = getBlock('<!-- Search Filters -->', '<section class="projects-section"');
const projectsGrid = getBlock('<section class="projects-section"', '<section class="sister-companies-section"');
const projectModal = getBlock('<div class="modal-overlay" id="projectDetailsModal">', '<div class="modal-overlay" id="discountModal">');
const brochureModal = getBlock('<div class="modal-overlay" id="brochureModal">', '<div class="modal-overlay" id="projectDetailsModal">') || getBlock('<div class="modal-overlay" id="brochureModal">', '<!-- CTA Banner -->');
const cta = getBlock('<!-- CTA Banner -->', '<!-- Testimonials Section -->');

const portfolio = getBlock('<section id="previous-projects"', '<section class="partners-section">');
const testimonials = getBlock('<section class="testimonials-section"', '<!-- Floating WhatsApp -->');

const aboutEngaz = getBlock('<section id="about-engaz"', '<section class="faq-section"');
const faq = getBlock('<section class="faq-section"', '<section class="branches-section"');
const branches = getBlock('<section class="branches-section"', '<section class="lead-section"');
const sister = getBlock('<section class="sister-companies-section"', '<section id="previous-projects"');

const lead = getBlock('<section class="lead-section"', '<!-- Project Details Modal -->');

// Build files

// FILE 1: index.html
createPage('index.html', 'الرئيسية', 'إنجاز للإستثمار العقاري والمقاولات', 
    hero + vision + categories + stats + partners, 
    discountModal);

// FILE 2: projects.html
createPage('projects.html', 'مشاريعنا', 'استكشف مشاريع إنجاز للإستثمار العقاري', 
    search + projectsGrid + cta, 
    projectModal + brochureModal);

// FILE 3: portfolio.html
createPage('portfolio.html', 'سابقة أعمالنا', 'سابقة أعمال إنجاز للإستثمار العقاري', 
    portfolio + testimonials);

// FILE 4: about.html
createPage('about.html', 'عن الشركة', 'تعرف على إنجاز للإستثمار العقاري', 
    aboutEngaz + sister + branches + faq);

// FILE 5: contact.html
createPage('contact.html', 'تواصل معنا', 'تواصل مع إنجاز للإستثمار العقاري', 
    lead);
