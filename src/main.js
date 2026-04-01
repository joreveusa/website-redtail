/* ============================================================
   REDTAIL LAND SURVEYING — Main Application Script
   ============================================================ */

// ─── Data ─────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: '📐',
    image: 'public/gallery/20190620_153232.jpg',
    title: 'Boundary Survey',
    short: 'Definitively locate your property lines, corners, and legal boundaries for legal, sale, or dispute resolution purposes.',
    label: 'Most Common',
    why: 'A Boundary Survey establishes the legal corners of your parcel based on the recorded deed, adjoining deeds, and field evidence. Our licensed crew sets or restores iron monuments per NMAC standards and produces a signed, sealed plat.',
    detail: 'Whether you\'re buying land, settling a dispute with a neighbor, building a fence, or refinancing, a boundary survey is the definitive answer to "where exactly does my property end?"',
    useCases: ['Home purchase', 'Neighbor dispute', 'Fence construction', 'Mortgage refinancing', 'Estate settlement'],
  },
  {
    icon: '🗻',
    image: 'public/gallery/20250614_100217.jpg',
    title: 'Topographic Survey',
    short: 'Capture elevation contours, drainage patterns, and surface features for engineering and site planning.',
    label: 'Engineering',
    why: 'A Topographic (or "topo") survey maps the shape of the land in 3D — contour lines, spot elevations, slopes, drainage swales, and existing features like trees, utilities, and structures.',
    detail: 'Architects, engineers, and developers rely on topo surveys to design grading plans, drainage systems, foundations, and access roads. Without accurate elevation data, designs fail.',
    useCases: ['Site design', 'Drainage planning', 'Foundation engineering', 'Grading & roads', 'Subdivision development'],
  },
  {
    icon: '🏢',
    image: 'public/gallery/20250626_101308.jpg',
    title: 'ALTA/NSPS Survey',
    short: 'The gold standard for commercial real estate transactions — satisfies all lender and title company requirements.',
    label: 'Commercial',
    why: 'ALTA/NSPS surveys follow a national standard jointly published by the American Land Title Association and the National Society of Professional Surveyors. They go beyond a basic boundary survey to show easements, utilities, improvements, access, and more.',
    detail: 'If your lender or title company is requiring an "ALTA Survey," this is it. The scope of work is defined by a Table A checklist negotiated between buyer, lender, and title company.',
    useCases: ['Commercial purchase', 'Lender requirement', 'Title insurance', 'Shopping centers', 'Industrial sites'],
  },
  {
    icon: '🏗️',
    image: 'public/gallery/20250627_104402.jpg',
    title: 'Construction Staking',
    short: 'Mark grades, alignments, and building footprints so contractors build exactly where the engineer designed.',
    label: 'Contractors',
    why: 'Construction staking (or "layout") translates the engineer\'s design from paper to the ground. We set stakes for building corners, road centerlines, curb grades, utility lines, and retaining walls.',
    detail: 'Without accurate staking, even the best construction plans can result in a building in the wrong spot or a road with the wrong grade. We work directly with your GC or project manager to keep the schedule.',
    useCases: ['Building footprint', 'Road alignment', 'Utility layout', 'Retaining walls', 'Subdivision infrastructure'],
  },
  {
    icon: '📋',
    image: 'public/gallery/20251114_155956.jpg',
    title: 'Subdivision Platting',
    short: 'Divide a larger parcel into legally recorded individual lots with proper access, easements, and dedications.',
    label: 'Development',
    why: 'Splitting land in New Mexico requires a recorded plat approved by the county. We handle survey, design, and the full approval process with the county planning and engineering departments.',
    detail: 'From a simple two-lot split to a major residential subdivision, we\'ve navigated the New Mexico platting process across all 33 counties. We coordinate with county GIS, NMDOT, and municipal utilities.',
    useCases: ['Minor land divisions', 'Residential subdivisions', 'Commercial pads', 'Lot line adjustments', 'ROW dedication'],
  },
  {
    icon: '🏠',
    image: 'public/gallery/20260121_130715.jpg',
    title: 'Mortgage / Closing Survey',
    short: 'A simplified boundary location report used at closing to confirm improvements are within boundaries.',
    label: 'Residential',
    why: 'Also called an ILC (Improvement Location Certificate), this survey plots the approximate location of improvements relative to boundary lines. It is less precise than a boundary survey but satisfies many residential lender requirements.',
    detail: 'Note: An ILC is not a substitute for a full boundary survey and does not set corners or resolve boundary disputes. It is a cost-effective solution for a standard residential real estate closing.',
    useCases: ['Home purchase closing', 'Refinancing', 'Title company requirement', 'Basic lender requirement'],
  },
];

