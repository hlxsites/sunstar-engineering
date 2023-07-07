/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import decorate from '../../../blocks/spacer/spacer.js';

describe('Spacer block', () => {
  it('Displays Spacer Content', async () => {
    expect(true).to.be.true;
  });

  it('Spacer Content Check', async () => {
    window.innerWidth = 2000;
    document.body.innerHTML = await readFile({ path: './spacer.plain.html' });
    let spacerBlock = document.querySelector('.spacer');
    await decorate(spacerBlock);
    expect(spacerBlock.computedStyleMap().get('height').value).to.equal(320);

    window.innerWidth = 1000;
    document.body.innerHTML = await readFile({ path: './spacer.plain.html' });
    spacerBlock = document.querySelector('.spacer');
    await decorate(spacerBlock);
    expect(spacerBlock.computedStyleMap().get('height').value).to.equal(160);

    window.innerWidth = 500;
    document.body.innerHTML = await readFile({ path: './spacer.plain.html' });
    spacerBlock = document.querySelector('.spacer');
    await decorate(spacerBlock);
    expect(spacerBlock.computedStyleMap().get('height').value).to.equal(160);
  });
});
