const API_URL = 'https://young-sunset-d631.koolee1372.workers.dev/api/content';

/* ===============================
   Entry
================================ */
fetch(API_URL)
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
   Sections Renderer
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

/* --- 카드형 섹션 표준 --- */
function renderService(section) {
  const { title, cards = [] } = section.content || {};

  return `
    <h2>${title || ''}</h2>
    <div class="card-grid">
      ${cards
        .filter(card => card.enabled)
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

function renderCTA(section) {
  const { title } = section.content || {};
  return `
    <h2>${title || ''}</h2>
  `;
}
