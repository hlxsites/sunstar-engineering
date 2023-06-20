export default async function decorate(block) {
  [...block.children].forEach((row) => {
    const colCount = row.children.length;
    row.classList.add(`image-variants-${colCount}-cols`);
  });

  const section = block.closest('.section');
  const addClassToParent = (name, el) => {
    el.parentElement.classList.add(name);
  };

  section.querySelectorAll('div').forEach((row) => {
    row.querySelectorAll('p').forEach((p) => {
      addClassToParent('para', p);
      addClassToParent('section-content', p);
    });
    row.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      addClassToParent('heading', h);
      addClassToParent('section-content', h);
    });
  });

  section.querySelectorAll('.button-container > .button').forEach((a) => {
    a.classList.remove('primary', 'secondary', 'tertiary');
    a.classList.add('tertiary');
  });

  block.querySelectorAll('.image-variants-2-cols').forEach((row) => {
    const typeHintEl = row.querySelector('div:first-child');
    const typeHints = typeHintEl?.textContent
      ?.trim()?.toLowerCase()
      ?.split(',')?.map((type) => type.trim());
    if (typeHints?.length) {
      row.classList.add(...typeHints);
      typeHintEl.remove();
    }
  });

  block.querySelectorAll('.background').forEach((row) => {
    const backgroundContainer = document.createElement('div');
    backgroundContainer.classList.add('image-variants-background-container');
    const pictureContainer = row.querySelector('div:first-child:has(picture)');
    backgroundContainer.append(pictureContainer);
    row.append(backgroundContainer);
  });
}
