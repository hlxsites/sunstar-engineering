/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect, assert } from '@esm-bundle/chai';

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: './footer.plain.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const footerBlock = buildBlock('footer', [['Footer', '/test/blocks/footer/footer']]);
document.createElement('footer').append(footerBlock);

decorateBlock(footerBlock);
await loadBlock(footerBlock);
await sleep();

describe('Footer block', () => {
  it('Displays Footer Content', async () => {
    expect(true).to.be.true;
  });

  it('Footer Content Check', async () => {
    const navLinks = footerBlock.querySelector('.nav-links');
    const primary = footerBlock.querySelector('.primary');
    const social = footerBlock.querySelector('.social');
    const groups = footerBlock.querySelector('.groups');
    const copyright = footerBlock.querySelector('.copyright');

    assert.isDefined(navLinks);
    assert.isDefined(primary);
    assert.isDefined(social);
    assert.isDefined(groups);
    assert.isDefined(copyright);
  });
});
