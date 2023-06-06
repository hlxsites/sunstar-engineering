/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getSearchWidget, htmlToElement } from '../../scripts/scripts.js';

describe('Scripts', () => {
  it('Converts HTML to an element', () => {
    const el = htmlToElement('<div>hi</div>');
    expect(el.constructor.name).to.equal('HTMLDivElement');
  });

  it('Creates the Search widget without value', () => {
    const form = getSearchWidget();
    expect(form.action.endsWith('/search')).to.be.true;

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].value).to.equal('');
  });

  it('Creates the Search widget with value', () => {
    const form = getSearchWidget('hello');

    const div = form.children[0];
    const it = div.getElementsByClassName('search-text');
    expect(it[0].value).to.equal('hello');
  });
});
