export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // decorate columns with non-singleton-image content
  [...block.children].forEach((row) => {
    const content = row.querySelector('div:not(.columns-img-col)');
    if (content) {
      content.classList.add('non-singleton-img');
    }
  });

  // stylize anchors
  [...block.firstElementChild.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const anchors = col.querySelectorAll('a');
      if (anchors.length) {
        [...anchors].forEach((a) => {
          a.title = a.title || a.textContent;
          const up = a.parentElement;
          if (!a.querySelector('img')) {
            if (up.tagName === 'P') {
              up.classList.add('button-container');
            }
            a.classList.add('button');
            if (a.previousElementSibling?.tagName === 'A') {
              a.classList.add('tertiary');
            } else {
              a.classList.add('primary');
            }
          }
        });
      }
    });
  });

  // style headings if collapse is enabled
  const collapseEnabled = block.classList.contains('collapse');
  if (collapseEnabled) {
    [...block.children].forEach((row) => {
      const headings = row.querySelectorAll('h6');
      if (headings.length) {
        [...headings].forEach((h) => {
          h.parentElement.addEventListener('click', () => {
            h.classList.toggle('active');
            const list = h.nextElementSibling;
            if (list) {
              list.classList.toggle('active');
            }
          });
        });
      }
    });
  }
}