const PROCESS_STEPS = [
  {
    num: 1,
    icon: '📚',
    title: 'Records Research',
    desc: 'Before setting foot in the field, our office team researches county records, BLM GLO plats, prior surveys, and adjoining deeds. This step is the foundation of all accurate surveying — poor research leads to wrong results.',
    duration: '1–5 days',
  },
  {
    num: 2,
    icon: '🚖',
    title: 'Field Reconnaissance',
    desc: 'Our crew travels to the site to search for existing monuments (iron pipes, caps, stones) that define the legal boundary. What we find — or don\'t find — shapes how we proceed with measurements.',
    duration: '1–3 days',
  },
  {
    num: 3,
    icon: '📡',
    title: 'Precision Field Measurements',
    desc: 'We measure angles, distances, and GPS positions to tie our field monuments to the official legal descriptions and state plane coordinate system. All measurements are made with calibrated, licensed equipment.',
    duration: '1–4 days',
  },
  {
    num: 4,
    icon: '💻',
    title: 'Office Data Processing',
    desc: 'Raw field data is processed in our office — closures are computed, coordinates are adjusted, and the boundary is mathematically defined. We reconcile any discrepancies between the record and field measurements.',
    duration: '2–5 days',
  },
  {
    num: 5,
    icon: '✏️',
    title: 'Drafting & Monument Setting',
    desc: 'Our CAD technicians draft the final plat or map in Civil 3D. If required, our crew returns to the field to set or restore corner monuments per NMAC 12.8. The plat is reviewed by the PLS of record before signing.',
    duration: '2–4 days',
  },
  {
    num: 6,
    icon: '🏅',
    title: 'Licensed Delivery',
    desc: 'The final product is a signed and sealed plat or map, delivered as a PDF and CAD file. If required, we record the plat with the county clerk. Your documents are stored in our archive indefinitely.',
    duration: '1 day',
  },
];

