import { translate } from './i18n.js';

let currentLesson = 0;
let selectedMode = 'envelope';
let lessonThreeMode = 'envelope';
let navigateToLesson = async () => {};

export function initNavigation(onNavigate) {
  navigateToLesson = onNavigate;

  document.querySelectorAll('.pnav-btn[data-lesson-index]').forEach((button) => {
    button.addEventListener('click', () => {
      go(Number(button.dataset.lessonIndex));
    });
  });

  updateProgressNav(0);

  return { go };
}

export async function go(index, options = {}) {
  if (!Number.isInteger(index) || index < 0) return;

  const previousLesson = currentLesson;
  currentLesson = index;
  updateProgressNav(index, previousLesson);
  await navigateToLesson(index);

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function initLessonInteractions(root, goToLesson = go) {
  if (!root) return;

  root.querySelectorAll('[data-next-index]').forEach((button) => {
    button.addEventListener('click', () => {
      goToLesson(Number(button.dataset.nextIndex));
    });
  });

  root.querySelectorAll('[data-mode]').forEach((card) => {
    const mode = card.dataset.mode;
    card.addEventListener('click', () => selectMode(mode));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      selectMode(mode);
    });
  });

  root.querySelectorAll('[data-l3-mode]').forEach((button) => {
    button.addEventListener('click', () => setLessonThreeMode(button.dataset.l3Mode));
  });

  root.querySelectorAll('.ss img').forEach((image) => {
    image.addEventListener('error', () => replaceBrokenImage(image), { once: true });
  });

  syncBudgetModeUI(root);
}

export function syncBudgetModeUI(root = document) {
  updateModeSelection(root);
  updateLessonThreeToggle(root);
}

function updateProgressNav(index, previousLesson = currentLesson) {
  const buttons = document.querySelectorAll('.pnav-btn');
  if (index > previousLesson && buttons[previousLesson]) {
    buttons[previousLesson].classList.add('done');
  }

  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
    if (buttonIndex === index) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
    if (buttonIndex < index && !button.classList.contains('active')) {
      button.classList.add('done');
    }
  });
}

function selectMode(mode) {
  selectedMode = mode;
  lessonThreeMode = mode;
  syncBudgetModeUI(document);
  // Choosing Tracking on lesson 02 reveals a section that is hidden for Envelope.
  notifyContentChange();
}

function setLessonThreeMode(mode) {
  lessonThreeMode = mode;
  updateLessonThreeToggle(document);
  notifyContentChange();
}

function notifyContentChange() {
  document.dispatchEvent(new CustomEvent('actualtutorial:contentchange'));
}

function updateModeSelection(root) {
  const envelopeCard = root.querySelector('#mode-card-envelope');
  const trackingCard = root.querySelector('#mode-card-tracking');
  if (!envelopeCard || !trackingCard) return;

  const isEnvelope = selectedMode === 'envelope';
  envelopeCard.style.borderColor = isEnvelope ? 'var(--green)' : 'var(--border)';
  envelopeCard.style.boxShadow = isEnvelope ? '0 0 0 3px rgba(22,163,74,.12)' : 'none';
  trackingCard.style.borderColor = isEnvelope ? 'var(--border)' : 'var(--amber)';
  trackingCard.style.boxShadow = isEnvelope ? 'none' : '0 0 0 3px rgba(180,83,9,.1)';
  envelopeCard.setAttribute('aria-pressed', isEnvelope ? 'true' : 'false');
  trackingCard.setAttribute('aria-pressed', isEnvelope ? 'false' : 'true');

  const envelopeBadge = root.querySelector('#envelope-selected-badge');
  const trackingBadge = root.querySelector('#tracking-selected-badge');
  const trackingSwitch = root.querySelector('#tracking-switch-section');
  if (envelopeBadge) envelopeBadge.style.display = isEnvelope ? 'block' : 'none';
  if (trackingBadge) trackingBadge.style.display = isEnvelope ? 'none' : 'block';
  if (trackingSwitch) trackingSwitch.style.display = isEnvelope ? 'none' : 'block';

  const callout = root.querySelector('#mode-choice-callout');
  const calloutIcon = callout?.querySelector('.call-ic');
  const calloutText = root.querySelector('#mode-choice-text');
  if (callout && calloutIcon && calloutText) {
    callout.className = isEnvelope ? 'call cs' : 'call cw';
    calloutIcon.textContent = isEnvelope ? '\u{1F4E6}' : '\u2699\uFE0F';
    calloutText.innerHTML = translate(isEnvelope ? 'mode.choice.envelope' : 'mode.choice.tracking');
  }

  setHtml(root.querySelector('#l3-next-title'), isEnvelope ? 'lesson03.title.envelope' : 'lesson03.title.tracking');
}

function updateLessonThreeToggle(root) {
  const envelopeSection = root.querySelector('#l3-envelope');
  const trackingSection = root.querySelector('#l3-tracking');
  if (envelopeSection) envelopeSection.style.display = lessonThreeMode === 'envelope' ? 'block' : 'none';
  if (trackingSection) trackingSection.style.display = lessonThreeMode === 'tracking' ? 'block' : 'none';

  const envelopeButton = root.querySelector('#btn-envelope');
  const trackingButton = root.querySelector('#btn-tracking');
  if (envelopeButton && trackingButton) {
    if (lessonThreeMode === 'envelope') {
      envelopeButton.style.background = 'var(--green)';
      envelopeButton.style.color = '#fff';
      envelopeButton.style.fontWeight = '700';
      trackingButton.style.background = 'transparent';
      trackingButton.style.color = 'var(--ink3)';
      trackingButton.style.fontWeight = '600';
    } else {
      trackingButton.style.background = 'var(--amber)';
      trackingButton.style.color = '#fff';
      trackingButton.style.fontWeight = '700';
      envelopeButton.style.background = 'transparent';
      envelopeButton.style.color = 'var(--ink3)';
      envelopeButton.style.fontWeight = '600';
    }
  }

  setHtml(root.querySelector('#l3-title'), lessonThreeMode === 'envelope' ? 'lesson03.title.envelope' : 'lesson03.title.tracking');
}

function setHtml(element, key) {
  if (!element) return;
  element.innerHTML = translate(key);
}

function replaceBrokenImage(image) {
  const fallback = document.createElement('div');
  fallback.className = 'img-fallback';
  fallback.textContent = translate('errors.screenshotUnavailable');
  image.replaceWith(fallback);
}
