/* eslint-disable no-unused-expressions */
/* global describe before it */

import { expect } from '@esm-bundle/chai';

const scripts = {};
function mockElement(name) {
  const el = {
    tagName: name,
    classList: new Set(),
    children: [],
  };
  el.appendChild = (c) => {
    el.children.push(c);
  };
  return el;
}

describe('Search Results', () => {
  before(async () => {
    const mod = await import('../../scripts/lib-franklin.js');
    Object
      .keys(mod)
      .forEach((func) => {
        scripts[func] = mod[func];
      });
  });

  it('Paging widget 1', () => {
    const parentDiv = mockElement('div');
    const doc = {
      createElement: mockElement,
    };
    const loc = {
      search: '?lang=de',
      pathname: '/search',
    };

    scripts.addPagingWidget(parentDiv, 0, 2, doc, loc);

    const navEl = parentDiv.children[0];
    expect(navEl.tagName).to.equal('ul');
    expect(navEl.classList).to.deep.equal(new Set(['pagination']));

    const prevPg = navEl.children[0];
    expect(prevPg.tagName).to.equals('li');
    expect(prevPg.classList).to.deep.equal(new Set(['page', 'prev', 'disabled']));
    const prevPgA = prevPg.children[0];
    expect(prevPgA.tagName).to.equal('a');
    expect(prevPgA.href).to.be.undefined;

    const pg1 = navEl.children[1];
    expect(pg1.tagName).to.equal('li');
    expect(pg1.classList).to.deep.equal(new Set(['active']));
    const pg1a = pg1.children[0];
    expect(pg1a.innerText).to.equal(1);
    expect(pg1a.href).to.equal('/search?lang=de&pg=0');

    const pg2 = navEl.children[2];
    expect(pg2.tagName).to.equal('li');
    const pg2a = pg2.children[0];
    expect(pg2a.innerText).to.equal(2);
    expect(pg2a.href).to.equal('/search?lang=de&pg=1');

    const nextPg = navEl.children[3];
    expect(nextPg.tagName).to.equal('li');
    expect(nextPg.classList).to.deep.equal(new Set(['page', 'next']));
    const nextPgA = nextPg.children[0];
    expect(nextPgA.tagName).to.equal('a');
    expect(nextPgA.href).to.equal('/search?lang=de&pg=1');
  });

  it('Paging widget 2', () => {
    const parentDiv = mockElement('div');
    const doc = {
      createElement: mockElement,
    };
    const loc = {
      search: '?s=xyz&pg=1',
      pathname: '/search',
    };

    scripts.addPagingWidget(parentDiv, 1, 3, doc, loc);

    const navEl = parentDiv.children[0];
    expect(navEl.tagName).to.equal('ul');
    expect(navEl.classList).to.deep.equal(new Set(['pagination']));

    const prevPg = navEl.children[0];
    expect(prevPg.tagName).to.equals('li');
    expect(prevPg.classList).to.deep.equal(new Set(['page', 'prev']));
    const prevPgA = prevPg.children[0];
    expect(prevPgA.tagName).to.equal('a');
    expect(prevPgA.href).to.equal('/search?s=xyz&pg=0');

    const pg1 = navEl.children[1];
    expect(pg1.classList).to.not.include('active');
    const pg2 = navEl.children[2];
    expect(pg2.classList).to.include('active');
    const pg3 = navEl.children[3];
    expect(pg3.classList).to.not.include('active');

    const nextPg = navEl.children[4];
    expect(nextPg.classList).to.deep.equal(new Set(['page', 'next']));
    const nextPgA = nextPg.children[0];
    expect(nextPgA.href).to.equal('/search?s=xyz&pg=2');
  });

  it('Paging widget 3', () => {
    const parentDiv = mockElement('div');
    const doc = {
      createElement: mockElement,
    };
    const loc = {
      search: '?s=xyz&pg=999&lang=fr',
      pathname: '/search',
    };

    scripts.addPagingWidget(parentDiv, 0, 1, doc, loc);
    const navEl = parentDiv.children[0];
    expect(navEl.tagName).to.equal('ul');
    expect(navEl.classList).to.deep.equal(new Set(['pagination']));

    const prevPg = navEl.children[0];
    expect(prevPg).to.be.undefined;

    const pg1 = navEl.children[1];
    expect(pg1).to.be.undefined;
  });
});
