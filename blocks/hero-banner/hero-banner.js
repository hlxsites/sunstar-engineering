function decorateVideo(target) {
  const videoTag = document.createElement('video');
  const $poster = target.querySelector('img');
  const $a = target.querySelector('a');
  const videoURL = $a.href;
  videoTag.toggleAttribute('autoplay', true);
  videoTag.toggleAttribute('muted', true); /* not clear if this is needed in some browsers - TODO test */
  videoTag.toggleAttribute('playsinline', true);
  videoTag.toggleAttribute('loop', true);
  videoTag.setAttribute('poster', $poster.src);
  // videoTag.setAttribute('title', video.title);
  videoTag.innerHTML = `<source src="${videoURL}" type="video/mp4">`;
  target.innerHTML = '';
  if (videoURL == null) {
    target.innerHTML = 'Could not find video, check your Hero Banner block';
  }
  target.appendChild(videoTag);
  videoTag.muted = true;
}

function decorateBackGroundImage(target) {
  const pictureTag = target.querySelector('picture');
  target.innerHTML = '';
  target.appendChild(pictureTag);
}

function decorateTextContent() {
  const heroBannerBlockDiv = document.querySelector('.section.full-width.hero-banner-container');
  const contentDiv = heroBannerBlockDiv.querySelector('.default-content-wrapper');
  if (contentDiv != null) {
    const headingDiv = document.createElement('div');
    const buttonDiv = document.createElement('div');
    headingDiv.classList.add('hero-banner-text');
    buttonDiv.classList.add('hero-banner-button');
    if (contentDiv.querySelector('h6') != null) {
      headingDiv.appendChild(contentDiv.querySelector('h6'));
    }
    if (contentDiv.querySelector('h2') != null) {
      headingDiv.appendChild(contentDiv.querySelector('h2'));
    }
    if (contentDiv.querySelector('.button-container') != null) {
      const pElement = contentDiv.querySelector('p');
      if (pElement != null) {
        const aElement = pElement.querySelector('a');
        if (aElement != null) {
          const aText = aElement.textContent;
          if (aText != null) {
            const spanTag = document.createElement('span');
            spanTag.textContent = aText;
            aElement.textContent = '';
            buttonDiv.appendChild(aElement);
            buttonDiv.appendChild(spanTag);
          }
        }
      }
    }
    contentDiv.innerHTML = '';
    const textDiv = document.createElement('div');
    textDiv.classList.add('hero-banner-content');
    textDiv.appendChild(headingDiv);
    textDiv.appendChild(buttonDiv);
    const contentMainDiv = document.createElement('div');
    contentMainDiv.classList.add('hero-banner-text-container');
    contentMainDiv.appendChild(textDiv);
    contentDiv.appendChild(contentMainDiv);
  }
}

export default function decorate($block) {
  if ($block.querySelector('a') != null) {
    decorateVideo($block);
  } else {
    decorateBackGroundImage($block);
  }
  decorateTextContent();
}
