import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { getSearchWidget, getWindowSize } from '../../scripts/scripts.js';

function decorateSocial(social) {
  social.classList.add('social');
  social.innerHTML = social.innerHTML.replace(/\[social\]/, '');
}

/* Add levels to the menu items */
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

function buildDropDownMenu(parent, placeholders) {
  if (parent.querySelectorAll('ul').length === 0) return;
  const dropDownMenu = document.createElement('div');
  dropDownMenu.classList.add('dropdown-menu');
  const dropDownHeader = document.createElement('div');
  dropDownHeader.classList.add('dropdown-menu-header');
  dropDownHeader.innerHTML = `
    <h2>${parent.querySelector('a').innerHTML}</h2>
    <a href="/global-network">
      ${placeholders['learn-about-regional-availability']}
      <span class="icon icon-ang-white"></span>
    </a>
  `;
  dropDownMenu.appendChild(dropDownHeader);
  dropDownMenu.appendChild(parent.querySelector('ul'));
  parent.appendChild(dropDownMenu);

  // Create an intersection observer instance for the dropdown menu
  // Bring the backdrop in and out of view depending on the dropdown menu's visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelector('.backdrop').classList.add('visible');
      } else {
        document.querySelector('.backdrop').classList.remove('visible');
      }
    });
  });

  observer.observe(dropDownMenu);

  parent.addEventListener('click', (evt) => {
    if (getWindowSize().width < 1232) {
      evt.preventDefault();
      evt.stopPropagation();
      parent.classList.toggle('open');
      document.querySelector('.menu-back-btn').classList.toggle('visible');
      document.querySelector('.mobile-icon').classList.toggle('visible');
    }
  });

  dropDownMenu.addEventListener('click', (evt) => {
    if (getWindowSize().width < 1232) {
      if (evt.target.parentElement.classList.contains('menu-level-2-item')) {
        const level3Menu = evt.target.parentElement.querySelector('ul');
        if (level3Menu) {
          evt.preventDefault();
          level3Menu.classList.toggle('open');
        }
      }
      evt.stopPropagation();
    }
  });
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

function decorateBottomNav(nav, placeholders) {
  addLevels(nav);
  nav.querySelectorAll(':scope .menu-level-1-item').forEach((li) => {
    buildDropDownMenu(li, placeholders);
  });
  const hamburger = document.createElement('span');
  hamburger.classList.add('mobile-icon');
  hamburger.classList.add('visible');
  hamburger.innerHTML = Array.from({ length: 4 }, () => '<i></i>').join(' ');
  nav.prepend(hamburger);

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });

  const menuBackBtn = document.createElement('div');
  menuBackBtn.classList.add('menu-back-btn');
  menuBackBtn.innerHTML = '<span class="icon icon-ang-white"></span><span>Back To Menu</span>';
  nav.prepend(menuBackBtn);

  menuBackBtn.addEventListener('click', () => {
    menuBackBtn.classList.remove('visible');
    hamburger.classList.add('visible');
    nav.querySelectorAll(':scope .menu-level-1-item.open').forEach((item) => {
      item.classList.remove('open');
    });

    nav.querySelectorAll(':scope .menu-level-2-item.open').forEach((item) => {
      item.classList.remove('open');
    });

    nav.querySelectorAll(':scope .menu-level-3.open').forEach((item) => {
      item.classList.remove('open');
    });
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
    // TODO: localize
    const placeholders = await fetchPlaceholders();
    block.innerHTML = '';
    const html = await resp.text();
    const fetchedNav = document.createElement('div');
    fetchedNav.innerHTML = html;
    const navClasses = ['nav-top', 'nav-middle', 'nav-bottom'];
    navClasses.forEach((navClass, idx) => {
      const nav = document.createElement('nav');
      nav.classList.add(navClass);
      nav.innerHTML = fetchedNav.querySelectorAll(':scope>div')[idx].innerHTML;
      navDecorators[navClass](nav, placeholders);

      block.appendChild(nav);
    });

    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > document.querySelector('nav.nav-top').offsetHeight + document.querySelector('nav.nav-middle').offsetHeight) {
        document.querySelector('header').classList.add('fixed');
      } else {
        document.querySelector('header').classList.remove('fixed');
      }
    });

    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.body.appendChild(backdrop);
  }
}
