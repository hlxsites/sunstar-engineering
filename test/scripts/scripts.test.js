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
    const form = scripts.getSearchWidget();
    expect(form.action.endsWith('/search')).to.be.true;

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].type).to.equal('text');
    expect(it[0].value).to.equal('');
  });

  it('Creates the Search widget with value', () => {
    const form = scripts.getSearchWidget('hello', true);

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].type).to.equal('search');
    expect(it[0].value).to.equal('hello');
  });
});