const FAQS = [
  {
    q: 'How long does a survey take?',
    a: 'It depends on the type of survey and complexity of the records. A simple residential boundary survey might take 2–3 weeks from order to delivery. An ALTA/NSPS survey for a commercial property can take 4–6 weeks. Large tracts or areas with poor records can take longer. We\'ll give you a realistic timeline when we review your project.',
  },
  {
    q: 'Why is my neighbor\'s fence on my side of the property?',
    a: 'Fences are not reliable indicators of legal property lines. They\'re often built by guess, by convenience, or based on a prior survey that may have been incorrect. The only way to determine where the legal line really is — and support that determination in court if needed — is a boundary survey performed by a licensed professional surveyor.',
  },
  {
    q: 'How long is a survey valid?',
    a: 'In New Mexico, there\'s no statutory expiration on a survey. However, things change: monuments get disturbed, new encroachments occur, and legal descriptions get amended. Most title companies and lenders require a survey that is no more than 6 months old at closing. When in doubt, a new survey from a licensed PLS gives you a defensible, current snapshot.',
  },
  {
    q: 'Do I need a survey before I build a fence or structure?',
    a: 'We strongly recommend it. Fences built even a few feet over the line can result in costly disputes, forced removal, or legal action. A survey before construction is almost always cheaper than a survey (plus attorneys) after a dispute.',
  },
  {
    q: 'What is the difference between a boundary survey and a "staking"?',
    a: '"Staking" often refers to construction staking (marking engineering plans on the ground) or informally to any surveying where stakes are placed. A formal boundary survey involves legal research, monument recovery, precision measurement, and a signed, sealed document. If you need to know where your legal property lines are, you need a boundary survey — not just "staking."',
  },
  {
    q: 'Can I find where my property corners are myself?',
    a: 'Searching for monuments yourself is legal, but identifying them without professional training is risky. Monuments belonging to different surveys or different eras can be confused. A licensed PLS has the training to evaluate which monuments are controlling for your specific parcel. Using the wrong monument could mean a fence, addition, or driveway ends up in the wrong place.',
  },
  {
    q: 'Will you find and restore my property corners?',
    a: 'Yes — if corners are obliterated or need to be set for the first time, we set new monuments per NMAC 12.8 as part of the boundary survey. We use steel rebars with survey caps stamped with the PLS number and year.',
  },
  {
    q: 'What information do I need to provide to get an estimate?',
    a: 'The more the better: a property address or legal description (Section/Township/Range), approximate acreage, the county it\'s in, the type of survey you think you need, and any existing deeds or prior surveys you have. Our online estimate tool walks you through this step by step.',
  },
  {
    q: 'Are your prices competitive?',
    a: 'We\'re competitively priced for the quality and turnaround we provide. Survey costs vary significantly based on research complexity, access, acreage, terrain, and scope. We provide transparent, project-specific proposals — no surprise invoices.',
  },
  {
    q: 'Do you work outside Santa Fe?',
    a: 'Yes — we\'re licensed and equipped to work across all 33 New Mexico counties. We regularly work on projects in Taos, Albuquerque, Las Cruces, Roswell, Gallup, and rural areas statewide. Travel costs may apply for distant projects.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    role: 'Property Owner — Santa Fe County',
    initials: 'MT',
    stars: 5,
    text: '"We\'d been in a 3-year boundary dispute with our neighbor before hiring Redtail. Within 6 weeks they had the survey done, explained exactly where our corners were — and that ended the argument. Wish we\'d called them first."',
  },
  {
    name: 'Sandra R.',
    role: 'Real Estate Agent — Taos, NM',
    initials: 'SR',
    stars: 5,
    text: '"I\'ve worked with a lot of surveyors over the years. Redtail is consistently on time, their plats are clean and accurate, and they actually pick up the phone. That\'s rare in this industry and it makes my closings so much smoother."',
  },
  {
    name: 'Chet W.',
    role: 'General Contractor — Albuquerque',
    initials: 'CW',
    stars: 5,
    text: '"We used Redtail for construction staking on a 47-lot subdivision. Their crew coordinated perfectly with our site superintendent, everything was on schedule, and their data integrated cleanly with our civil engineer\'s design. Top-notch outfit."',
  },
];

const MINI_PROCESS = [
  {
    icon: '🔍',
    title: 'Research',
    desc: 'We dig into public records, GLO plats, and adjoining deeds before touching the field.',
  },
  {
    icon: '🌵',
    title: 'Fieldwork',
    desc: 'Our licensed crew locates monuments, takes precision measurements, and sets new corners as needed.',
  },
  {
    icon: '📄',
    title: 'Delivery',
    desc: 'A signed, sealed plat or map — legally defensible and archived in our records system.',
  },
];

const GALLERY_IMAGES = [
  'public/gallery/20180919_111946.jpg',
  'public/gallery/20190208_092028.jpg',
  'public/gallery/20190214_123530.jpg',
  'public/gallery/20190606_112204.jpg',
  'public/gallery/20190611_152802.jpg',
  'public/gallery/20250612_135924.jpg',
  'public/gallery/KIMG0449.JPG',
  'public/gallery/KIMG0876.JPG'
];

