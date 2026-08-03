import { initI18n, initLanguageSelector, applyTranslations } from './i18n.js';
import { loadLesson } from './lesson-loader.js';
import { initNavigation, initLessonInteractions, syncBudgetModeUI } from './navigation.js';
import { buildToc } from './toc.js';

let navigation;

async function showLesson(index) {
  const lesson = await loadLesson(index);
  applyTranslations(lesson);
  initLessonInteractions(lesson, navigation.go);
  buildToc();
}

async function boot() {
  await initI18n();
  initLanguageSelector();

  navigation = initNavigation(async (index) => {
    await showLesson(index);
  });

  await navigation.go(0, { scroll: false });

  document.addEventListener('actualtutorial:languagechange', () => {
    applyTranslations(document);
    syncBudgetModeUI(document);
    buildToc();
  });

  // Lesson 03 swaps between its Envelope and Tracking branches, which changes
  // which headings are on screen.
  document.addEventListener('actualtutorial:contentchange', () => buildToc());
}

document.addEventListener('DOMContentLoaded', () => {
  boot().catch((error) => {
    console.error(error);
    const container = document.getElementById('lesson-container');
    if (container) {
      container.innerHTML = '<div class="page visible"><div class="concept"><span class="concept-tag amber">Error</span><h2>Site could not start</h2><p>Check the browser console for details.</p></div></div>';
    }
  });
});
