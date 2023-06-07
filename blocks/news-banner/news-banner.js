import { fetchIndex } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function setNewsBanner(block, text, path, title, lm) {
  let date;
  if (lm) {
    const dt = new Date(lm * 1000);
    date = dt.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    date = '';
  }

  const newsHTML = `<span>${text}</span> <span>${date}</span>
    <a href="${path}">${title}</a>`;
  block.innerHTML = newsHTML;
}

export async function setLatestNewsArticle(block, placeholders) {
  const json = await fetchIndex('query-index');

  const result = json.data
    .filter((entry) => entry.path.startsWith('/news/'))
    .sort((x, y) => x.lastModified - y.lastModified);

  if (!result.length) {
    return;
  }

  const article = result[0];

  setNewsBanner(block, placeholders.newstext, article.path, article.title, article.lastModified);
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(); // TODO need to add locale in future here

  // Initialize the news banner with empty content
  setNewsBanner(block, placeholders.newstext, '', '', undefined);

  // Update it with the news article asynchronously
  setLatestNewsArticle(block, placeholders);
}
