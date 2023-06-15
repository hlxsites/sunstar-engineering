export default async function decorate(block) {
  let tableDivHtml = '';
  [...block.children].forEach((child, i) => {
    if (block.getAttribute('style') === null) {
      const rowLength = ([...block.children].length).toString();
      block.setAttribute('style', `--row:${rowLength}`);
    }
    [...child.children].forEach((childDiv) => {
      if (!i) childDiv.classList.add('table-head');
      tableDivHtml += childDiv.outerHTML;
    });
    if (block.getAttribute('style') !== null && !block.getAttribute('style').includes('--col')) {
      const colLength = [...child.children].length.toString();
      const rowStyle = block.getAttribute('style');
      block.setAttribute('style', `${rowStyle};--col:${colLength}`);
    }
  });
  block.innerHTML = '';
  block.innerHTML = tableDivHtml;
}
