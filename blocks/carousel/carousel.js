function startTimer(block) {
  setInterval(() => {
    const rightSwip = block.querySelector('.swip-right');
    rightSwip.click();
  }, 5000);
}

function commonOnClick(block, newIndex) {
  const activeEles = block.querySelectorAll('.active');
  const newEles = block.querySelectorAll(`[index='${newIndex}']`);
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  let activeEleWidth = null;

  newEles.forEach((newEle) => {
    newEle.classList.add('active');
    if (!newEle.classList.contains('swiper-pagination-bullet')) {
      newEle.classList.add('unhide');
    }
  });

  activeEles.forEach((activeEle) => {
    activeEle.classList.remove('active');
    if (!activeEle.classList.contains('swiper-pagination-bullet')) {
      activeEle.classList.remove('unhide');
      if (Array.from(activeEle.classList).indexOf('image-item') !== -1) {
        activeEleWidth = activeEle.clientWidth;
      }
    }
  });

  if (window.screen.width >= 992 && activeEleWidth) {
    // Have to add screen width check because for large screen and
    // for small screen carousel behaves differently
    swiperWrapper.style.transform = `translate3d(-${(newIndex) * activeEleWidth}px, 0, 0)`;
  } else {
    swiperWrapper.style.transform = `translate3d(-${(newIndex) * window.screen.width}px, 0, 0)`;
  }
}

function getPrevOrNextSwip(swipType, block, totalLength) {
  const swip = document.createElement('div');
  swip.classList.add(`swip-${swipType}`);

  const prevSwipSpan = document.createElement('span');
  prevSwipSpan.classList.add('icon', `icon-${swipType}`);

  swip.appendChild(prevSwipSpan);

  swip.onclick = () => {
    const activeEles = block.querySelectorAll('.active');
    const activeEle = activeEles[0];
    if (activeEle) {
      const index = Number(activeEle.getAttribute('index'));
      let newIndex = ((index + 1) >= totalLength ? 0 : (index + 1));
      if (swipType === 'left') {
        newIndex = ((index - 1) < 0 ? (totalLength - 1) : (index - 1));
      }
      commonOnClick(block, newIndex);
    }
  };

  return swip;
}

function getCarouselControl(block, totalLength) {
  const controlContainer = document.createElement('div');
  controlContainer.classList.add('control-container');

  const pagination = document.createElement('div');
  pagination.classList.add('swip-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets');

  for (let index = 0; index < totalLength; index += 1) {
    const innerSpan = document.createElement('span');
    innerSpan.classList.add('swiper-pagination-bullet');
    innerSpan.setAttribute('index', index);

    innerSpan.onclick = () => {
      commonOnClick(block, Number(innerSpan.getAttribute('index')));
    };

    if (index === 0) {
      innerSpan.classList.add('active');
    }

    pagination.appendChild(innerSpan);
  }

  controlContainer.appendChild(getPrevOrNextSwip('left', block, totalLength));
  controlContainer.appendChild(pagination);
  controlContainer.appendChild(getPrevOrNextSwip('right', block, totalLength));

  const heroContainer = document.createElement('div');
  heroContainer.classList.add('hero-slider-controller');
  heroContainer.appendChild(controlContainer);

  block.appendChild(heroContainer);
}

export default async function decorate(block) {
  const textBlocks = document.createElement('div');
  textBlocks.classList.add('text');
  const pictureBlocks = document.createElement('div');
  pictureBlocks.classList.add('image');

  const blockChildren = [...block.children];
  const totalLength = blockChildren.length;

  const pictureBlockWrapper = document.createElement('div');
  pictureBlockWrapper.classList.add('swiper-wrapper');

  blockChildren.forEach((element, index) => {
    const innerChilds = [...element.children];
    if (index === 0) {
      innerChilds[0].classList.add('unhide', 'active');
      innerChilds[1].classList.add('unhide', 'active');
    }

    innerChilds[0].classList.add('text-item');
    innerChilds[1].classList.add('image-item');
    innerChilds[0].setAttribute('index', index);
    innerChilds[1].setAttribute('index', index);

    textBlocks.appendChild(innerChilds[0]);
    pictureBlockWrapper.appendChild(innerChilds[1]);
  });

  pictureBlocks.appendChild(pictureBlockWrapper);

  const container = document.createElement('div');
  container.classList.add('carousel-items-container');

  block.innerHTML = '';

  container.appendChild(textBlocks);
  container.appendChild(pictureBlocks);

  block.appendChild(container);
  getCarouselControl(block, totalLength);
  startTimer(block, totalLength);
}
