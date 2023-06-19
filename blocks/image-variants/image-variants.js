export default async function decorate(block) {
  [...block.children].forEach((row) => {
    const colCount = row.children.length;
    row.classList.add(`image-variants-${colCount}-cols`);
  });

  const section = block.closest('.section');
  const containedBlocks = [...section.classList].filter((c) => {
    return c.endsWith('-container');
  });

  if (containedBlocks.length == 1 && containedBlocks.includes('image-variants-container')) {
    section.querySelectorAll('div').forEach((row) => {
      row.querySelectorAll('p').forEach((p) => {
        p?.parentElement?.classList.add('content', 'context-content');
      });
      row.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        h?.parentElement?.classList.add('heading', 'context-content');
      });
    });
  }

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
