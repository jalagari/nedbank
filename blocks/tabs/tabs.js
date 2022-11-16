// mobile vs desktop
const mediaQueryPhone = window.matchMedia('(max-width: 599px)');
const mediaQueryTablet = window.matchMedia('(max-width: 1024px)');

function openTab(e) {
  const { target } = e;
  const selected = target.getAttribute('aria-selected') === 'true';
  let parent = target.parentNode;

  // accordion nested one level deeper
  if (parent.classList.contains('accordion')) parent = parent.parentNode;

  // no bubbling plz, stopPropagation wasn't working ¯\_(ツ)_/¯
  if (!target.classList.contains('tabs-title')) return;

  if (!selected) {
    // close all open tabs
    const openTitles = parent.querySelectorAll('.tabs-title[aria-selected="true"]');
    const openContent = parent.querySelectorAll('.tabs-content[aria-hidden="false"]');
    openTitles.forEach((tab) => tab.setAttribute('aria-selected', false));
    openContent.forEach((tab) => tab.setAttribute('aria-hidden', true));

    // open clicked tab
    target.setAttribute('aria-selected', true);
    const content = parent.querySelector(`[aria-labelledby="${target.id}"]`);
    content.setAttribute('aria-hidden', false);
  } else if ((mediaQueryPhone.matches && !parent.classList.contains('style-1') && !parent.classList.contains('style-2'))
    || parent.classList.contains('style-3')) {
    target.setAttribute('aria-selected', false);
    const content = parent.querySelector(`[aria-labelledby="${target.id}"]`);
    content.setAttribute('aria-hidden', true);
  }
}

function scrollTab(title) {
  title.scrollIntoView({ block: 'nearest' });
}

function getVisibleTab(event) {
  const { target } = event;
  const dots = target.querySelectorAll('.tabs-dots-dot');
  const tabTitles = target.querySelectorAll('.tabs-title');
  const leftPosition = target.scrollLeft;
  let leftPadding = 0;

  // skip larger screens that don't do the carousel
  if (!mediaQueryTablet.matches) return;

  tabTitles.forEach((tabTitle, key) => {
    const offset = tabTitle.offsetLeft;

    // set first offset (extra padding?)
    if (key === 0) leftPadding = offset;

    if (offset - leftPadding === leftPosition) {
      // set active dot
      dots[key].setAttribute('aria-selected', true);

      // trigger default functionality
      openTab({ target: tabTitle });
    } else {
      // remove active classes
      dots[key].setAttribute('aria-selected', false);
    }
  });
}

function buildDotNav(block) {
  // count tabs
  const count = block.querySelectorAll('.tabs-title').length;
  const dots = document.createElement('ol');
  dots.classList.add('tabs-dots');

  // make dots
  [...new Array(count).fill('').keys()].forEach(() => {
    const dot = document.createElement('li');
    dot.classList.add('tabs-dots-dot');
    dot.setAttribute('aria-selected', false);
    dots.append(dot);
  });

  // add dynamic grid number, +1 for dots
  block.style.gridTemplateRows = `repeat(${count + 1}, min-content)`;

  // attach click listener
  [...dots.children].forEach((dot, key) => {
    dot.addEventListener('click', (event) => {
      const { target } = event;
      const title = [...block.querySelectorAll('.tabs-title')][key];

      // skip selected
      if (target.getAttribute('aria-selected') === 'true') return;

      // scroll to title
      scrollTab(title);
    });
  });

  // add dots
  block.append(dots);

  // attach listener
  block.addEventListener('scroll', getVisibleTab);
}

export default function decorate(block) {
  [...block.children].forEach((tab) => {
    // setup tab title
    const title = tab.querySelector(':is(h2,h3,h4,h5,h6)');
    const anchor = title.querySelector('a');
    const open = title.querySelector('strong') !== null; // bold title indicates auto-open tab
    let titleElement;


    titleElement = title;
    titleElement.innerHTML = title.textContent;
    titleElement.addEventListener('click', openTab);

    titleElement.classList.add('tabs-title');
    titleElement.setAttribute('aria-selected', open);

    // setup tab content
    const content = tab.querySelector('div');
    content.classList.add('tabs-content');
    content.setAttribute('aria-labelledby', titleElement.id);
    content.setAttribute('aria-hidden', !open);
    // move tab and content to block root
    block.append(titleElement, content);


    tab.remove();
  });


  // if no tabs are open, open first tab by default
  if (!block.querySelector('.tabs-title[aria-selected="true"]')) {
    block.querySelector('.tabs-title').setAttribute('aria-selected', true);
    block.querySelector('.tabs-title + .tabs-content').setAttribute('aria-hidden', false);
    block.querySelector('.tabs-dots-dot')?.setAttribute('aria-selected', true);
  }
  block.setAttribute('role', 'tablist');
}
