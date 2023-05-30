import { fetchIndex } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function prependSlash(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function renderBreadcrumb(breadcrumbs, block) {
  const li = document.createElement('li');
  li.classList.add('breadcrumb-item');

  li.innerHTML = (breadcrumbs.category_url_path || breadcrumbs.url_path) ? `
    <a href="${prependSlash(breadcrumbs.category_url_path ?? breadcrumbs.url_path)}">
        ${breadcrumbs.category_name ?? breadcrumbs.name}
    </a>
  ` : `${breadcrumbs.category_name ?? breadcrumbs.name}`;
  block.append(li);
}

async function createAutoBreadcrumb(block, placeholders) {
  const pageIndex = (await fetchIndex('query-index')).data;
  const { pathname } = window.location;
  const pathSeparator = '/';
  // eslint-disable-next-line max-len
  const urlForIndex = (index) => prependSlash(pathname.split(pathSeparator).slice(1, index + 2).join(pathSeparator));
  const pathSplit = pathname.split(pathSeparator);

  const breadcrumbs = [
    {
      name: placeholders.hometext,
      url_path: `${pathSeparator}`,
    },
    ...pathSplit.slice(1, -1).map((part, index) => ({
      name: pageIndex.find((page) => page.path === urlForIndex(index))?.title ?? part,
      url_path: urlForIndex(index),
    })),
    {
      // eslint-disable-next-line max-len
      name: pageIndex.find((page) => page.path === urlForIndex(pathSplit.length - 1))?.title ?? pathSplit[pathSplit.length - 1],
    },
  ];
  breadcrumbs.forEach((crumb) => {
    renderBreadcrumb(crumb, block);
  });
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(); // TODO need to add locale in future here
  createAutoBreadcrumb(block, placeholders);
}
