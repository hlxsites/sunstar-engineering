import { fetchPlaceholders, getFormattedDate } from '../../scripts/lib-franklin.js';
import {
  fetchIndex,
  fixExcelFilterZeroes,
  getLanguage,
  getSearchWidget,
  addPagingWidget,
} from '../../scripts/scripts.js';

export function getSearchParams(searchParams) {
  let curPage = new URLSearchParams(searchParams).get('pg');
  if (!curPage) {
    curPage = 0;
  } else {
    // convert the current page to a number
    curPage = parseInt(curPage, 10);
  }

  const searchTerm = new URLSearchParams(searchParams).get('s');
  return { searchTerm, curPage };
}

/**
 * Sets a value in a HTML Element which highlights the search term
 * using <strong> tags.
 * @param {HTMLElement} el The element to set it in
 * @param {string} value The value to set in it
 * @param {string} term The search term
 */
function setResultValue(el, value, term) {
  // Put the description in as text and then read out the HTML
  // and modify the HTML to add the strong tag. This to avoid
  // injection of tags from the index.

  el.innerText = value;
  const txtHTML = el.innerHTML;

  const regex = new RegExp(`(${term})`, 'ig');
  el.innerHTML = txtHTML.replaceAll(regex, '<strong>$1</strong>');
}

function formatSearchResultCount(num, placeholders, term, lang) {
  if (lang === 'ja') {
    return `「<strong>${term}</strong>」 ${placeholders.resultstext_prefix} ${num}${placeholders.resultstext_postfix}`;
  }
  if (lang === 'cn') {
    return `"<strong>${term}</strong>" ${placeholders.resultstext_prefix} ${num}${placeholders.resultstext_postfix}`;
  }
  return `${placeholders.resultstext_prefix ?? ''} ${num} ${placeholders.resultstext_postfix} "<strong>${term}</strong>"`;
}

async function searchPages(placeholders, term, page) {
  const sheet = `${getLanguage()}-search`;

  const json = await fetchIndex('query-index', sheet);
  fixExcelFilterZeroes(json.data);

  const resultsPerPage = 10;
  const startResult = page * resultsPerPage;

  const result = json.data
    .filter((entry) => `${entry.description} ${entry.pagename} ${entry.breadcrumbtitle} ${entry.title}`.toLowerCase()
      .includes(term.toLowerCase()));

  const div = document.createElement('div');

  const summary = document.createElement('h3');
  summary.classList.add('search-summary');
  summary.innerHTML = formatSearchResultCount(result.length, placeholders, term, getLanguage());
  div.appendChild(summary);

  const curPage = result.slice(startResult, startResult + resultsPerPage);

  curPage.forEach((line) => {
    const res = document.createElement('div');
    res.classList.add('search-result');
    const header = document.createElement('h3');
    const link = document.createElement('a');
    const searchTitle = line.pagename || line.breadcrumbtitle || line.title;
    setResultValue(link, searchTitle, term);
    link.href = line.path;
    const path = line.path || '';
    const parentPath = path && path.lastIndexOf('/') > -1 ? path.slice(0, path.lastIndexOf('/')) : '';
    let parentSpan;
    let childSpan;

    if (parentPath) {
      const parentfiltered = json.data.filter((x) => x.path === parentPath);

      if (parentfiltered && parentfiltered.length && parentfiltered[0].breadcrumbtitle) {
        parentSpan = document.createElement('span');
        parentSpan.textContent = parentfiltered[0].breadcrumbtitle;
      }
    }

    if (path) {
      const selfFiltered = json.data.filter((x) => x.path === path);

      if (selfFiltered && selfFiltered.length && selfFiltered[0].newsdate) {
        childSpan = document.createElement('span');
        // TODO handle localization here
        childSpan.textContent = getFormattedDate(new Date(Number(selfFiltered[0].newsdate)));
      }
    }

    if (parentSpan && childSpan) {
      const p = document.createElement('p');
      p.classList.add('parent-detail');
      parentSpan.classList.add('news-date');
      p.appendChild(parentSpan);
      p.appendChild(childSpan);
      res.appendChild(p);
    } else if (parentSpan) {
      const p = document.createElement('p');
      p.classList.add('parent-detail');
      p.appendChild(parentSpan);
      res.appendChild(p);
    } else if (childSpan) {
      const p = document.createElement('p');
      p.classList.add('parent-detail');
      p.appendChild(childSpan);
      res.appendChild(p);
    }

    header.appendChild(link);
    res.appendChild(header);
    const para = document.createElement('p');
    setResultValue(para, line.description, term);

    res.appendChild(para);
    div.appendChild(res);
  });

  const totalResults = result.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  addPagingWidget(div, page, totalPages);

  return div.children;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(
  block,
  curLocation = window.location,
  resetLanguageCache = false,
) {
  const { searchTerm, curPage } = getSearchParams(curLocation.search);
  const placeholders = await fetchPlaceholders(getLanguage(
    curLocation.pathname,
    resetLanguageCache,
  ));

  block.innerHTML = '';
  block.append(getSearchWidget(placeholders, searchTerm, true));

  if (searchTerm) {
    const results = await searchPages(placeholders, searchTerm, curPage);
    block.append(...results);
  }
}
