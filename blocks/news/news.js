import { fetchIndex } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

async function getLatestNewsArticle() {
  const json = await fetchIndex('query-index');

  const result = json.data
    .filter((entry) => entry.path.startsWith('/news/'))
    .sort((x, y) => x.lastModified - y.lastModified);

  if (!result.length) {
    return null;
  }

  return result[0];
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(); // TODO need to add locale in future here

  const article = await getLatestNewsArticle();
  if (!article) {
    return;
  }

  const title = placeholders.newstext;
  const dt = new Date(article.lastModified * 1000);
  const date = dt.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });

  const newsHTML = `<span>${title}</span> <span>${date}</span>
    <a href="${article.path}">${article.title}</a>`;
  block.innerHTML = newsHTML;
}
