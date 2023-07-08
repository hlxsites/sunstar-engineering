/* eslint-disable no-unused-expressions */
/* global describe before it */

import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const scripts = {};

document.write(await readFile({ path: './kv-list.plain.html' }));

describe('KV-list', () => {
  before(async () => {
    const mod = await import('../../../blocks/kv-list/kv-list.js');
    Object
      .keys(mod)
      .forEach((func) => {
        scripts[func] = mod[func];
      });
  });

  it('Block rendering', async () => {
    const block = document.querySelector('.kv-list');

    await scripts.default(block);

    expect(block.children.length).to.equal(6);
    const pk = block.children[0];
    expect(pk.tagName).to.equal('H3');
    expect(pk.textContent).to.equal('PlainKey:');
    const pv = block.children[1];
    expect(pv.tagName).to.equal('P');
    expect(pv.innerHTML).to.equal('PlainVal');

    const mlKey = block.children[2];
    expect(mlKey.innerHTML).to.equal('MLKey :');
    const mlVal = block.children[3];
    expect(mlVal.innerHTML).to.equal('a<br>b<br>c');

    const linkKey = block.children[4];
    expect(linkKey.textContent).to.equal('Link Key:');
    const linkVal = block.children[5];
    expect(linkVal.innerHTML).to.equal('<a href="mailto:contact@foobar.com">contact@foobar.com</a>');
  });
});
