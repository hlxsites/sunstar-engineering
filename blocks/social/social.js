/**
 * decorates the social block
 * @param {Element} block The social block element
 */
export default async function decorate(block) {
  const childs = Array.from(block.children);
  const spanWithImg = [];

  childs.forEach((x) => {
    const a = x.querySelector('a');
    const span = document.createElement('span');
    const newAnchor = document.createElement('a');
    newAnchor.href = a.href;
    const firstGrandChild = x.querySelector('div');
    span.classList.add(`icon-${firstGrandChild.innerText.toLowerCase()}`, 'icon');
    newAnchor.appendChild(span);
    spanWithImg.push(newAnchor);
  });

  block.innerHTML = '';
  const span = document.createElement('span');
  span.innerText = 'SHARE';
  block.appendChild(span);

  spanWithImg.forEach((x) => {
    block.appendChild(x);
  });
}
