fetch('/content.json')
  .then(res => res.json())
  .then(data => {
    renderHeader(data.navigation);

    const app = document.getElementById('app');
    app.innerHTML = '';

    data.sections
      .filter(s => s.enabled)
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        const el = document.createElement('section');
        el.id = section.id;

        if (section.type === 'hero') {
          el.innerHTML = `
            <h1>${section.content.title}</h1>
            <p>${section.content.subtitle}</p>
          `;
        }

        if (section.type === 'service') {
          el.innerHTML = `
            <h2>${section.content.title}</h2>
            <ul>
              ${section.content.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          `;
        }

        app.appendChild(el);
      });
  });

function renderHeader(navigation) {
  const header = document.getElementById('header');
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
