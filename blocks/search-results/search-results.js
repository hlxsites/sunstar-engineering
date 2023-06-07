import { getSearchWidget } from '../../scripts/scripts.js';

function getSearchParams() {
  const searchTerm = new URLSearchParams(window.location.search).get('s');
  return searchTerm;
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

async function searchPages(term) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();

  const result = json.data
    .filter((entry) => `${entry.description} ${entry.title}`.toLowerCase()
      .includes(term.toLowerCase()));

  const div = document.createElement('div');

  const summary = document.createElement('h3');
  summary.classList.add('search-summary');
  summary.innerHTML = `${result.length} result${result.length === 1 ? '' : 's'} found for "<strong>${term}</strong>"`;
  div.appendChild(summary);

  const firstPage = result.slice(0, 10);

  firstPage.forEach((line) => {
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

  return div.children;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const searchTerm = getSearchParams();

  block.innerHTML = '';
  block.append(getSearchWidget(searchTerm, true));

  if (searchTerm) {
    const results = await searchPages(searchTerm);
    block.append(...results);
  }
}
