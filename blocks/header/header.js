import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  // TODO: remove this fallback once nav is in place
  const navPath = navMeta ? new URL(navMeta).pathname : '/_drafts/satyam/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    block.innerHTML = '';
    const html = await resp.text();
    const fetchedNav = document.createElement('div');
    fetchedNav.innerHTML = html;
    const navClasses = ['nav-top', 'nav-middle', 'nav-bottom'];
    navClasses.forEach((navClass, idx) => {
      const nav = document.createElement('nav');
      nav.classList.add(navClass);
      nav.innerHTML = fetchedNav.querySelectorAll(':scope>div')[idx].innerHTML;
      block.appendChild(nav);
    });
    decorateIcons(block);
  }
}
