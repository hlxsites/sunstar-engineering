const mobileBreakpoint = 992;
let heroImage = false;

function fetchPosterURL($poster) {
  const srcURL = new URL($poster.src);
  const srcUSP = new URLSearchParams(srcURL.search);
  srcUSP.set('format', 'webply');
  srcUSP.set('width', window.innerWidth < mobileBreakpoint ? 750 : 2000);
  return `${srcURL.pathname}?${srcUSP.toString()}`;
}

function decorateVideo(mediaRow, target) {
  const mediaDiv = document.createElement('div');
  mediaDiv.classList.add('hero-banner-media-section');
  const videoTag = document.createElement('video');
  const $poster = mediaRow.querySelector('img');
  const $a = mediaRow.querySelector('a');
  const videoURL = $a.href;
  videoTag.toggleAttribute('autoplay', true);
  videoTag.toggleAttribute('muted', true);
  videoTag.toggleAttribute('playsinline', true);
  videoTag.toggleAttribute('loop', true);
  videoTag.setAttribute('poster', fetchPosterURL($poster));
  videoTag.setAttribute('src', `${videoURL}`);
  target.innerHTML = '';
  if (videoURL == null) {
    target.innerHTML = '';
    console.error('Video Source URL is not valid, Check hero-banner block');
  }
  mediaDiv.appendChild(videoTag);
  target.appendChild(mediaDiv);
  videoTag.muted = true;
}

function decorateBackGroundImage(mediaRow, target) {
  const mediaDiv = document.createElement('div');
  mediaDiv.classList.add('hero-banner-media-section');
  const pictureTag = mediaRow.querySelector('picture');
  target.innerHTML = '';
  mediaDiv.appendChild(pictureTag);
  target.appendChild(mediaDiv);
}

function decorateTextContent(headingRow, target) {
  headingRow.classList.add('hero-banner-text-container');
  const firstDiv = headingRow.querySelector('div');
  firstDiv.classList.add('hero-banner-text-wrapper');
  const pElement = firstDiv.querySelector('p');
  if (pElement && pElement.childElementCount === 1 && pElement.firstElementChild.tagName === 'A') {
    firstDiv.removeChild(pElement);
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('hero-banner-button-container');
    const aElement = pElement.querySelector('a');
    const spanElement = document.createElement('span');
    spanElement.textContent = aElement.textContent;
    aElement.textContent = '';
    buttonDiv.appendChild(aElement);
    buttonDiv.appendChild(spanElement);
    headingRow.appendChild(buttonDiv);
  }
  const heroBannerWrapper = document.createElement('div');
  heroBannerWrapper.classList.add('hero-banner-heading-container');
  heroBannerWrapper.appendChild(headingRow);
  const heroBannerMainDiv = document.createElement('div');
  heroBannerMainDiv.classList.add('hero-banner-heading-section');
  heroBannerMainDiv.appendChild(heroBannerWrapper);
  target.appendChild(heroBannerMainDiv);
}

export default function decorate($block) {
  const $rows = [...$block.children];
  const $mediaRow = $rows.at(0);
  const $contentRow = $rows.at(1);
  if ($mediaRow) {
    if ($mediaRow.querySelector('a') !== null) {
      decorateVideo($mediaRow, $block);
    } else {
      heroImage = true;
      decorateBackGroundImage($mediaRow, $block);
    }
  }
  if ($contentRow) {
    decorateTextContent($contentRow, $block);
  }
}

window.addEventListener('resize', () => {
  if (!heroImage) {
    const videoElement = document.querySelector('div.hero-banner-media-section video');
    const posterURL = new URL(videoElement.poster);
    if (posterURL) {
      if (window.innerWidth < 992) {
        posterURL.searchParams.set('width', '750');
        videoElement.setAttribute('poster', posterURL.href);
      } else {
        posterURL.searchParams.set('width', '2000');
        videoElement.setAttribute('poster', posterURL.href);
      }
    }
  }
});
