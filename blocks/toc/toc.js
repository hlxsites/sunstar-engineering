export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.append(block.querySelector('ul'));
  block.replaceChildren(nav);
}