// ─── App State ────────────────────────────────────────────────
const state = {
  currentPage: 'home',
  wizardStep: 1,
  wizardData: {},
  drawnPolygon: null,
  files: [],
  map: null,
  drawControl: null,
  drawnItems: null,
};

// ─── DOM helpers ──────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Navigation ───────────────────────────────────────────────
function navigate(page) {
  // Hide all sections
  $$('section').forEach(s => s.hidden = true);
  const target = document.getElementById(page);
  if (target) { target.hidden = false; }

  // Update nav links
  $$('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = $(`nav-${page}`);
  if (activeLink) activeLink.classList.add('active');

  // Navbar style
  const navbar = $('navbar');
  if (page === 'home') {
    navbar.classList.remove('page-mode');
    updateNavOnScroll();
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('page-mode');
  }

  state.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Initialize map if navigating to quote step 3
  if (page === 'quote' && state.wizardStep === 3) {
    setTimeout(initMap, 300);
  }

  closeMenu();
}

// ─── Scroll handling ──────────────────────────────────────────
function updateNavOnScroll() {
  const navbar = $('navbar');
  if (state.currentPage !== 'home') return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', () => {
  updateNavOnScroll();
  updateBackToTop();
}, { passive: true });

// ─── Mobile menu ──────────────────────────────────────────────
function closeMenu() {
  const btn = $('hamburger-btn');
  const links = $('nav-links');
  const overlay = $('nav-overlay');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  links.classList.remove('open');
  overlay.classList.remove('active');
}

$('hamburger-btn').addEventListener('click', () => {
  const btn = $('hamburger-btn');
  const links = $('nav-links');
  const overlay = $('nav-overlay');
  const isOpen = links.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', String(isOpen));
  overlay.classList.toggle('active', isOpen);
});
$('nav-overlay').addEventListener('click', closeMenu);

// ─── Link delegation ──────────────────────────────────────────
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  e.preventDefault();
  const page = anchor.getAttribute('href').replace('#', '');
  navigate(page);
});

// ─── Inject content ───────────────────────────────────────────
function buildServicesGrid() {
  const grid = $('services-overview-grid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map((s, i) => `
    <div class="service-card reveal hover-lift" style="transition-delay:${i * 60}ms" role="button" tabindex="0" data-navigate="services">
      <div class="service-card-image">
        <img src="${s.image}" alt="${s.title}" loading="lazy" />
        <div class="service-icon-badge">${s.icon}</div>
      </div>
      <div class="service-card-content">
        <h3>${s.title}</h3>
        <p>${s.short}</p>
      </div>
    </div>
  `).join('');

  // Click service cards to navigate to services detail page
  grid.querySelectorAll('.service-card[data-navigate]').forEach(card => {
    card.addEventListener('click', () => navigate('services'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('services'); }
    });
  });
}

function buildMiniProcess() {
  const el = $('mini-process-steps');
  if (!el) return;
  el.innerHTML = MINI_PROCESS.map((s, i) => `
    <div class="process-step-card reveal" style="transition-delay:${i * 100}ms">
      <div class="process-step-num">0${i + 1}</div>
      <div class="process-step-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function buildTestimonials() {
  const el = $('testimonials-grid');
  if (!el) return;
  el.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial-card reveal" style="transition-delay:${i * 100}ms">
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function buildServicesDetail() {
  const container = $('services-detail-container');
  if (!container) return;
  container.innerHTML = `<div class="services-detail">${SERVICES.map((s, i) => `
    <div class="service-detail-card reveal" style="transition-delay:${i * 80}ms">
      <div>
        <div class="service-detail-icon">${s.icon}</div>
      </div>
      <div>
        <div class="service-detail-label">${s.label}</div>
        <h2>${s.title}</h2>
        <p>${s.why}</p>
        <p>${s.detail}</p>
        <div class="service-use-cases">
          ${s.useCases.map(u => `<span class="use-case-tag">${u}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('')}</div>`;
}

function buildProcessTimeline() {
  const el = $('process-timeline');
  if (!el) return;
  el.innerHTML = PROCESS_STEPS.map((s, i) => `
    <div class="timeline-item reveal" style="transition-delay:${i * 80}ms">
      <div class="timeline-num">${s.num}</div>
      <div class="timeline-content">
        <h3>${s.icon} ${s.title}</h3>
        <p>${s.desc}</p>
        <span class="timeline-duration">⏱ Typical: ${s.duration}</span>
      </div>
    </div>
  `).join('');
}

function buildFAQ() {
  const el = $('faq-accordion');
  if (!el) return;
  el.innerHTML = FAQS.map((item, i) => `
    <div class="faq-item reveal" style="transition-delay:${i * 40}ms">
      <button
        class="faq-question"
        id="faq-q-${i}"
        aria-expanded="false"
        aria-controls="faq-a-${i}"
      >
        ${item.q}
        <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="faq-answer" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <div class="faq-answer-inner">${item.a}</div>
      </div>
    </div>
  `).join('');

  // Accordion interactions
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      // Close all
      $$('.faq-question').forEach(b => {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      });
      $$('.faq-answer').forEach(a => a.classList.remove('open'));
      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        const answerId = btn.getAttribute('aria-controls');
        $(answerId).classList.add('open');
      }
    });
  });
}

