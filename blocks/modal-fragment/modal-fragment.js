import {
  loadFragment,
} from '../../scripts/scripts.js';

// This variable contains the copy of already generated wrapper
// and will be used when we are removing the modal on close button click.
let globalmodalWrapper;

function getModalId(path) {
  const segments = path.split('/');
  return `#${segments.pop()}-modal`;
}

const openModal = async (a, url, block, hasSearchParam = false) => {
  a.addEventListener('click', async (e) => {
    e.preventDefault();
    if (globalmodalWrapper) {
      block.append(globalmodalWrapper);
    }

    const path = new URL(url).pathname;
    const modalId = getModalId(path);
    const elem = document.getElementById(modalId);

    if (!elem || hasSearchParam) {
      if (hasSearchParam) block.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'modal-wrapper';
      wrapper.id = modalId;
      wrapper.dataset.url = url;

      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = '<div class="modal-close"></div>';
      const modalContent = document.createElement('div');
      modalContent.classList.add('modal-content');
      modal.append(modalContent);

      if (path) {
        const fragment = await loadFragment(path);
        const formTitleEl = fragment.querySelector('h2');
        if (formTitleEl) formTitleEl.outerHTML = `<div class="modal-form-title typ-title1">${formTitleEl.innerHTML}</div>`;
        const formSubTitleEl = fragment.querySelector('h3');
        if (formSubTitleEl) formSubTitleEl.outerHTML = `<p class="modal-form-subtitle">${formSubTitleEl.innerHTML}</p>`;
        modalContent.append(fragment);
      }

      wrapper.append(modal);
      block.append(wrapper);
      wrapper.classList.add('visible');
      globalmodalWrapper = wrapper;
      const close = modal.querySelector('.modal-close');
      close.addEventListener('click', () => {
        wrapper.remove();
      });
    } else {
      elem.classList.add('visible');
    }
  });
};

export default async function decorate(block) {
  if (block.innerHTML === '') {
    document.querySelectorAll('a').forEach((a) => {
      if (a.href.includes('/fragments/modals/')) {
        const path = new URL(a.href).pathname;
        a.dataset.path = path;
        const modalId = getModalId(path);
        a.dataset.modal = modalId;
        const url = a.href;
        a.href = '#';
        if (path.includes('videos')) {
          a.classList.add('video-link');
        }
        const hasSearchParam = new URL(url).search.length > 0;
        openModal(a, url, block, hasSearchParam);
      }
    });
  }
}
