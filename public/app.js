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
  .catch(err => console.error(err));

/* ===============================
   Header
================================ */
function renderHeader(navigation) {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = `
    <nav>
      <ul>
        ${navigation.filter(n => n.enabled).map(n => `
          <li>
            <a href="#${n.target}" data-target="${n.target}">
              ${n.label}
            </a>
          </li>
        `).join('')}
      </ul>
    </nav>
  `;

  header.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(a.dataset.target)
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===============================
   Sections
================================ */
function renderSections(sections) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)
    .forEach(section => {
      const el = document.createElement('section');
      el.id = section.id;
      el.className = `section section-${section.type}`;

      if (section.type === 'hero') {
        el.innerHTML = `
          <h1>${section.content?.title || ''}</h1>
          <p>${section.content?.subtitle || ''}</p>
        `;
      }

      if (section.type === 'service') {
        el.appendChild(renderService(section));
      }

      if (section.type === 'cta') {
        el.innerHTML = `<h2>${section.content?.title || ''}</h2>`;
      }

      app.appendChild(el);
    });
}

/* ===============================
   Service Renderer (Grid / Slider)
================================ */
function renderService(section) {
  const wrapper = document.createElement('div');
  const { title, cards = [] } = section.content || {};
  const options = section.options || {};
  const isSlider = options.layout === 'slider' || options.slider?.enabled;

  wrapper.innerHTML = `<h2>${title || ''}</h2>`;

  const activeCards = cards.filter(c => c.enabled);

  if (!isSlider) {
    // GRID
    const grid = document.createElement('div');
    grid.className = 'card-grid';

    grid.innerHTML = activeCards.map(c => `
      <div class="card">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </div>
    `).join('');

    wrapper.appendChild(grid);
    return wrapper;
  }

  // SLIDER
  const slider = document.createElement('div');
  slider.className = 'card-slider';

  activeCards.forEach((c, idx) => {
    const slide = document.createElement('div');
    slide.className = 'card slide';
    slide.style.display = idx === 0 ? 'block' : 'none';
    slide.innerHTML = `<h3>${c.title}</h3><p>${c.desc}</p>`;
    slider.appendChild(slide);
  });

  wrapper.appendChild(slider);

  initSlider(slider, options.slider || {});
  return wrapper;
}

/* ===============================
   Simple Slider Logic
================================ */
function initSlider(sliderEl, sliderOptions) {
  const slides = sliderEl.querySelectorAll('.slide');
  if (slides.length <= 1) return;

  let index = 0;
  const interval = sliderOptions.interval || 4000;

  setInterval(() => {
    slides[index].style.display = 'none';
    index = (index + 1) % slides.length;
    slides[index].style.display = 'block';
  }, interval);
}
