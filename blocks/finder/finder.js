import { fetchIndex } from '../../scripts/scripts.js';

const cachedResponses = {};

function template() {
  return `
  <div class="container">
    <h2>Site Selector Search</h2>
    <form id="filterForm">
      <div class="form-group">
        <label for="desiredSelector">Desired Selector:</label>
        <input type="text" id="desiredSelector" name="desiredSelector" required>
        Few Examples:
        <table>
          <tr>
            <th>Item</th>
            <th>Selector</th>
          </tr>
          <tr>
            <td>Cards Block</td>
            <td><pre>.cards</pre></td>
          </tr>
          <tr>
            <td>Breadcrumb Block</td>
            <td><pre>.breadcrumb</pre></td>
          </tr>
        </table>
      </div>
      <button type="submit">Filter URLs</button>
      <h3>Results will appear below<h3>
      <h6>For the first search on page load, the search results take time (~ 1 minute) to appear. Subsequent searches would be faster.</h6>
    </form>
    <div id="spinner" class="spinner"></div>
    <div id="resultContainer"></div>
  </div>    `;
}

function replaceIndex(path) {
  if (path.endsWith('/index')) {
    return path.slice(0, -6);
  }
  return path;
}
function pathToUrl(path) {
  return `${window.location.origin}${replaceIndex(path)}`;
}

async function fetchHtml(url) {
  if (cachedResponses[url]) {
    return cachedResponses[url];
  }
  const response = await fetch(url);
  const html = await response.text();
  cachedResponses[url] = html;
  return html;
}

async function searchForElement(url, selector) {
  const html = await fetchHtml(url);
  const element = document.createElement('div');
  element.innerHTML = html;

  // Modify the selector and condition based on your requirements
  const desiredSelector = element.querySelector(selector);

  return !!desiredSelector;
}

async function filterUrlsWithElement(urls, selector) {
  const filteredUrls = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    // eslint-disable-next-line no-await-in-loop
    const hasElement = await searchForElement(url, selector);
    if (hasElement) {
      filteredUrls.push(pathToUrl(url.replace('.plain.html', '')));
    }
  }

  return filteredUrls;
}

function handleFormSubmit(event, urlList) {
  event.preventDefault();

  const form = event.target;
  const input = form.elements.desiredSelector;
  const desiredSelector = input.value;

  const container = document.getElementById('resultContainer');
  const spinner = document.getElementById('spinner');

  container.textContent = '';
  spinner.style.display = 'block';

  filterUrlsWithElement(urlList, desiredSelector)
    .then((filteredUrls) => {
      const resultList = document.createElement('ul');
      resultList.textContent = 'Filtered URLs:';
      filteredUrls.forEach((url) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.textContent = url;
        li.appendChild(a);
        resultList.appendChild(li);
      });
      container.appendChild(resultList);
      spinner.style.display = 'none';
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error:', error);
      spinner.style.display = 'none';
    });
}

export default async function decorate(block) {
  const index = (await fetchIndex('query-index')).data;
  const urlList = index.map((item) => (item.path === '/' ? '/index.plain.html' : `${item.path}.plain.html`));
  block.innerHTML = template();
  block.querySelector('#filterForm').addEventListener('submit', (event) => {
    handleFormSubmit(event, urlList);
  });
}
