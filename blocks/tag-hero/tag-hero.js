export default async function decorate(block) {
  const tagHero = document.createElement('div');
  tagHero.classList.add('tag-hero-bg');
  const taglist = document.createElement('div');
  taglist.classList.add('tag-hero-taglist');
  const taglistLeft = document.createElement('div');
  taglistLeft.classList.add('tag-hero-dropdown-left');
  taglist.append(taglistLeft);

  const strongElements = block.querySelectorAll('ul strong a');
  const tagListTitle = document.createElement('div');
  tagListTitle.classList.add('tag-hero-dropdown-title');
  tagListTitle.textContent = strongElements[0].textContent;
  taglist.append(tagListTitle);

  const ul = document.createElement('ul');
  ul.classList.add('tag-hero-dropdown');
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
    if (ul.classList.contains('visible')) {
      ul.classList.remove('visible');
      taglist.classList.remove('visible');
    } else {
      ul.classList.add('visible');
      taglist.classList.add('visible');
    }
  });

  window.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('tag-hero-taglist')
      && ul.classList.contains('visible')) {
      ul.classList.remove('visible');
      taglist.classList.remove('visible');
    }
  });
  taglist.append(ul);

  const heroImage = document.createElement('div');
  heroImage.classList.add('tag-hero-background-image');
  const imageContent = document.createElement('div');
  imageContent.classList.add('tag-hero-content');
  if ([...block.children][2] != null && [...[...block.children][2].children][1] != null) {
    imageContent.append([...[...block.children][2].children][1]);
  }
  const picture = block.querySelectorAll('picture')[0];
  heroImage.append(picture);
  heroImage.append(imageContent);
  tagHero.append(taglist);
  tagHero.append(heroImage);
  block.replaceChildren(tagHero);
}
