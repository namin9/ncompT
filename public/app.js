fetch('/content.json')
  .then(res => res.json())
  .then(data => {
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

        app.appendChild(el);
      });
  });