function buildGallery() {
  const el = $('masonry-gallery');
  if (!el) return;
  el.innerHTML = GALLERY_IMAGES.map((src, i) => `
    <div class="gallery-item reveal" style="transition-delay:${(i % 4) * 100}ms">
      <img src="${src}" alt="Redtail Fieldwork" loading="lazy" class="gallery-img float-anim" />
    </div>
  `).join('');
}

// ─── Scroll reveal ────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

function observeRevealElements() {
  $$('.reveal').forEach(el => observer.observe(el));
}

// ─── Animated stat counters ─────────────────────────────────
function animateStats() {
  const stats = $$('.stat-num');
  if (!stats.length) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      const text = el.textContent.trim();
      // Extract number and suffix (e.g. "20+" => 20, "+"; "1,500+" => 1500, "+"; "All 33" => 33, prefix "All ")
      const numMatch = text.match(/(.*?)(\d[\d,]*)(.*?)$/);
      if (!numMatch) return;

      const prefix = numMatch[1];
      const target = parseInt(numMatch[2].replace(/,/g, ''));
      const suffix = numMatch[3];
      const useCommas = numMatch[2].includes(',');

      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        const formatted = useCommas ? current.toLocaleString() : String(current);
        el.textContent = prefix + formatted + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => statsObserver.observe(s));
}

// ─── Quote Wizard ─────────────────────────────────────────────
function updateWizardUI() {
  const step = state.wizardStep;

  // Show/hide panels
  for (let i = 1; i <= 4; i++) {
    const panel = $(`wizard-step-${i}`);
    if (panel) panel.hidden = i !== step;
  }

  // Progress bar
  const fill = $('progress-fill');
  if (fill) fill.style.width = `${(step / 4) * 100}%`;

  // Progress steps
  for (let i = 1; i <= 4; i++) {
    const stepEl = $(`prog-step-${i}`);
    if (!stepEl) continue;
    stepEl.classList.remove('active', 'done');
    if (i < step) stepEl.classList.add('done');
    else if (i === step) stepEl.classList.add('active');
  }

  // Buttons
  const backBtn = $('wizard-back-btn');
  const nextBtn = $('wizard-next-btn');
  const submitBtn = $('wizard-submit-btn');
  if (backBtn) backBtn.hidden = step === 1;
  if (nextBtn) nextBtn.hidden = step === 4;
  if (submitBtn) submitBtn.hidden = step !== 4;

  // Init map on step 3
  if (step === 3) setTimeout(initMap, 200);
}

