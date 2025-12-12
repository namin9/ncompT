fetch('/content.json')
  .then(res => res.json())
  .then(data => {
    const app = document.getElementById('app');
    data.sections.forEach(sec => {
      const el = document.createElement('section');
      el.innerHTML = `<h1>${sec.title}</h1>`;
      app.appendChild(el);
    });
  });
