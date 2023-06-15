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

function buildDropDownMenu(l1menuItem, placeholders) {
  if (l1menuItem.querySelectorAll('ul').length === 0) return;
  const dropDownMenu = document.createElement('div');
  dropDownMenu.classList.add('dropdown-menu');
  const dropDownHeader = document.createElement('div');
  dropDownHeader.classList.add('dropdown-menu-header');
  dropDownHeader.innerHTML = `
    <h2>${l1menuItem.querySelector('a').innerHTML}</h2>
    <a href="/global-network">
      ${placeholders['learn-about-regional-availability']}
      <span class="icon icon-ang-white"></span>
    </a>
  `;
  dropDownMenu.appendChild(dropDownHeader);
  dropDownMenu.appendChild(l1menuItem.querySelector('ul'));
  l1menuItem.appendChild(dropDownMenu);

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

  l1menuItem.addEventListener('click', (evt) => {
    if (getWindowSize().width < 1232) {
      evt.preventDefault();
      evt.stopPropagation();
      const li = document.createElement('li');
      li.classList.add('menu-level-2-item-header');
      li.innerHTML = l1menuItem.querySelector('a').outerHTML;
      l1menuItem.querySelector(':scope .menu-level-2').prepend(li);
      l1menuItem.querySelector(':scope .menu-level-2').classList.toggle('open');
      document.querySelector('.dropdown-menu').classList.toggle('open');
      document.querySelector('.menu-back-btn').classList.toggle('visible');
      document.querySelector('.mobile-icon').classList.toggle('visible');
    }
  });

  dropDownMenu.addEventListener('click', (evt) => {
    if (getWindowSize().width < 1232) {
      if (evt.target.parentElement.classList.contains('menu-level-1-item')) {
        const level2Menu = evt.target.parentElement.querySelector('ul');
        if (level2Menu) {
          evt.preventDefault();
          const parent = level2Menu.closest('.menu-level-1-item');
          const li = document.createElement('li');
          li.classList.add('menu-level-2-item-header');
          li.innerHTML = parent.querySelector('a').outerHTML;
          level2Menu.prepend(li);
          level2Menu.classList.toggle('open');
        }
      } else if (evt.target.parentElement.classList.contains('menu-level-2-item')) {
        const level3Menu = evt.target.parentElement.querySelector('ul');
        if (level3Menu) {
          evt.preventDefault();
          const parent = level3Menu.closest('.menu-level-2-item');
          const li = document.createElement('li');
          li.classList.add('menu-level-3-item-header');
          li.innerHTML = parent.querySelector('a').outerHTML;
          level3Menu.prepend(li);

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
    nav.querySelector(':scope .menu-level-1').classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });

  const menuBackBtn = document.createElement('div');
  menuBackBtn.classList.add('menu-back-btn');
  menuBackBtn.innerHTML = `<span class="icon icon-angle-left"></span><a>${placeholders['back-to-menu']}</a>`;
  nav.prepend(menuBackBtn);
  nav.append(getSearchWidget());

  menuBackBtn.addEventListener('click', () => {
    const level1Open = nav.querySelector(':scope .menu-level-1.open');
    const level2Open = nav.querySelector(':scope .menu-level-2.open');
    const level3Open = nav.querySelector(':scope .menu-level-3.open');

    if (level3Open) {
      level3Open.querySelector(':scope .menu-level-3-item-header').remove();
      level3Open.classList.remove('open');
      return;
    }

    if (level2Open) {
      level2Open.querySelector(':scope .menu-level-2-item-header').remove();
      level2Open.closest('.dropdown-menu').classList.remove('open');
      level2Open.classList.remove('open');
      menuBackBtn.classList.remove('visible');
      hamburger.classList.add('visible');
      return;
    }

    if (level1Open) {
      level1Open.classList.remove('open');
    }
  });
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
