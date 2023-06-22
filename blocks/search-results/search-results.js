import { fetchIndex, getSearchWidget } from '../../scripts/scripts.js';

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

/**
 * Add a paging widget to the div. The paging widget looks like this:
 * <pre><code>
 * &lt; 1 2 3 &gt;
 * </code></pre>
 * The numbers are hyperlinks to the repective pages and the &lt; and &gt;
 * buttons are links to next and previous pages. If this is the first page
 * then the &lt; link has the style 'disabled' and if this is the lase one
 * the &gt; link is disabled.
 * @param {HTMLElement} div - The div to add the widget to
 * @param {number} curpage - The current page number (starting at 0)
 * @param {number} totalPages - The total number of pages
 * @param {Document} doc - The current Document
 * @param {Location} curLocation - THe current window.location to use
 */
export function addPagingWidget(
  div,
  curpage,
  totalPages,
  doc = document,
  curLocation = window.location,
) {
  const queryParams = new URLSearchParams(curLocation.search);

  const nav = doc.createElement('ul');
  nav.classList.add('pagination');

  const lt = doc.createElement('li');
  lt.classList.add('page');
  lt.classList.add('prev');
  const lta = doc.createElement('a');
  if (curpage === 0) {
    lt.classList.add('disabled');
  } else {
    queryParams.set('pg', curpage - 1);
    lta.href = `${curLocation.pathname}?${queryParams}`;
  }
  lt.appendChild(lta);

  nav.appendChild(lt);

  for (let i = 0; i < totalPages; i += 1) {
    const numli = doc.createElement('li');
    if (i === curpage) {
      numli.classList.add('active');
    }

    const a = doc.createElement('a');
    a.innerText = i + 1;

    queryParams.set('pg', i);
    a.href = `${curLocation.pathname}?${queryParams}`;
    numli.appendChild(a);

    nav.appendChild(numli);
  }

  const rt = doc.createElement('li');
  rt.classList.add('page');
  rt.classList.add('next');
  const rta = doc.createElement('a');
  if (curpage === totalPages - 1) {
    rt.classList.add('disabled');
  } else {
    queryParams.set('pg', curpage + 1);
    rta.href = `${curLocation.pathname}?${queryParams}`;
  }
  rt.appendChild(rta);

  nav.appendChild(rt);

  div.appendChild(nav);
}

async function searchPages(term, page) {
  const json = await fetchIndex('query-index');

  const resultsPerPage = 10;
  const startResult = page * resultsPerPage;

  const result = json.data
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
    const path = line.path || '';
    const parentPath = path && path.lastIndexOf('/') > -1 ? path.slice(0, path.lastIndexOf('/')) : '';

    if (parentPath) {
      const filtered = json.data.filter((x) => x.path === parentPath);

      if (filtered && filtered.length && filtered[0].breadcrumbtitle) {
        const p = document.createElement('p');
        p.classList.add('parent-detail');
        const span = document.createElement('span');
        span.textContent = filtered[0].breadcrumbtitle;
        p.appendChild(span);

        if (filtered[0].newsdate) {
          const dateSpan = document.createElement('span');
          dateSpan.textContent = filtered[0].newsdate;
          span.classList.add('news-date');
          p.appendChild(dateSpan);
        }

        res.appendChild(p);
      }
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
export default async function decorate(block, curLocation = window.location) {
  const { searchTerm, curPage } = getSearchParams(curLocation.search);

  block.innerHTML = '';
  block.append(getSearchWidget(searchTerm, true));

  if (searchTerm) {
    const results = await searchPages(searchTerm, curPage);
    block.append(...results);
  }
}
