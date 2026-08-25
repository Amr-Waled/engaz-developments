const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const res = [];
for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  if (line.includes('<div class="hero-slider-container">')) res.push('hero_start:' + i);
  if (line.includes('<section class="vision-mission-section"')) res.push('vision_start:' + i);
  if (line.includes('<section class="project-categories-section"')) res.push('categories_start:' + i);
  if (line.includes('<section class="stats-section"')) res.push('stats_start:' + i);
  if (line.includes('<!-- Search Filters -->')) res.push('search_start:' + i);
  if (line.includes('<section class="projects-section"')) res.push('projects_start:' + i);
  if (line.includes('<section class="sister-companies-section"')) res.push('sister_start:' + i);
  if (line.includes('<section id="previous-projects"')) res.push('portfolio_start:' + i);
  if (line.includes('<section class="partners-section"')) res.push('partners_start:' + i);
  if (line.includes('<section id="about-engaz"')) res.push('about_start:' + i);
  if (line.includes('<section class="faq-section"')) res.push('faq_start:' + i);
  if (line.includes('<section class="branches-section"')) res.push('branches_start:' + i);
  if (line.includes('<section class="lead-section"')) res.push('lead_start:' + i);
  if (line.includes('<div class="modal-overlay" id="projectDetailsModal"')) res.push('modal_details_start:' + i);
  if (line.includes('<div class="modal-overlay" id="brochureModal"')) res.push('modal_brochure_start:' + i);
  if (line.includes('<div class="modal-overlay" id="discountModal"')) res.push('modal_discount_start:' + i);
  if (line.includes('<section class="testimonials-section"')) res.push('testimonials_start:' + i);
  
  if (line.includes('<!-- Core Values Section -->')) res.push('core_values_start:' + i);
  if (line.includes('<!-- CTA Banner -->')) res.push('cta_banner_start:' + i);
  if (line.includes('<!-- Contact Info Cards -->') || line.includes('class="contact-info-cards"')) res.push('contact_cards_start:' + i);
}
console.log(res.join('\n'));
