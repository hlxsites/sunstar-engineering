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
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
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

  const breadcrumb = document.querySelector('.section-breadcrumb');
  if (breadcrumb) {
    const breadcrumbItems = breadcrumb.querySelectorAll('.ss-breadcrumb .breadcrumb-item');
    if (breadcrumbItems && breadcrumbItems.length) {
      const breadcrumbText = breadcrumbItems[breadcrumbItems.length - 1].textContent.trim();
      meta.BreadcrumbTitle = breadcrumbText;
    }
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function createSectionMetadata(cfg, doc) {
  const cells = [['Section Metadata']];
  Object.keys(cfg).forEach((key) => {
    cells.push([key, cfg[key]]);
  });
  return WebImporter.DOMUtils.createTable(cells, doc);
}

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

    const imageItemsFromDoc = doc.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .img-content');
    let imageItems = imageItemsFromDoc.length ? [...imageItemsFromDoc] : [];
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
    heroSlider.after(createSectionMetadata({ Style: 'Full Width ' }, doc));
    heroSlider.replaceWith(table);
  }
}

function addBreadCrumb(doc) {
  const breadcrumb = doc.querySelector('.section-breadcrumb');

  if (breadcrumb) {
    // Not removing breadcrumb section from here because we need to extract breadcrumb title.
    const cells = [['Breadcrumb']];
    const table = WebImporter.DOMUtils.createTable(cells, doc);
    breadcrumb.after(doc.createElement('hr'));
    breadcrumb.replaceWith(table);
  }
}

function removeCookiesBanner(document) {
  // remove the cookies banner
  const cookieBanner = document.querySelector('.cookies-wrapper.cookies-wrapper-js');
  if (cookieBanner) {
    cookieBanner.remove();
  }
}

/**
 * Extract background images from the source node and
 * replace them with foreground images in the target node.
 * @param {Node} sourceNode The node to extract background images from
 * @param {Node} targetNode The node to use for inlining the images
 */
function convertBackgroundImgsToForegroundImgs(sourceNode, targetNode = sourceNode) {
  const bgImgs = sourceNode.querySelectorAll('.background-image');
  // workaround for inability of importer to handle styles
  // with whitespace in the url
  [...bgImgs].forEach((bgImg) => {
    bgImg.getAttribute('style').split(';').forEach((style) => {
      const [prop, value] = style.split(':');
      if (prop === 'background-image') {
        const withoutSpaces = value.replace(/\s/g, '');
        bgImg.style.backgroundImage = withoutSpaces;
      }
    });
    console.log(`inlining images for ${bgImg.outerHTML}`);
    WebImporter.DOMUtils.replaceBackgroundByImg(bgImg, targetNode);
  });
}

/**
 * Creates a column block from a section if it contains two columns _only_
 * @param {HTMLDocument} document The document
 */
function createColumnBlockFromSection(document) {
  document.querySelectorAll('div.section-container').forEach((section) => {
    const block = [['Columns']];
    /* create a column block from the section
       but only if it contains
       * two columns
       * isn't a hero section
       * doesn't have an embed
     */
    const heroParent = Array.from(section.parentElement.classList)
      .filter((s) => /hero/.test(s)).length;
    const hasEmbed = !!section.querySelector('.wp-block-embed');
    const contentColumns = Array.from(section.children)
      .filter(
        (el) => (el.tagName === 'DIV'
          || el.tagName === 'FIGURE'
          || el.tagName === 'IMG'),
      );
    if (!heroParent && !hasEmbed && contentColumns
      && contentColumns.length === 2
      && section.children.length === 2
      && section.querySelectorAll('p').length !== 0) {
      const columnItem = [];
      contentColumns.forEach((column) => {
        columnItem.push(column);
      });
      block.push(columnItem);
      if (section.querySelectorAll('.background-image').length) {
        block[0][0] += ' (constrain-width)';
      }
      const table = WebImporter.DOMUtils.createTable(block, document);
      convertBackgroundImgsToForegroundImgs(table, document);
      section.replaceWith(table);
    }
  });
}

function customImportLogic(doc) {
  removeCookiesBanner(doc);

  addBreadCrumb(doc);
  addCarouselItems(doc);

  createColumnBlockFromSection(doc);
  convertBackgroundImgsToForegroundImgs(doc);
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
    // create the metadata block and append it to the main element
    createMetadata(main, document);
    customImportLogic(document);

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
