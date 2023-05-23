import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;

    // find the first a deep in the li
    const a = li.querySelector('a');
    if (a) {
      const aContent = a.innerHTML;
      const cardTitleDiv = document.createElement('div');
      cardTitleDiv.innerHTML = aContent;
      a.replaceWith(cardTitleDiv);
      a.innerHTML = '';
      a.append(...li.children);
      li.append(a);
      [...a.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) {
          div.className = 'cards-card-image';
        } else {
          div.className = 'cards-card-body';
        }
      });
    } else {
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) {
          div.className = 'cards-card-image';
        } else {
          div.className = 'cards-card-body';
        }
      });
    }

    ul.append(li);
  });
  ul.querySelectorAll('img')
    .forEach((img) => img.closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