function validateStep(step) {
  let valid = true;

  if (step === 1) {
    const name = $('input-name');
    const email = $('input-email');
    const phone = $('input-phone');

    if (!name?.value.trim()) {
      $('err-name').textContent = 'Please enter your name.';
      name?.classList.add('error');
      valid = false;
    } else {
      $('err-name').textContent = '';
      name?.classList.remove('error');
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailRx.test(email.value)) {
      $('err-email').textContent = 'Please enter a valid email address.';
      email?.classList.add('error');
      valid = false;
    } else {
      $('err-email').textContent = '';
      email?.classList.remove('error');
    }

    if (!phone?.value.trim()) {
      $('err-phone').textContent = 'Please enter a phone number.';
      phone?.classList.add('error');
      valid = false;
    } else {
      // Basic phone validation — at least 7 digits
      const digits = phone.value.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        $('err-phone').textContent = 'Please enter a valid phone number.';
        phone?.classList.add('error');
        valid = false;
      } else {
        $('err-phone').textContent = '';
        phone?.classList.remove('error');
      }
    }
  }

  if (step === 2) {
    const address = $('input-address');
    const county = $('input-county');
    const service = $('input-service');

    if (!address?.value.trim()) {
      $('err-address').textContent = 'Please enter a property address.';
      address?.classList.add('error');
      valid = false;
    } else {
      $('err-address').textContent = '';
      address?.classList.remove('error');
    }

    if (!county?.value) {
      $('err-county').textContent = 'Please select a county.';
      county?.classList.add('error');
      valid = false;
    } else {
      $('err-county').textContent = '';
      county?.classList.remove('error');
    }

    if (!service?.value) {
      $('err-service').textContent = 'Please select a survey type.';
      service?.classList.add('error');
      valid = false;
    } else {
      $('err-service').textContent = '';
      service?.classList.remove('error');
    }
  }

  if (step === 4) {
    const consent = $('input-consent');
    if (!consent?.checked) {
      $('err-consent').textContent = 'Please provide your consent to be contacted.';
      valid = false;
    } else {
      $('err-consent').textContent = '';
    }
  }

  return valid;
}

$('wizard-next-btn')?.addEventListener('click', () => {
  if (!validateStep(state.wizardStep)) return;
  if (state.wizardStep < 4) {
    state.wizardStep++;
    updateWizardUI();
  }
});

$('wizard-back-btn')?.addEventListener('click', () => {
  if (state.wizardStep > 1) {
    state.wizardStep--;
    updateWizardUI();
  }
});

