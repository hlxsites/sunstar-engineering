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

const createMetadata = (main, document, params) => {
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

  if (params.preProcessMetadata && Object.keys(params.preProcessMetadata).length) {
    Object.assign(meta, params.preProcessMetadata);
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

function addHeroHorizontalTabs(doc) {
  const heroTab = doc.querySelector('.hero-tab');
  if (!heroTab) {
    return;
  }
  const heroCont = heroTab.previousElementSibling;

  if (heroTab.tagName !== 'SECTION' || heroCont.tagName !== 'SECTION') {
    return;
  }

  const cells = [['Hero-horizontal-tabs']];
  const ul = doc.createElement('ul');
  heroTab.querySelectorAll('a').forEach((a) => {
    const li = doc.createElement('li');
    const newa = doc.createElement('a');
    newa.href = a.href;
    newa.textContent = a.textContent;
    li.appendChild(newa);
    ul.appendChild(li);
  });
  cells.push(['Tabs', ul]);

  const img = heroCont.querySelector('.img-content');
  cells.push(['Image', img]);
  const info = heroCont.querySelector('.info-content');
  cells.push(['Contents', info]);

  const table = WebImporter.DOMUtils.createTable(cells, doc);

  heroTab.after(doc.createElement('hr'));
  heroTab.after(createSectionMetadata({ Style: 'Full Width ' }, doc));
  heroTab.replaceWith(table);
  heroCont.remove();
}

function addCarouselItems(document) {
  const heroSlider = document.querySelector('.hero-one-slider');

  if (heroSlider) {
    const textItemsFromDoc = document.querySelectorAll('.info-content');
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

    const imageItemsFromDoc = document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .img-content');
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

    const table = WebImporter.DOMUtils.createTable(cells, document);
    heroSlider.after(document.createElement('hr'));
    heroSlider.after(createSectionMetadata({ Style: 'Full Width ' }, document));
    heroSlider.replaceWith(table);
  }
}

function extractEmbed(document) {
  const embedItems = document.querySelectorAll('.wp-block-embed');

  if (embedItems && embedItems.length) {
    embedItems.forEach((embedItem, index) => {
      const iframes = embedItem.getElementsByTagName('iframe');

      if (iframes && iframes.length) {
        const cells = [['Embed']];
        const anchor = document.createElement('a');
        anchor.href = iframes[0].src;
        anchor.textContent = iframes[0].src;
        cells.push([anchor]);

        const table = WebImporter.DOMUtils.createTable(cells, document);
        embedItem.before(document.createElement('hr'));
        embedItem.replaceWith(table);

        if (embedItem.querySelector('figcaption')) {
          const p = document.createElement('p');
          p.textContent = embedItem.querySelector('figcaption').textContent;
          table.after(p);
          if (index === embedItems.length - 1) {
            // To Handle insertion of hr after last element is caption is present.
            p.after(document.createElement('hr'));
          }
        } else if (index === embedItems.length - 1) {
          // To Handle insertion of hr after last element also
          table.after(document.createElement('hr'));
        }
      }
    });
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
  const bgImgs = sourceNode.querySelectorAll('.background-image, .mobile-content');
  // workaround for inability of importer to handle styles
  // with whitespace in the url
  [...bgImgs].forEach((bgImg) => {
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
       * doesn't have lists
     */
    const heroParent = Array.from(section.parentElement.classList)
      .filter((s) => /hero/.test(s)).length;
    const hasEmbed = !!section.querySelector('.wp-block-embed');
    const hasLists = !!section.querySelector('ul');
    const contentColumns = Array.from(section.children)
      .filter(
        (el) => (el.tagName === 'DIV'
          || el.tagName === 'FIGURE'
          || el.tagName === 'IMG'),
      );
    if (!heroParent && !hasEmbed && !hasLists && contentColumns
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

/**
 * Creates a cards block from a section
 * @param {HTMLDocument} document The document
 */
function createCardsBlockFromSection(document) {
  document.querySelectorAll('div.section-container').forEach((section) => {
    const block = [['Cards']];
    // create a cards block from the section

    const sectionIsCard = section.parentElement.className.includes('wp-block-sunstar-blocks-home-engineering-solution');
    if (sectionIsCard) {
      const contentCards = Array.from(section.children)
        .filter(
          (el) => (el.tagName === 'DIV' || el.tagName === 'FIGURE' || el.tagName === 'IMG'),
        );
      const headerContainer = contentCards[0];
      const cardsContainer = contentCards[1];
      Array.from(cardsContainer.children).forEach((card) => {
        let img = card.querySelector('img');
        const imgSrc = img.getAttribute('src');
        if (imgSrc.includes('.svg')) {
          // extract the svg file name
          const svgFileName = imgSrc.split('/').pop().split('.')[0];
          // replace the img tag with an icon
          img = `:${svgFileName}:`;
        }
        const title = card.querySelector('h6').textContent;
        card.replaceChildren(title);
        block.push([img, card]);
      });
      const table = WebImporter.DOMUtils.createTable(block, document);
      convertBackgroundImgsToForegroundImgs(table, document);
      section.replaceWith(headerContainer, table);
    }
  });
}

function addListBlock(document) {
  const newsSection = document.querySelector('.section-news');
  if (newsSection) {
    const titleArea = document.querySelector('.title-area');
    titleArea.remove();
    const cells = [['List (News)']];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    newsSection.after(document.createElement('hr'));
    newsSection.replaceWith(table);
  }
}

/**
 * Creates an image-variants block from a section if it contains different
 * images for wide (desktop) and narrow (mobile) devices
 * @param {HTMLDocument} document The document
 */
function createImgVariantsBlockFromSection(document) {
  document.querySelectorAll('div.section-container .mobile-content').forEach((node) => {
    const nextElement = node.nextElementSibling;
    const parent = node.parentElement;
    const nextSection = parent.closest('section').nextElementSibling;
    const nextSectionImg = nextSection.querySelector('.content-image');
    if (nextSectionImg) {
      const block = [['Image Variants']];

      const narrowItem = [];
      narrowItem.push('Narrow');
      narrowItem.push(node);
      block.push(narrowItem);

      const wideItem = [];
      wideItem.push('Wide');
      wideItem.push(nextSectionImg);
      const hasBackground = !!nextSection.querySelector('.content-bg');
      if (hasBackground) {
        wideItem[0] += ', background';
      }
      block.push(wideItem);

      const table = WebImporter.DOMUtils.createTable(block, document);
      convertBackgroundImgsToForegroundImgs(table, document);
      parent.insertBefore(table, nextElement);

      parent.before(document.createElement('hr'));
      const sectionStyling = { Style: 'Centered' };
      if (hasBackground) {
        sectionStyling.Style += ', Full Width';
      }
      const sectionMetadata = createSectionMetadata(sectionStyling, document);
      nextSection.after(sectionMetadata);
      sectionMetadata.after(document.createElement('hr'));
    }
  });
}

function changeNewsSocial(document) {
  const socialShare = document.querySelector('.social-share');
  if (socialShare) {
    const socialLinks = socialShare.querySelectorAll('a');
    if (socialLinks && socialLinks.length) {
      const cells = [['Social']];

      socialLinks.forEach((x) => {
        const img = x.querySelector('img');
        if (img) {
          const url = img.src;
          const startIndex = url.lastIndexOf('/') + 1;
          const extensionIndex = url.lastIndexOf('.svg');
          const filename = url.substring(startIndex, extensionIndex);
          cells.push([filename, x.href]);
        }
      });

      const table = WebImporter.DOMUtils.createTable(cells, document);
      socialShare.replaceWith(table);
    }
  }
}

function customImportLogic(doc) {
  removeCookiesBanner(doc);

  addBreadCrumb(doc);
  addListBlock(doc);
  addCarouselItems(doc);
  addHeroHorizontalTabs(doc);

  createCardsBlockFromSection(doc);
  createColumnBlockFromSection(doc);
  createImgVariantsBlockFromSection(doc);
  extractEmbed(doc);
  convertBackgroundImgsToForegroundImgs(doc);
  changeNewsSocial(doc);
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

  preprocess: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const schemaDetails = document.querySelector('head script.aioseo-schema');
    const metadataDetails = {};

    if (schemaDetails) {
      const jsonSchema = JSON.parse(schemaDetails.innerText);
      const graphNode = jsonSchema['@graph'];

      if (graphNode) {
        graphNode.forEach((node) => {
          const nodeType = node['@type'];
          const { pathname } = new URL(url);

          if (nodeType === 'BreadcrumbList' && node.itemListElement && node.itemListElement.length) {
            const lastItem = node.itemListElement[node.itemListElement.length - 1];
            const lastItemDetails = lastItem.item;

            if (lastItemDetails) {
              metadataDetails.PageName = lastItemDetails.name;
            }
          } else if (nodeType === 'WebPage' && pathname.includes('/news') && node.datePublished) {
            metadataDetails.NewsDate = new Date(node.datePublished).getTime();
          }
        });
      }

      params.preProcessMetadata = metadataDetails;
    }
  },

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
    createMetadata(main, document, params);
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
