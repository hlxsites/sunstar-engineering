function buildTaglist(taglist, block) {
  const taglistLeft = document.createElement('div');
  taglistLeft.classList.add('hero-vertical-tabs-dropdown-left');
  taglist.append(taglistLeft);

  const strongElements = block.querySelectorAll('ul strong a');
  const tagListTitle = document.createElement('div');
  tagListTitle.classList.add('hero-vertical-tabs-dropdown-title');
  tagListTitle.textContent = strongElements[0].textContent;
  taglist.append(tagListTitle);

  const ul = document.createElement('ul');
  ul.classList.add('hero-vertical-tabs-dropdown');
  block.querySelectorAll('ul li').forEach((li) => {
    if (li.querySelectorAll('strong').length !== 0) {
      const aLink = li.querySelectorAll('a')[0];
      li.innerHTML = '';
      li.append(aLink);
      li.classList.add('active');
      ul.append(li);
    }
    ul.append(li);
  });
  taglist.addEventListener('click', () => {
    ul.classList.toggle('visible');
    taglist.classList.toggle('visible');
  });

  document.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('hero-vertical-tabs-taglist')
      && ul.classList.contains('visible')) {
      ul.classList.remove('visible');
      taglist.classList.remove('visible');
    }
  });

  const mediaQueryList = window.matchMedia('(min-width: 62rem)');
  const listener = (evt) => {
    if (evt.matches) {
      ul.classList.remove('visible');
      taglist.classList.remove('visible');
    }
  };
  mediaQueryList.addEventListener('change', listener);
  listener(mediaQueryList);
  taglist.append(ul);
}

function buildImageAndContent(heroImage, block) {
  const imageContent = document.createElement('div');
  imageContent.classList.add('hero-vertical-tabs-content');
  if ([...block.children][2] != null && [...[...block.children][2].children][1] != null) {
    imageContent.append([...[...block.children][2].children][1]);
  }
  const picture = block.querySelectorAll('picture')[0];
  heroImage.append(picture);
  heroImage.append(imageContent);
}

export default async function decorate(block) {
  const taglist = document.createElement('div');
  const heroImage = document.createElement('div');
  taglist.classList.add('hero-vertical-tabs-taglist');
  heroImage.classList.add('hero-vertical-tabs-background-image');
  buildTaglist(taglist, block);
  buildImageAndContent(heroImage, block);
  block.replaceChildren(taglist);
  block.append(heroImage);
}
