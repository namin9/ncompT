/* =========================================================
   Service Homepage – App Engine
   역할:
   - 콘텐츠 JSON을 받아 섹션 템플릿으로 렌더링
   - 미리보기 메시지(PREVIEW) 수신
   - 이미지 없는 상태에서도 레이아웃 유지
========================================================= */

const API_BASE =
  'https://young-sunset-d631.koolee1372.workers.dev';

/* ===============================
   Navigation
================================ */
function renderNavigation(nav = []) {
  const navEl = document.getElementById('nav');
  if (!navEl) return;

  navEl.innerHTML = nav
    .filter(n => n.enabled)
    .map(n => `
      <li>
        <a href="#${n.target}">${n.label}</a>
      </li>
    `)
    .join('');

  // 부드러운 스크롤
  navEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').replace('#','');
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

/* ===============================
   Media Placeholder
================================ */
function renderMedia(media = {}) {
  const ratio = media.ratio || '16-9';
  return `
    <div class="media-box ratio-${ratio}"></div>
  `;
}

/* ===============================
   Section Templates
================================ */
function renderSection(section) {
  switch (section.type) {
    case 'hero':
      return `
        <section class="section hero" id="${section.id}">
          <div class="section-inner">
            ${renderMedia(section.media)}
            <h1>${section.content?.title || ''}</h1>
            <p>${section.content?.subtitle || ''}</p>
          </div>
        </section>
      `;

    case 'cards':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <h2>${section.content?.title || ''}</h2>
            <div class="card-grid">
              ${(section.content?.items || []).map(item => `
                <div class="card">
                  ${renderMedia(section.media)}
                  <h3>${item.title || ''}</h3>
                  <p>${item.desc || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'list':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <h2>${section.content?.title || ''}</h2>
            <ul class="feature-list">
              ${(section.content?.items || [])
                .map(i => `<li>${i}</li>`)
                .join('')}
            </ul>
          </div>
        </section>
      `;

    case 'cta':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <div class="cta-box">
              <h2>${section.content?.title || ''}</h2>
              <p>${section.content?.subtitle || ''}</p>
              <button>문의하기</button>
            </div>
          </div>
        </section>
      `;

    case 'gallery':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <h2>${section.content?.title || ''}</h2>
            <div class="card-grid">
              ${(section.content?.items || []).map(() => `
                <div class="media-box ratio-${section.media?.ratio || '1-1'}"></div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'faq':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <h2>${section.content?.title || ''}</h2>
            ${(section.content?.items || []).map(f => `
              <div class="card">
                <strong>${f.q || ''}</strong>
                <p>${f.a || ''}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `;

    case 'pricing':
      return `
        <section class="section" id="${section.id}">
          <div class="section-inner">
            <h2>${section.content?.title || ''}</h2>
            <div class="card-grid">
              ${(section.content?.items || []).map(p => `
                <div class="card">
                  <h3>${p.name || ''}</h3>
                  <strong>${p.price || ''}</strong>
                  <p>${p.desc || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    default:
      console.warn('Unknown section type:', section.type);
      return '';
  }
}

/* ===============================
   Render Pipeline
================================ */
function renderPage(data) {
  if (!data) return;

  renderNavigation(data.navigation || []);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  (data.sections || [])
    .filter(s => s.enabled)
    .sort((a,b) => a.order - b.order)
    .forEach(section => {
      app.insertAdjacentHTML(
        'beforeend',
        renderSection(section)
      );
    });
}

/* ===============================
   Load Content (Initial)
================================ */
function loadContent() {
  fetch(API_BASE + '/api/content')
    .then(res => res.json())
    .then(data => renderPage(data))
    .catch(err => {
      console.error('Content load failed:', err);
    });
}

/* ===============================
   Preview Message Listener
================================ */
window.addEventListener('message', e => {
  if (e.data?.type === 'PREVIEW') {
    renderPage(e.data.data);
  }
});

/* ===============================
   Init
================================ */
document.addEventListener('DOMContentLoaded', loadContent);
