import {
  readBlockConfig,
  decorateButtons,
  decorateSections,
  updateSectionsStatus,
} from '../../scripts/lib-franklin.js';

function wrapSocialAndNavLinks(block) {
  const socialNavWrapper = document.createElement('div');
  socialNavWrapper.classList.add('social-nav');
  const navLinks = block.querySelector('.nav-links');
  const social = block.querySelector('.social');

  socialNavWrapper.appendChild(navLinks);
  socialNavWrapper.appendChild(social);

  block.querySelector('.primary').after(socialNavWrapper);
}

function decorateFooter(block) {
  wrapSocialAndNavLinks(block);

  const primaryFooter = block.querySelector('.section.primary>div');
  const itemsList = [];
  const childrens = [...primaryFooter.children];
  let index = 0;

  while (index < childrens.length) {
    const navItem = document.createElement('div');
    navItem.classList.add('primary-items');
    navItem.appendChild(childrens[index]);
    if (childrens[index + 1] && childrens[index + 1].tagName === 'UL') {
      navItem.appendChild(childrens[index + 1]);
      index += 2;
    } else {
      index += 1;
    }

    itemsList.push(navItem);
  }

  primaryFooter.innerHTML = '';
  itemsList.forEach((item) => {
    primaryFooter.appendChild(item);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;
    await decorateSections(footer);
    updateSectionsStatus(footer);

    block.append(footer);
    decorateButtons(block);
    decorateFooter(block);
  }
}
