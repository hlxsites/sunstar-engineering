/* eslint-disable no-unused-expressions */
/* global describe before it */

import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const scripts = {};

document.write(await readFile({ path: './search-results.plain.html' }));

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
    const mod = await import('../../../blocks/search-results/search-results.js');
    Object
      .keys(mod)
      .forEach((func) => {
        scripts[func] = mod[func];
      });
  });

  it('Get Search Params', () => {
    const res = scripts.getSearchParams('?s=e+a&pg=1');
    expect(res.searchTerm).to.equal('e a');
    expect(res.curPage).to.equal(1);
  });

  it('Get Search Params Empty', () => {
    const res = scripts.getSearchParams('?');
    expect(res.curPage).to.equal(0);
    expect(res.searchTerm).to.be.null;
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
    expect(prevPg.tagName).to.equals('li');
    expect(prevPg.classList).to.deep.equal(new Set(['page', 'prev', 'disabled']));
    const prevPgA = prevPg.children[0];
    expect(prevPgA.tagName).to.equal('a');
    expect(prevPgA.href).to.be.undefined;

    const pg1 = navEl.children[1];
    expect(pg1.classList).to.include('active');

    const nextPg = navEl.children[2];
    expect(nextPg.tagName).to.equals('li');
    expect(nextPg.classList).to.deep.equal(new Set(['page', 'next', 'disabled']));
    const nextPgA = prevPg.children[0];
    expect(nextPgA.tagName).to.equal('a');
    expect(nextPgA.href).to.be.undefined;
  });

  it('Page generation', async () => {
    const placeholders = {
      resultstext_postfix: 'matches for',
    };
    window.placeholders = {
      'translation-loaded': {},
      translation: {
        en: placeholders,
      },
    };

    const queryIndex = /query-index.json\\?(.*)&sheet=en-search/;
    const mf = sinon.stub(window, 'fetch');
    mf.callsFake((v) => {
      if (queryIndex.test(v)) {
        return {
          ok: true,
          json: () => ({
            data: [
              { path: '/news/a/', pagename: 'a text', lastModified: 1685443971 },
              { path: '/news/b/', title: 'some b', lastModified: 1685443972 },
              { path: '/news/c/', breadcrumbtitle: 'c text', lastModified: 1685443973 },
              { path: '/news/d/', description: 'text of d', lastModified: 1685443974 },
            ],
          }),
        };
      }

      return {
        ok: false, json: () => ({ data: [] }), text: () => '',
      };
    });

    const block = document.querySelector('.search-results');
    const loc = {
      search: '?s=tex',
      pathname: '/search',
    };

    try {
      await scripts.default(block, loc);
    } finally {
      mf.restore();
    }

    const searchForm = block.children[0];
    expect(searchForm.nodeName).to.equal('FORM');
    expect(searchForm.classList.toString()).to.equal('search');

    const searchSummary = block.children[1];
    expect(searchSummary.nodeName).to.equal('H3');
    expect(searchSummary.classList.toString()).to.equal('search-summary');
    expect(searchSummary.innerHTML.trim()).to.equal('3 matches for "<strong>tex</strong>"');

    const res1 = block.children[2];
    expect(res1.nodeName).to.equal('DIV');
    expect(res1.classList.toString()).to.equal('search-result');
    const res1h3 = res1.children[0];
    expect(res1h3.nodeName).to.equal('H3');
    const res1h3a = res1h3.children[0];
    expect(res1h3a.nodeName).to.equal('A');
    expect(res1h3a.href.endsWith('/news/a/')).to.be.true;

    const res2 = block.children[3];
    expect(res2.nodeName).to.equal('DIV');
    expect(res2.classList.toString()).to.equal('search-result');
    const res2h3 = res2.children[0];
    expect(res2h3.nodeName).to.equal('H3');
    const res2h3a = res2h3.children[0];
    expect(res2h3a.nodeName).to.equal('A');
    expect(res2h3a.href.endsWith('/news/c/')).to.be.true;

    const res3 = block.children[4];
    expect(res3.nodeName).to.equal('DIV');
    expect(res3.classList.toString()).to.equal('search-result');
    const res3h3 = res3.children[0];
    expect(res3h3.nodeName).to.equal('H3');
    const res3h3a = res3h3.children[0];
    expect(res3h3a.nodeName).to.equal('A');
    expect(res3h3a.href.endsWith('/news/d/')).to.be.true;

    const pageWidget = block.children[5];
    expect(pageWidget.className.toString()).to.equal('pagination');
  });

  it('Page generation alt language', async () => {
    const placeholders = {
      resultstext_prefix: 'の検索結果',
      resultstext_postfix: '件',
      searchtext: '検索',
    };
    window.placeholders = {
      'translation-loaded': {},
      translation: {
        ja: placeholders,
      },
    };

    const queryIndex = /query-index.json\\?(.*)&sheet=ja-search/;
    const mf = sinon.stub(window, 'fetch');
    mf.callsFake((v) => {
      if (queryIndex.test(v)) {
        return {
          ok: true,
          json: () => ({
            data: [
              { path: '/ja/news/a/', title: 'a text', lastModified: 1685443971 },
              { path: '/ja/news/b/', title: 'some b', lastModified: 1685443972 },
              { path: '/ja/news/c/', title: 'c text', lastModified: 1685443973 },
            ],
          }),
        };
      }

      return {
        ok: false, json: () => ({ data: [] }), text: () => '',
      };
    });

    const block = document.querySelector('.search-results');
    const loc = {
      search: '?s=a',
      pathname: '/ja/search',
    };

    try {
      await scripts.default(block, loc, true);
    } finally {
      mf.restore();
    }

    const searchForm = block.children[0];
    expect(searchForm.nodeName).to.equal('FORM');
    expect(searchForm.classList.toString()).to.equal('search');

    const searchSummary = block.children[1];
    expect(searchSummary.nodeName).to.equal('H3');
    expect(searchSummary.classList.toString()).to.equal('search-summary');
    expect(searchSummary.innerHTML).to.equal('「<strong>a</strong>」 の検索結果 1件');

    const res1 = block.children[2];
    expect(res1.nodeName).to.equal('DIV');
    expect(res1.classList.toString()).to.equal('search-result');
    const res1h3 = res1.children[0];
    expect(res1h3.nodeName).to.equal('H3');
    const res1h3a = res1h3.children[0];
    expect(res1h3a.nodeName).to.equal('A');
    expect(res1h3a.href.endsWith('/ja/news/a/')).to.be.true;

    const pageWidget = block.children[3];
    expect(pageWidget.className.toString()).to.equal('pagination');
  });
});
