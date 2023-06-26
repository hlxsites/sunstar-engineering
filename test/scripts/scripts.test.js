/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const scripts = {};

document.body.innerHTML = await readFile({ path: './dummy.html' });

describe('Scripts', () => {
  before(async () => {
    const mod = await import('../../scripts/scripts.js');
    Object
      .keys(mod)
      .forEach((func) => {
        scripts[func] = mod[func];
      });
  });

  it('Converts HTML to an element', () => {
    const el = scripts.htmlToElement('<div>hi</div>');
    expect(el.constructor.name).to.equal('HTMLDivElement');
  });

  it('Creates the Search widget without value', () => {
    const placeholders = {
      emptysearchtext: 'Cannot be empty',
      searchtext: 'MySearch',
    };

    const form = scripts.getSearchWidget(placeholders);
    expect(new URL(form.action).pathname).to.equal('/search');

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].type).to.equal('text');
    expect(it[0].value).to.equal('');
    expect(it[0].placeholder).to.equal('MySearch');
    expect(it[0].oninvalid.toString().replace(/(\r\n|\n|\r)/gm, ''))
      .to.equal('function oninvalid(event) {this.setCustomValidity(\'Cannot be empty\')}');
  });

  it('Creates the Search widget with value', () => {
    const form = scripts.getSearchWidget({}, 'hello', true, 'de');
    expect(new URL(form.action).pathname).to.equal('/de/search');

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].type).to.equal('search');
    expect(it[0].value).to.equal('hello');
  });

  it('Fix Excel Filter Zeroes', () => {
    const data = [
      {
        unrelated: 0,
        description: '0',
        breadcrumbtitle: '0',
        newsdate: '0',
      },
      {
        unrelated: 0,
        description: '0 Mydesc 0',
        breadcrumbtitle: '',
        newsdate: '12345',
      },
    ];

    scripts.fixExcelFilterZeroes(data);

    expect(data[0].unrelated).to.equal(0);
    expect(data[0].description).to.equal('');
    expect(data[0].breadcrumbtitle).to.equal('');
    expect(data[0].newsdate).to.equal('');

    expect(data[1].unrelated).to.equal(0);
    expect(data[1].description).to.equal('0 Mydesc 0');
    expect(data[1].breadcrumbtitle).to.equal('');
    expect(data[1].newsdate).to.equal('12345');
  });

  it('Extracts the correct language from the path', () => {
    let lang = scripts.getLanguageFromPath('/en/');
    expect(lang).to.equal('en');
    lang = scripts.getLanguageFromPath('/de/foo');
    expect(lang).to.equal('en');
    lang = scripts.getLanguageFromPath('/de/foo', true);
    expect(lang).to.equal('de');
  });
});
