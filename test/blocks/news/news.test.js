/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import decorate from '../../../blocks/news/news.js';

document.write(await readFile({ path: './news.plain.html' }));

describe('News Block', () => {
  it('Latest news article', async () => {
    const queryIndex = '/query-index.json';

    const mf = sinon.stub(window, 'fetch');
    mf.callsFake((v) => {
      if (v.startsWith(queryIndex)) {
        return {
          ok: true,
          json: () => ({
            data: [
              { path: '/news/b/', title: 'b text', lastModified: 1685443972 },
              { path: '/news/a/', title: 'a text', lastModified: 1685443971 },
              { path: '/c/news/', title: 'c text', lastModified: 1685443970 },
            ],
          }),
        };
      }
      throw Error('Unexpected fetch arg');
    });

    try {
      const placeholders = {
        newstext: 'MyNews',
      };
      window.placeholders = {
        'translation-loaded': {},
        translation: {
          en: placeholders,
        },
      };

      const block = document.querySelector('.news');
      await decorate(block);

      const spans = block.querySelectorAll('span');
      expect(spans[0].innerText).to.equal('MyNews');
      expect(spans[1].innerText).to.equal('May 30, 2023');

      const link = block.querySelector('a');
      expect(link.href.endsWith('/news/a/')).to.be.true;
      expect(link.innerText).to.equal('a text');
    } finally {
      mf.restore();
    }
  });
});
