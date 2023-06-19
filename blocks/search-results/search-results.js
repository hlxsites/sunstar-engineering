import { fetchIndex, getSearchWidget } from '../../scripts/scripts.js';

// Exclude these path prefixes from the search results
const searchExcludedPrefixes = ['/nav', '/_drafts/'];

function getSearchParams() {
  let curPage = new URLSearchParams(window.location.search).get('pg');
  if (!curPage) {
    curPage = 0;
  } else {
    // convert the current page to a number
    curPage = parseInt(curPage, 10);
  }

  const searchTerm = new URLSearchParams(window.location.search).get('s');
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

function addPagingWidget(div, curpage, totalPages) {
  const queryParams = new URLSearchParams(window.location.search);

  const nav = document.createElement('ul');
  nav.classList.add('pagination');

  const lt = document.createElement('li');
  lt.classList.add('page', 'prev');
  const lta = document.createElement('a');
  if (curpage === 0) {
    lt.classList.add('disabled');
  } else {
    queryParams.set('pg', curpage - 1);
    lta.href = `${window.location.pathname}?${queryParams}`;
  }
  lt.appendChild(lta);

  nav.appendChild(lt);

  for (let i = 0; i < totalPages; i += 1) {
    const numli = document.createElement('li');
    if (i === curpage) {
      numli.classList.add('active');
    }

    const a = document.createElement('a');
    a.innerText = i + 1;

    queryParams.set('pg', i);
    a.href = `${window.location.pathname}?${queryParams}`;
    numli.appendChild(a);

    nav.appendChild(numli);
  }

  const rt = document.createElement('li');
  rt.classList.add('page', 'next');
  const rta = document.createElement('a');
  if (curpage === totalPages - 1) {
    rt.classList.add('disabled');
  } else {
    queryParams.set('pg', curpage + 1);
    rta.href = `${window.location.pathname}?${queryParams}`;
  }
  rt.appendChild(rta);

  nav.appendChild(rt);

  div.appendChild(nav);
}

async function searchPages(term, page) {
  const json = await fetchIndex('query-index', 50);

  const resultsPerPage = 10;
  const startResult = page * resultsPerPage;

  const result = json.data
    .filter((entry) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const ex of searchExcludedPrefixes) {
        if (entry.path.startsWith(ex)) {
          return false;
        }
      }
      return true;
    })
    .filter((entry) => `${entry.description} ${entry.title}`.toLowerCase()
      .includes(term.toLowerCase()));

  const div = document.createElement('div');

  const summary = document.createElement('h3');
  summary.classList.add('search-summary');
  summary.innerHTML = `${result.length} result${result.length === 1 ? '' : 's'} found for "<strong>${term}</strong>"`;
  div.appendChild(summary);

  const curPage = result.slice(startResult, startResult + resultsPerPage);

  curPage.forEach((line) => {
    const res = document.createElement('div');
    res.classList.add('search-result');
    const header = document.createElement('h3');
    const link = document.createElement('a');
    setResultValue(link, line.title, term);
    link.href = line.path;

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
export default async function decorate(block) {
  const { searchTerm, curPage } = getSearchParams();

  block.innerHTML = '';
  block.append(getSearchWidget(searchTerm, true));

  if (searchTerm) {
    const results = await searchPages(searchTerm, curPage);
    block.append(...results);
  }
}
