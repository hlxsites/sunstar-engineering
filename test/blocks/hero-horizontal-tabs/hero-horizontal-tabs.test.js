/* eslint-disable no-unused-expressions */
/* global describe before beforeEach it */

import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const scripts = {};

document.write(await readFile({ path: './hero-horizontal-tabs.plain.html' }));

describe('Hero Horizontal Tabs', () => {
  before(async () => {
    const mod = await import('../../../blocks/hero-horizontal-tabs/hero-horizontal-tabs.js');
    Object
      .keys(mod)
      .forEach((func) => {
        scripts[func] = mod[func];
      });
  });

  beforeEach(async () => {
    const body = document.querySelector('body');
    body.innerHTML = '';
    document.write(await readFile({ path: './hero-horizontal-tabs.plain.html' }));
  });

  it('Render Tabs', async () => {
    const block = document.querySelector('.hero-horizontal-tabs');

    const loc = {
      href: `${window.location.origin}/global-network/the-americas`,
    };

    await scripts.default(block, loc);

    expect(block.children.length).to.equals(2);
    expect(['hero-horiz-tabs-panel']).to.deep.equal([...block.children[0].classList]);
    expect(block.children[0].children.length).to.equal(2);
    expect(['hero-horiz-tabs-text']).to.deep.equal([...block.children[0].children[0].classList]);
    const nav = block.children[0].children[1];
    expect(nav.tagName).to.equal('NAV');
    expect(nav.children.length).to.equal(3);
    const a0 = nav.children[0];
    expect(a0.href.endsWith('/global-network/the-americas/')).to.be.true;
    expect(a0.innerText).to.equal('The Americas');
    expect([...a0.classList]).to.include('current');
    expect(nav.children[1].href.endsWith('/global-network/asia/')).to.be.true;
    expect([...nav.children[1].classList]).to.not.include('current');
    expect(nav.children[2].href.endsWith('/global-network/europe/')).to.be.true;
    expect([...nav.children[2].classList]).to.not.include('current');

    expect(['hero-horiz-tabs-img']).to.deep.equal([...block.children[1].classList]);
  });

  it('Render Tabs2', async () => {
    const block = document.querySelector('.hero-horizontal-tabs');

    const loc = {
      href: `${window.location.origin}/global-network/asia/`,
    };

    await scripts.default(block, loc);

    const nav = block.children[0].children[1];
    expect(nav.tagName).to.equal('NAV');
    expect(nav.children.length).to.equal(3);
    expect(nav.children[0].href.endsWith('/global-network/the-americas/')).to.be.true;
    expect([...nav.children[0].classList]).to.not.include('current');
    expect(nav.children[1].href.endsWith('/global-network/asia/')).to.be.true;
    expect([...nav.children[1].classList]).to.include('current');
    expect(nav.children[2].href.endsWith('/global-network/europe/')).to.be.true;
    expect([...nav.children[2].classList]).to.not.include('current');

    expect(['hero-horiz-tabs-img']).to.deep.equal([...block.children[1].classList]);
  });
});
