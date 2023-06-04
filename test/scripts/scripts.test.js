/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { htmlToElement } from '../../scripts/scripts.js';

describe('Scripts', () => {
  it('Converts HTML to an element', () => {
    const el = htmlToElement('<div>hi</div>');
    expect(el.constructor.name).to.equal('HTMLDivElement');
  });
});
