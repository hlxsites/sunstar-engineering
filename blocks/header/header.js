import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (sections) {
    sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('role', 'button');
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('role');
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function template(block) {
  return `
  <header class="ss-header" id="js-header">
    <div class="ss-container">
      <nav class="ss-header-top">
        <a href="https://www.sunstar-engineering.com/career/" class="link">Careers</a><a href="https://www.sunstar-engineering.com/news/" class="link">News &amp; Topics</a><span class="links-social"><a class="link" target="_blank" href="https://www.linkedin.com/company/sunstar-engineering"><span class="icon in"></span></a><a class="link" target="_blank" href="https://www.youtube.com/channel/UCM7etMw7LLy-MlNmk9xPrdQ"><span class="icon yo"></span></a></span>        <span class="has-menu lang-menu">
        <a class="link" href="https://www.sunstar-engineering.com">English</a><span class="dropdown-menu"><a class="dropdown-item" href="https://www.sunstar-engineering.com/cn/">简体中文</a><a class="dropdown-item" href="https://www.sunstar-engineering.com/th/">ไทย</a><a class="dropdown-item" href="https://www.sunstar-engineering.com/it/">Italiano</a><a class="dropdown-item" href="https://www.sunstar-engineering.com/ja/">日本語</a><a class="dropdown-item" href="https://www.sunstar-engineering.com/id/">Bahasa Indonesia</a><a class="dropdown-item" href="https://www.sunstar-engineering.com/de/">Deutsch</a></span>        </span>
        <a href="https://www.sunstar.com/" target="_blank" rel="noopener noreferrer" class="other-site-menu link">Sunstar Group <span class="icon-link"></span></a>
      </nav>
      <nav class="ss-header-middle">
        <a href="https://www.sunstar-engineering.com/" class="logo">
        <img src="https://www.sunstar-engineering.com/wp-content/themes/sunstar-engineering/public/img/Sunstar-logo.svg" alt="Sunstar Engineering" class="company-logo">
        </a>
        <div class="other-site">
          <h4>Sunstar Engineering</h4>
        </div>
      </nav>
      <nav class="ss-header-bottom" id="js-ss-header-bottom">
        <button class="navbar-toggler" id="js-navbar-toggler" type="button">
        <span class="mobile-icon">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        </span>
        </button>
        <!--   Back to main menu button -->
        <!--      <button class="navbar-toggler" id="js-backto-main" type="button">-->
        <!--        <span class="backToMenu">-->
        <!--          <i class="back-icon"></i>Back to Menu-->
        <!--        </span>-->
        <!--      </button>-->
        <ul class="main-nav">
          <li class="d-lg-none"><a href="/" class="link">Home</a></li>
          <li class="drop d-lg-none">
            <a href="https://www.sunstar-engineering.com/automotive/" class="link">Automotive Adhesives &amp; Sealants</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="left-content-container">
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/automotive/">Automotive Adhesives &amp; Sealants</a></h3>
                      <a href="https://www.sunstar-engineering.com/automotive/weldshop/" class="link">Weld Shop</a><a href="https://www.sunstar-engineering.com/automotive/paintshop/" class="link">Paint Shop</a><a href="https://www.sunstar-engineering.com/automotive/assemblyshop/" class="link">Assembly Shop</a><a href="https://www.sunstar-engineering.com/automotive/specialty/" class="link">Specialty</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="drop d-lg-none">
            <a href="https://www.sunstar-engineering.com/drive/" class="link">Drive Components</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="left-content-container">
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/drive/">Drive Components</a></h3>
                      <a href="https://www.sunstar-engineering.com/drive/press/" class="link">Press</a><a href="https://www.sunstar-engineering.com/drive/laser-cutting/" class="link">Laser Cutting</a><a href="https://www.sunstar-engineering.com/drive/fine-blanking/" class="link">Fine Blanking</a><a href="https://www.sunstar-engineering.com/drive/design-development/" class="link">Design &amp; Development</a><a href="https://www.sunstar-engineering.com/drive/racing/" class="link">Racing Support</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="drop d-lg-none">
            <a href="https://www.sunstar-engineering.com/construction/" class="link">Construction Chemicals</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="left-content-container">
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/construction/">Construction Chemicals</a></h3>
                      <a href="https://www.sunstar-engineering.com/construction/high-rise/" class="link">High-rise Buildings</a><a href="https://www.sunstar-engineering.com/construction/residential/" class="link">Residential Housing</a><a href="https://www.sunstar-engineering.com/construction/examples/" class="link">Application example</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="drop d-lg-none">
            <a href="https://www.sunstar-engineering.com/electronic/" class="link">Electronic adhesives</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="left-content-container">
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/electronic/">Electronic adhesives</a></h3>
                      <a href="https://www.sunstar-engineering.com/electronic/car-electronics/" class="link">Car Electronics</a><a href="https://www.sunstar-engineering.com/electronic/solar-system/" class="link">Solar System</a><a href="https://www.sunstar-engineering.com/electronic/space-industry/" class="link">Space Industry</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class=" d-lg-none">
            <a href="https://www.sunstar-engineering.com/air/" class="link">Air Deodorization &amp; Disinfection</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="left-content-container">
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/air/">Air Deodorization &amp; Disinfection</a></h3>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="drop d-lg-flex d-none">
            <a href="https://www.sunstar-engineering.com/engineering-solutions/" class="link">Engineering Solutions</a>
            <div class="mega mega-dropdown">
              <div class="mega-container" style="display: none;">
                <div class="left-content">
                  <div class="mega-title">
                    <h2>Engineering Solutions</h2>
                    <a href="/global-network/" class="btn btn-link btn-link-reversed btn-link-md">Learn about regional availability <span class="icon icon-ang-white"></span></a>
                  </div>
                  <div class="left-content-container">
                    <!-- <nav class="mega-sub-menu"> -->
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/engineering-solutions/">Engineering Solutions</a></h3>
                      <h6 class="menu-subtitle"><a href="https://www.sunstar-engineering.com/automotive/">Automotive Adhesives &amp; Sealants <span class="icon icon-ang-white"></span></a></h6>
                      <a href="https://www.sunstar-engineering.com/automotive/weldshop/" class="link">Weld Shop</a><a href="https://www.sunstar-engineering.com/automotive/paintshop/" class="link">Paint Shop</a><a href="https://www.sunstar-engineering.com/automotive/assemblyshop/" class="link">Assembly Shop</a><a href="https://www.sunstar-engineering.com/automotive/specialty/" class="link">Specialty</a>
                    </nav>
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/engineering-solutions/">Engineering Solutions</a></h3>
                      <h6 class="menu-subtitle"><a href="https://www.sunstar-engineering.com/drive/">Drive Components <span class="icon icon-ang-white"></span></a></h6>
                      <a href="https://www.sunstar-engineering.com/drive/press/" class="link">Press</a><a href="https://www.sunstar-engineering.com/drive/laser-cutting/" class="link">Laser Cutting</a><a href="https://www.sunstar-engineering.com/drive/fine-blanking/" class="link">Fine Blanking</a><a href="https://www.sunstar-engineering.com/drive/design-development/" class="link">Design &amp; Development</a><a href="https://www.sunstar-engineering.com/drive/racing/" class="link">Racing Support</a>
                    </nav>
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/engineering-solutions/">Engineering Solutions</a></h3>
                      <h6 class="menu-subtitle"><a href="https://www.sunstar-engineering.com/construction/">Construction Chemicals <span class="icon icon-ang-white"></span></a></h6>
                      <a href="https://www.sunstar-engineering.com/construction/high-rise/" class="link">High-rise Buildings</a><a href="https://www.sunstar-engineering.com/construction/residential/" class="link">Residential Housing</a><a href="https://www.sunstar-engineering.com/construction/examples/" class="link">Application example</a>
                    </nav>
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/engineering-solutions/">Engineering Solutions</a></h3>
                      <h6 class="menu-subtitle"><a href="https://www.sunstar-engineering.com/electronic/">Electronic adhesives <span class="icon icon-ang-white"></span></a></h6>
                      <a href="https://www.sunstar-engineering.com/electronic/car-electronics/" class="link">Car Electronics</a><a href="https://www.sunstar-engineering.com/electronic/solar-system/" class="link">Solar System</a><a href="https://www.sunstar-engineering.com/electronic/space-industry/" class="link">Space Industry</a>
                    </nav>
                    <nav class="mega-sub-menu">
                      <h3 class="mobile-menu-header"><a class="link" href="https://www.sunstar-engineering.com/engineering-solutions/">Engineering Solutions</a></h3>
                      <h6 class="menu-subtitle"><a href="https://www.sunstar-engineering.com/air/">Air Deodorization &amp; Disinfection <span class="icon icon-ang-white"></span></a></h6>
                    </nav>
                    <!-- </nav> -->
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li><a href="https://www.sunstar-engineering.com/brands/" class="link">Brands</a></li>
          <li><a href="https://www.sunstar-engineering.com/about/" class="link">About us</a></li>
          <li><a href="https://www.sunstar-engineering.com/global-network/" class="link">Global Network</a></li>
          <li><a href="https://www.sunstar-engineering.com/contact/" class="link">Contact</a></li>
          <li class="mobile-content">
            <nav class="other-section"><a href="https://www.sunstar-engineering.com/career/">Careers</a><a href="https://www.sunstar-engineering.com/news/">News &amp; Topics</a></nav>
            <nav class="language"><a href="https://www.sunstar-engineering.com">English</a><a href="https://www.sunstar-engineering.com/de/">Deutsch</a><a href="https://www.sunstar-engineering.com/id/">Bahasa Indonesia</a><a href="https://www.sunstar-engineering.com/it/">Italiano</a><a href="https://www.sunstar-engineering.com/ja/">日本語</a><a href="https://www.sunstar-engineering.com/th/">ไทย</a><a href="https://www.sunstar-engineering.com/cn/">简体中文</a></nav>
            <nav class="other-section"><a href="https://www.sunstar.com/" target="_blank" rel="noopener noreferrer">Sunstar Group <span class="icon-link"></span></a></nav>
            <nav class="mobile-nav-social-links"><a href="https://www.linkedin.com/company/sunstar-engineering" target="_blank" rel="noopener noreferrer"><img src="https://www.sunstar-engineering.com/wp-content/themes/sunstar-engineering/public/icons/linkedin.svg" alt=""></a><a href="https://www.youtube.com/channel/UCM7etMw7LLy-MlNmk9xPrdQ" target="_blank" rel="noopener noreferrer"><img src="https://www.sunstar-engineering.com/wp-content/themes/sunstar-engineering/public/icons/youtube.svg" alt=""></a></nav>
          </li>
        </ul>
        <form method="get" class="search" id="searchform" action="https://www.sunstar-engineering.com/">
          <input type="hidden" id="_wpnonce" name="_wpnonce" value="b8fe72427d"><input type="hidden" name="_wp_http_referer" value="/">
          <div class="form-group">
            <input type="hidden" name="lang" value="en">
            <input type="text" id="search" name="s" class="form-control" placeholder="Search" required="true" oninput="this.setCustomValidity('')" oninvalid="this.setCustomValidity('The Search field cannot be empty')">
            <span class="search-icon"></span>
            <button class="btn btn-link search-icon"></button>
          </div>
        </form>
      </nav>
    </div>
  </header>
`;
}

function decorateTopNav(nav) {
  nav.querySelectorAll(':scope > ul > li').forEach((li) => {
  });
}

function decorateMiddleNav() {

}

function decorateBottomNav() {

}

const navDecorators = {
  'nav-top': decorateTopNav,
  'nav-middle': decorateMiddleNav,
  'nav-bottom': decorateBottomNav,
};

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  // TODO: remove this fallback once nav is in place
  const navPath = navMeta ? new URL(navMeta).pathname : '/_drafts/satyam/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    block.innerHTML = '';
    const html = await resp.text();
    const fetchedNav = document.createElement('div');
    fetchedNav.innerHTML = html;
    const navClasses = ['nav-top', 'nav-middle', 'nav-bottom'];
    navClasses.forEach((navClass, idx) => {
      const nav = document.createElement('nav');
      nav.classList.add(navClass);
      nav.innerHTML = fetchedNav.querySelectorAll(':scope>div')[idx].innerHTML;
      navDecorators[navClass](nav);
      block.appendChild(nav);
    });
    decorateIcons(block);
  }
}
