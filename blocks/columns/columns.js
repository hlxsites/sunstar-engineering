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
}