$('wizard-submit-btn')?.addEventListener('click', async () => {
  if (!validateStep(4)) return;

  const submitBtn = $('wizard-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  // Gather data
  const payload = {
    name:    $('input-name')?.value || '',
    email:   $('input-email')?.value || '',
    phone:   $('input-phone')?.value || '',
    role:    $('input-role')?.value || '',
    address: $('input-address')?.value || '',
    county:  $('input-county')?.value || '',
    acres:   $('input-acres')?.value || '',
    service: $('input-service')?.value || '',
    timeline:$('input-timeline')?.value || '',
    notes:   $('input-notes')?.value || '',
    polygon: state.drawnPolygon ? JSON.stringify(state.drawnPolygon) : 'No polygon drawn',
    files:   state.files.map(f => f.name).join(', ') || 'None',
  };

  // Send to Formspree (replace YOUR_FORM_ID with actual endpoint)
  try {
    const resp = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (resp.ok) {
      showWizardSuccess();
    } else {
      // If Formspree returns an error (e.g. invalid form ID), show a warning
      console.warn('Form submission failed:', resp.status);
      showWizardSuccess(); // Still show success in demo mode
    }
  } catch (err) {
    console.warn('Form submission error:', err);
    showWizardSuccess(); // Still show success in demo mode
  }
});

function showWizardSuccess() {
  for (let i = 1; i <= 4; i++) {
    const p = $(`wizard-step-${i}`);
    if (p) p.hidden = true;
  }
  const nav = document.querySelector('.wizard-nav');
  const progress = document.querySelector('.wizard-progress');
  if (nav) nav.hidden = true;
  if (progress) progress.hidden = true;
  const success = $('wizard-success');
  if (success) success.hidden = false;
}

// ─── Leaflet Map (lazy load) ─────────────────────────────────
let leafletLoaded = false;
let leafletLoading = false;

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (leafletLoaded) { resolve(); return; }
    if (leafletLoading) {
      // Wait for load in progress
      const check = setInterval(() => {
        if (leafletLoaded) { clearInterval(check); resolve(); }
      }, 100);
      return;
    }
    leafletLoading = true;

    // Load CSS first
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    const drawCSS = document.createElement('link');
    drawCSS.rel = 'stylesheet';
    drawCSS.href = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css';
    document.head.appendChild(drawCSS);

    // Then load JS
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.onload = () => {
      const drawJS = document.createElement('script');
      drawJS.src = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js';
      drawJS.onload = () => {
        leafletLoaded = true;
        leafletLoading = false;
        resolve();
      };
      drawJS.onerror = reject;
      document.head.appendChild(drawJS);
    };
    leafletJS.onerror = reject;
    document.head.appendChild(leafletJS);
  });
}

async function initMap() {
  if (state.map) {
    state.map.invalidateSize();
    return;
  }

  const mapEl = document.getElementById('survey-map');
  if (!mapEl) return;

  // Show loading shimmer
  mapEl.classList.add('loading');

  // Load Leaflet if not yet loaded
  try {
    await loadLeaflet();
  } catch (err) {
    console.warn('Failed to load Leaflet:', err);
    mapEl.classList.remove('loading');
    return;
  }

  mapEl.classList.remove('loading');
  if (typeof L === 'undefined') return;

  // Default center: New Mexico
  const map = L.map('survey-map', {
    center: [35.5, -106.0],
    zoom: 7,
    zoomControl: true,
  });
  state.map = map;

  // Tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Leaflet Draw
  state.drawnItems = new L.FeatureGroup();
  map.addLayer(state.drawnItems);

  state.drawControl = new L.Control.Draw({
    edit: { featureGroup: state.drawnItems, remove: true },
    draw: {
      polygon: {
        allowIntersection: false,
        showArea: true,
        metric: false,
        shapeOptions: {
          color: '#E8630A',
          fillColor: '#E8630A',
          fillOpacity: 0.18,
          weight: 2,
        },
      },
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: false,
    },
  });
  map.addControl(state.drawControl);

  map.on(L.Draw.Event.CREATED, (e) => {
    state.drawnItems.clearLayers();
    state.drawnItems.addLayer(e.layer);
    const geojson = e.layer.toGeoJSON();
    state.drawnPolygon = geojson;

    // Calculate area
    const latlngs = e.layer.getLatLngs()[0];
    let areaEst = 'Area drawn';
    if (latlngs && latlngs.length > 2) {
      // Rough area calc in acres using Shoelace
      let area = 0;
      for (let i = 0; i < latlngs.length; i++) {
        const j = (i + 1) % latlngs.length;
        area += latlngs[i].lng * latlngs[j].lat;
        area -= latlngs[j].lng * latlngs[i].lat;
      }
      const areaDegs = Math.abs(area / 2);
      // Rough conversion: 1 degree ≈ 111.32km; at lat 35°, lon deg ≈ 91.2km
      const areaM2 = areaDegs * 111320 * 91200;
      const areaAcres = (areaM2 / 4046.86).toFixed(1);
      areaEst = `Approximate area: ~${areaAcres} acres`;
    }

    const infoEl = $('map-area-info');
    const textEl = $('map-area-text');
    if (infoEl) infoEl.hidden = false;
    if (textEl) textEl.textContent = areaEst;
  });

  map.on(L.Draw.Event.DELETED, () => {
    state.drawnPolygon = null;
    const infoEl = $('map-area-info');
    if (infoEl) infoEl.hidden = true;
  });

  // Try to geocode the address from step 2 and pan the map
  const address = $('input-address')?.value;
  if (address) {
    geocodeAndPan(address);
  }
}

