import { translate } from './i18n.js';

// Every lesson gets an outline. Lesson 02 shows only two sections while Envelope
// is selected, so the floor has to stay at 2.
const MIN_SECTIONS = 2;

let observer = null;

function isVisible(element) {
  // Lesson 03 hides one of its two mode branches; offsetParent is null for those.
  return element.offsetParent !== null;
}

function headings() {
  const container = document.getElementById('lesson-container');
  if (!container) return [];
  return Array.from(container.querySelectorAll('h2')).filter(isVisible);
}

function label(heading) {
  return heading.textContent.replace(/\s+/g, ' ').trim();
}

export function buildToc() {
  const panel = document.getElementById('lesson-toc');
  if (!panel) return;

  const list = panel.querySelector('.toc-list');
  const title = panel.querySelector('.toc-title');
  if (title) title.textContent = translate('toc.t001') || title.textContent;

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  const found = headings();
  list.innerHTML = '';

  if (found.length < MIN_SECTIONS) {
    panel.hidden = true;
    return;
  }

  found.forEach((heading, index) => {
    // IDs are assigned at runtime so lesson files need no anchors of their own.
    heading.id = `section-${index + 1}`;

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = label(heading);
    link.dataset.tocTarget = heading.id;
    // The ids are positional and are reassigned whenever the outline rebuilds,
    // so they are deliberately not written to the URL.
    link.addEventListener('click', (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    item.appendChild(link);
    list.appendChild(item);
  });

  panel.hidden = false;
  observeSections(found);
}

function observeSections(found) {
  const links = new Map(
    Array.from(document.querySelectorAll('.toc-list a')).map((a) => [a.dataset.tocTarget, a])
  );

  const seen = new Map();

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => seen.set(entry.target.id, entry));

    // Highlight the last section whose heading has passed the top of the viewport.
    let active = null;
    found.forEach((heading) => {
      const entry = seen.get(heading.id);
      if (!entry) return;
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) active = heading.id;
    });
    if (!active) active = found[0].id;

    links.forEach((link, id) => {
      const isActive = id === active;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-56px 0px -70% 0px', threshold: 0 });

  found.forEach((heading) => observer.observe(heading));
}
