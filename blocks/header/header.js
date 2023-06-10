import { getMetadata } from '../../scripts/lib-franklin.js';
import { getSearchWidget } from '../../scripts/scripts.js';

function decorateSocial(social) {
  social.classList.add('social');
  social.innerHTML = social.innerHTML.replace(/\[social\]/, '');
}

function addLevels(root) {
  const ulElements = root.querySelectorAll('ul');

  ulElements.forEach((ul) => {
    let level = 1;
    let currentElement = ul;

    while (currentElement.parentElement) {
      if (currentElement.parentElement.tagName === 'UL') {
        level += 1;
      }

      currentElement = currentElement.parentElement;
    }

    ul.classList.add(`menu-level-${level}`);
    ul.querySelectorAll(':scope>li').forEach((li) => {
      li.classList.add(`menu-level-${level}-item`);
    });
  });
}

function buildDropDownMenu(parent) {
  if (parent.querySelectorAll('ul').length === 0) return;
  const dropDownMenu = document.createElement('div');
  dropDownMenu.classList.add('dropdown-menu');
  const dropDownHeader = document.createElement('div');
  dropDownHeader.classList.add('dropdown-menu-header');
  dropDownHeader.innerHTML = `
    <a href="/global-network">
      Learn about regional availability
      <span class="icon icon-ang-white"></span>
    </a>
    <h2>${parent.querySelector('a').innerHTML}</h2>
  `;
  dropDownMenu.appendChild(dropDownHeader);
  dropDownMenu.appendChild(parent.querySelector('ul'));
  parent.appendChild(dropDownMenu);
}

function decorateTopNav(nav) {
  nav.querySelectorAll(':scope>ul>li').forEach((li) => {
    if (li.textContent.trim() === '[social]') {
      decorateSocial(li);
    }
  });
}

function decorateMiddleNav() {
}

function decorateBottomNav(nav) {
  addLevels(nav);
  nav.querySelectorAll(':scope>ul>li').forEach((li) => {
    buildDropDownMenu(li);
  });
  const hamburger = document.createElement('span');
  hamburger.classList.add('mobile-icon');
  hamburger.innerHTML = Array.from({ length: 4 }, () => '<i></i>').join(' ');
  nav.prepend(hamburger);

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
  nav.append(getSearchWidget());
}

const navDecorators = { 'nav-top': decorateTopNav, 'nav-middle': decorateMiddleNav, 'nav-bottom': decorateBottomNav };
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta || '/nav';
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
      navDecorators[navClass](nav);

      block.appendChild(nav);
    });

    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > document.querySelector('nav.nav-top').offsetHeight + document.querySelector('nav.nav-middle').offsetHeight) {
        document.querySelector('header').classList.add('fixed');
      } else {
        document.querySelector('header').classList.remove('fixed');
      }
    });
  }
}
