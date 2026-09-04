# Actual Budget Tutorial

A static GitHub Pages tutorial site for beginner Actual Budget users.

The tutorial walks through Actual Budget's core workflows in 9 short lessons:

- Tracking Budget vs Envelope Budget
- Setting up accounts and categories
- Credit cards, transactions, rules, and reports
- Keyboard shortcuts, tips, and common workflow questions

Content is current as of Actual Budget 26.9.0 (September 2026).

Live site:

[https://x-rous.github.io/actual-tutorial/](https://x-rous.github.io/actual-tutorial/)

## About The Site

This project is intentionally simple:

- Plain HTML, CSS, and JavaScript
- No React, Next.js, Vite, Webpack, npm, or build step
- Compatible with GitHub Pages
- Relative paths only, so it works on both root domains and project pages

The app loads each lesson from a separate HTML fragment and applies translations from JSON files.

## Project Structure

```text
/
  index.html
  css/
    styles.css
  js/
    main.js
    navigation.js
    i18n.js
    lesson-loader.js
  i18n/
    en.json
    ar.json
    es.json
    fr.json
    pt-BR.json
  lessons/
    lesson-01.html
    lesson-02.html
    lesson-03.html
    lesson-04.html
    lesson-05.html
    lesson-06.html
    lesson-07.html
    lesson-08.html
    lesson-09.html
```

## Local Development

Because the site uses `fetch()` to load lesson and translation files, open it through a local static server instead of opening `index.html` directly.

From the repository root:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5500/index.html
```

## Languages

Translation files live in `i18n/`.

Current language files:

- `en.json` - English source of truth
- `ar.json` - Arabic, RTL
- `fr.json` - French
- `es.json` - Spanish
- `pt-BR.json` - Brazilian Portuguese

English is the source of truth for translation keys. Other language files should keep the same keys as `en.json`.

Translation quality review is ongoing. French has had a focused quality pass; Spanish and Brazilian Portuguese still need a later review pass.

## Editing Lessons

Lesson files live in `lessons/`.

Each lesson file is an HTML fragment, not a complete HTML document. Do not add `<!doctype html>`, `<html>`, `<head>`, or `<body>` tags to lesson files.

Visible text in lessons should use translation keys from the JSON files, for example:

```html
<h2 data-i18n="lesson01.t003">Welcome - Start Simple</h2>
```

Trusted local HTML translations use `data-i18n-html`.

## Deployment

The site deploys as a normal static GitHub Pages site. No build command is required.

Keep paths relative, for example:

```html
<link rel="stylesheet" href="./css/styles.css">
```

Avoid root-relative paths such as:

```html
<link rel="stylesheet" href="/css/styles.css">
```

Root-relative paths can break when GitHub Pages serves the project under `/actual-tutorial/`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, local testing steps, and translation rules.
