export default async function decorate(block) {
  [...block.children].forEach((row) => {
    const colCount = row.children.length;
    row.classList.add(`styled-para-${colCount}-cols`);
  });

  block.querySelectorAll('.styled-para-1-cols').forEach((row) => {
    row.querySelector('p')
      ?.parentElement?.classList.add('content');
    row.querySelector('h1, h2, h3, h4, h5, h6')
      ?.parentElement?.classList.add('heading');
  });

  block.querySelectorAll('.styled-para-2-cols').forEach((row) => {
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
    backgroundContainer.classList.add('styled-para-background-container');
    const pictureContainer = row.querySelector('div:first-child:has(picture)');
    backgroundContainer.append(pictureContainer);
    row.append(backgroundContainer);
  });

  block.querySelectorAll('.button-container > .button').forEach((a) => {
    a.classList.remove('primary', 'secondary', 'tertiary');
    a.classList.add('tertiary');
  });
}
