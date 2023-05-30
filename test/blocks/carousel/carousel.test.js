/* eslint-disable no-unused-expressions */
/* global describe it */

import { assert, expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import decorate from '../../../blocks/carousel/carousel.js';

document.write(await readFile({ path: './carousel.plain.html' }));

const block = document.querySelector('.carousel');
await decorate(block);

describe('Carousel Block', () => {
  it('Text items should be 3', async () => {
    assert.isDefined(block.querySelector('.text-item'));
    expect(block.querySelectorAll('.text-item').length).equal(3);
  });

  it('Image items should be 3', async () => {
    assert.isDefined(block.querySelector('.image-item'));
    expect(block.querySelectorAll('.image-item').length).equal(3);
  });

  it('Bullets should be 3', async () => {
    assert.isDefined(block.querySelector('.swiper-pagination-bullet'));
    expect(block.querySelectorAll('.swiper-pagination-bullet').length).equal(3);
  });

  it('Right Icon should activate next text item and image item', async () => {
    block.querySelector('.swip-right').click();
    const textItems = block.querySelectorAll('.text-item');
    const imageItems = block.querySelectorAll('.image-item');

    expect(textItems[1].classList.contains('active')).equal(true);
    expect(textItems[1].classList.contains('unhide')).equal(true);
    expect(imageItems[1].classList.contains('active')).equal(true);
    expect(imageItems[1].classList.contains('unhide')).equal(true);
  });

  it('Left Icon should activate previoud text item and image item', async () => {
    block.querySelector('.swip-right').click();
    const textItems = block.querySelectorAll('.text-item');
    const imageItems = block.querySelectorAll('.image-item');

    expect(textItems[2].classList.contains('active')).equal(true);
    expect(textItems[2].classList.contains('unhide')).equal(true);
    expect(imageItems[2].classList.contains('active')).equal(true);
    expect(imageItems[2].classList.contains('unhide')).equal(true);
  });

  it('Left Icon should activate previoud text item and image item', async () => {
    const paginationBullet = block.querySelectorAll('.swiper-pagination-bullet');
    paginationBullet[1].click();
    const textItems = block.querySelectorAll('.text-item');
    const imageItems = block.querySelectorAll('.image-item');

    expect(textItems[1].classList.contains('active')).equal(true);
    expect(textItems[1].classList.contains('unhide')).equal(true);
    expect(imageItems[1].classList.contains('active')).equal(true);
    expect(imageItems[1].classList.contains('unhide')).equal(true);
  });
});
