function createKVList(block, doc = document) {
  const container = doc.createElement('div');
  [...block.children].forEach((el) => {
    if (el.children.length >= 2) {
      const key = doc.createElement('h3');
      let txt = el.children[0].textContent;
      if (!txt.endsWith(':')) {
        txt = txt.concat(':');
      }
      key.textContent = txt;
      container.appendChild(key);

      const val = doc.createElement('p');
      val.innerHTML = el.children[1].innerHTML;
      container.appendChild(val);
    }
  });

  return container.children;
}

export default async function decorate(block) {
  const kvList = createKVList(block);
  block.innerHTML = '';

  [...kvList].forEach((el) => block.append(el));
}