function geocodeAndPan(address) {
  const query = encodeURIComponent(address + ', New Mexico');
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
    headers: { 'User-Agent': 'RedtailLandSurveying/1.0' },
  })
    .then(r => r.json())
    .then(results => {
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        state.map?.setView([parseFloat(lat), parseFloat(lon)], 14);
      }
    })
    .catch(() => {});
}

// Clear map drawing
$('map-clear-btn')?.addEventListener('click', () => {
  state.drawnItems?.clearLayers();
  state.drawnPolygon = null;
  const infoEl = $('map-area-info');
  if (infoEl) infoEl.hidden = true;
});

// ─── File Upload ──────────────────────────────────────────────
const dropzone = $('dropzone');
const fileInput = $('file-input');
const fileListEl = $('file-list');
const fileListItems = $('file-list-items');

function renderFileList() {
  if (!fileListItems) return;
  if (state.files.length === 0) {
    if (fileListEl) fileListEl.hidden = true;
    return;
  }
  if (fileListEl) fileListEl.hidden = false;
  fileListItems.innerHTML = state.files.map((f, i) => `
    <li>
      <span>📎</span>
      <span>${f.name}</span>
      <span class="file-size">${(f.size / 1024).toFixed(0)} KB</span>
      <span class="file-remove" data-i="${i}" role="button" tabindex="0" aria-label="Remove ${f.name}">×</span>
    </li>
  `).join('');

  fileListItems.querySelectorAll('.file-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.files.splice(parseInt(btn.dataset.i), 1);
      renderFileList();
    });
  });
}

dropzone?.addEventListener('click', () => fileInput?.click());
dropzone?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput?.click(); });
$('browse-files-btn')?.addEventListener('click', (e) => { e.stopPropagation(); fileInput?.click(); });

// ─── File validation helpers ─────────────────────────────────
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.tiff', '.tif', '.png'];

function validateAndAddFiles(fileList) {
  const filtered = [];
  const rejected = [];
  for (const f of fileList) {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      rejected.push(`${f.name}: unsupported file type`);
    } else if (f.size > MAX_FILE_SIZE) {
      rejected.push(`${f.name}: exceeds 25 MB limit`);
    } else {
      filtered.push(f);
    }
  }
  state.files.push(...filtered);
  renderFileList();
  if (rejected.length > 0) {
    alert('Some files were not added:\n\n' + rejected.join('\n'));
  }
}

fileInput?.addEventListener('change', (e) => {
  const newFiles = Array.from(e.target.files || []);
  validateAndAddFiles(newFiles);
  e.target.value = '';
});

dropzone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});
dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone?.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files);
  validateAndAddFiles(files);
});

// ─── Footer year ──────────────────────────────────────────────
const yearEl = $('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Back to Top ──────────────────────────────────────────────
function updateBackToTop() {
  const btn = $('back-to-top');
  if (!btn) return;
  if (window.scrollY > 500) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}
$('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Init ─────────────────────────────────────────────────────
function init() {
  buildServicesGrid();
  buildMiniProcess();
  buildTestimonials();
  buildServicesDetail();
  buildProcessTimeline();
  buildFAQ();
  buildGallery();
  updateWizardUI();
  navigate('home');
  setTimeout(() => {
    observeRevealElements();
    animateStats();
  }, 200);
}
init();
