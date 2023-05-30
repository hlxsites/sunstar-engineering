/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function addCarouselItems(doc) {
  const heroSlider = doc.querySelector('.hero-one-slider');

  if (heroSlider) {
    const textItemsFromDoc = doc.querySelectorAll('.info-content');
    let textItems = textItemsFromDoc.length ? [...textItemsFromDoc] : [];
    textItems = textItems.map((x) => {
      const div = document.createElement('div');
      if (x.querySelector('h6')) {
        const h1 = document.createElement('h1');
        h1.textContent = x.querySelector('h6').textContent;
        div.appendChild(h1);
      }

      if (x.querySelector('h2')) {
        const h2 = document.createElement('h2');
        h2.textContent = x.querySelector('h2').textContent;
        div.appendChild(h2);
      }

      if (x.querySelector('p')) {
        const p = document.createElement('p');
        p.textContent = x.querySelector('p').textContent;
        div.appendChild(p);
      }

      if (x.querySelector('a')) {
        const a = document.createElement('a');
        a.textContent = x.querySelector('a').textContent;
        a.href = x.querySelector('a').href;
        div.appendChild(a);
      }

      return div;
    });

    const imageItemsFromDoc = doc.querySelectorAll('.img-content');
    let imageItems = imageItemsFromDoc.length ? [...imageItemsFromDoc].slice(1, -1) : [];
    imageItems = imageItems.map((x) => {
      const div = document.createElement('div');
      div.appendChild(WebImporter.DOMUtils.replaceBackgroundByImg(x, document));
      return div;
    });

    const cells = [['Carousel']];

    textItems.forEach((item, index) => {
      cells.push([item.innerHTML, imageItems[index].innerHTML]);
    });

    const table = WebImporter.DOMUtils.createTable(cells, doc);
    heroSlider.after(doc.createElement('hr'));
    heroSlider.replaceWith(table);
  }
}

function addBreadCrumb(doc) {
  const breadcrumb = doc.querySelector('.section-breadcrumb');

  if (breadcrumb) {
    const cells = [['Breadcrumb']];
    const table = WebImporter.DOMUtils.createTable(cells, doc);
    breadcrumb.after(doc.createElement('hr'));
    breadcrumb.replaceWith(table);
  }
}

function customImportLogic(doc) {
  // remove the cookies banner
  const cookieBanner = doc.querySelector('.cookies-wrapper.cookies-wrapper-js');
  if (cookieBanner) {
    cookieBanner.remove();
  }

  addBreadCrumb(doc);
  addCarouselItems(doc);
}
export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'noscript',
    ]);
    customImportLogic(document);
    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
