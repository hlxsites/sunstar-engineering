import { getNamedValueFromTable } from '../../scripts/scripts.js';

function getTitle(block) {
  const div = getNamedValueFromTable(block, 'Title');
  return div.querySelector('h2');
}

function getDescription(block) {
  const div = getNamedValueFromTable(block, 'Description');
  const p = document.createElement('p');
  p.textContent = div.textContent;
  return p;
}

function getButton(block) {
  const div = getNamedValueFromTable(block, 'Button name');
  if (div.innerText !== '') {
    div.classList.add('contact-us-button');
    const buttonLink = getNamedValueFromTable(block, 'Button link').textContent;
    const aLink = document.createElement('a');
    aLink.href = buttonLink;
    aLink.innerText = div.textContent;
    aLink.classList.add('button');
    aLink.classList.add('primary');
    div.textContent = '';
    div.append(aLink);
  }
  return div;
}

export default async function decorate(block) {
  const title = getTitle(block);
  const description = getDescription(block);
  const button = getButton(block);
  block.replaceChildren(title);
  block.append(description);
  block.append(button);
}
