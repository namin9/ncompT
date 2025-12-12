const API_BASE_URL = 'https://young-sunset-d631.koolee1372.workers.dev';

/* ===============================
   Entry
================================ */
fetch(API_BASE_URL + '/api/content')
  .then(res => res.json())
  .then(data => {
    renderHeader(data.navigation || []);
    renderSections(data.sections || []);
  })
  .catch(err => {
    console.error('Content load failed:', err);
  });

/* ===============================
   Header
================================ */
function renderHeader(navigation) {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = `
    <nav>
      <ul>
        ${navigation
          .filter(n => n.enabled)
          .map(n => `
            <li>
              <a href="#${n.target}" data-target="${n.target}">
                ${n.label}
              </a>
            </li>
          `)
          .join('')}
      </ul>
    </nav>
  `;

  header.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.target;
      document.getElementById(target)
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===============================
   Sections
================================ */
function renderSections(sections) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)
    .forEach(section => {
      const el = renderSection(section);
      if (el) app.appendChild(el);
    });
}

function renderSection(section) {
  const el = document.createElement('section');
  el.id = section.id;
  el.className = `section section-${section.type}`;

  switch (section.type) {
    case 'hero':
      el.innerHTML = renderHero(section);
      break;

    case 'service':
      el.innerHTML = renderService(section);
      break;

    case 'cta':
      el.innerHTML = renderCTA(section);
      break;

    default:
      console.warn('Unknown section type:', section.type);
      return null;
  }

  return el;
}

/* ===============================
   Section Templates
================================ */
function renderHero(section) {
  const { title, subtitle } = section.content || {};
  return `
    <h1>${title || ''}</h1>
    <p>${subtitle || ''}</p>
  `;
}

function renderService(section) {
  const { title, cards = [] } = section.content || {};
  const layout = section.options?.layout || 'grid';

  if (layout === 'slider') {
    return renderServiceSlider(title, cards, section.options?.slider);
  }

  // default: grid
  return `
    <h2>${title || ''}</h2>
    <div class="card-grid">
      ${cards
        .filter(c => c.enabled)
        .map(card => `
          <div class="card">
            <h3>${card.title || ''}</h3>
            <p>${card.desc || ''}</p>
          </div>
        `)
        .join('')}
    </div>
  `;
}

function renderServiceSlider(title, cards, sliderOptions = {}) {
  const interval = sliderOptions.interval || 4000;
  const id = 'slider-' + Math.random().toString(36).slice(2);

  setTimeout(() => initSlider(id, interval), 0);

  return `
    <h2>${title || ''}</h2>
    <div class="card-slider" id="${id}">
      ${cards
        .filter(c => c.enabled)
        .map(card => `
          <div class="card slide">
            <h3>${card.title || ''}</h3>
            <p>${card.desc || ''}</p>
          </div>
        `)
        .join('')}
    </div>
  `;
}

function renderCTA(section) {
  const { title } = section.content || {};
  return `
    <h2>${title || ''}</h2>
  `;
}

/* ===============================
   Slider Logic (simple)
================================ */
function initSlider(containerId, interval) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const slides = Array.from(container.children);
  if (slides.length === 0) return;

  let index = 0;
  slides.forEach((s, i) => {
    s.style.display = i === 0 ? 'block' : 'none';
  });

  setInterval(() => {
    slides[index].style.display = 'none';
    index = (index + 1) % slides.length;
    slides[index].style.display = 'block';
  }, interval);
}
