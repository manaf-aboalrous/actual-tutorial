# Contributing

Thanks for helping improve the Actual Budget tutorial.

This project is a plain static GitHub Pages site. Keep contributions simple, readable, and compatible with static hosting.

## Ground Rules

- Do not add a build step.
- Do not add React, Next.js, Vite, Webpack, npm, or package manager requirements.
- Use relative paths such as `./js/main.js`.
- Keep the existing lesson flow and visual design unless a change is specifically about layout or UI.
- Preserve existing links to Actual Budget docs, screenshots, GitHub, and external resources.
- Keep code readable for non-expert contributors.

## Running The Site Locally

Use a local static server from the repository root:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:5500/index.html
```

Opening `index.html` directly from the filesystem may fail because the browser can block `fetch()` requests for local files.

## File Responsibilities

- `index.html` contains the page shell, hero, progress navigation, lesson container, and script/style imports.
- `css/styles.css` contains all styling.
- `js/main.js` starts the app.
- `js/navigation.js` handles lesson navigation and progress state.
- `js/i18n.js` loads translation files and applies language settings.
- `js/lesson-loader.js` loads lesson fragments.
- `lessons/lesson-XX.html` contains lesson body fragments.
- `i18n/*.json` contains translated strings.

## Editing Lessons

Lesson files are fragments only. Do not add full document tags such as:

```html
<!doctype html>
<html>
<head>
<body>
```

When adding or changing visible lesson text:

1. Add or update the English text in `i18n/en.json`.
2. Keep the same key in every other language file.
3. Use `data-i18n` for plain text.
4. Use `data-i18n-html` only for trusted local HTML strings.
5. Preserve any existing URLs, file paths, code snippets, keyboard shortcuts, and HTML attributes.

## Translation Rules

`i18n/en.json` is the source of truth for keys.

All language files must have the same keys as `en.json`.

Before submitting translation changes, validate JSON:

```bash
python -m json.tool i18n/<language-code>.json
```

You can compare keys with Python.

Bash, macOS, or Linux:

```bash
python - <<'PY'
import json
from pathlib import Path

en = json.loads(Path("i18n/en.json").read_text(encoding="utf-8"))
for path in sorted(Path("i18n").glob("*.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    missing = [key for key in en if key not in data]
    extra = [key for key in data if key not in en]
    print(path.name, "missing:", len(missing), "extra:", len(extra))
    if missing:
        print("  missing keys:", missing)
    if extra:
        print("  extra keys:", extra)
PY
```

Windows PowerShell:

```powershell
@'
import json
from pathlib import Path

en = json.loads(Path("i18n/en.json").read_text(encoding="utf-8"))
for path in sorted(Path("i18n").glob("*.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    missing = [key for key in en if key not in data]
    extra = [key for key in data if key not in en]
    print(path.name, "missing:", len(missing), "extra:", len(extra))
    if missing:
        print("  missing keys:", missing)
    if extra:
        print("  extra keys:", extra)
'@ | python -
```

Keep Actual Budget product and UI terms in English when translating them could make the tutorial mismatch the app. Examples:

- Actual Budget
- Envelope Budget
- Tracking Budget
- Available Funds
- To Budget
- Hold for next month
- Bank Sync
- API
- Desktop Client
- Self-Hosted / Cloud Server
- GitHub Pages
- Budget Automation
- Budget Templates
- Excel formula mode
- Formula card
- Balance Forecast
- Sankey
- Age of Money
- Crossover Point
- Payee Locations

It is fine to explain a term in the target language while keeping the original UI term.

## Adding A Language

To add a language:

1. Create `i18n/<language-code>.json`.
2. Copy the exact keys from `i18n/en.json`.
3. Translate values only.
4. Preserve HTML tags, attributes, URLs, code snippets, and keyboard shortcuts.
5. Add the language to the `LANGUAGES` config in `js/i18n.js`.
6. Test the language selector, text direction, navigation, and lesson loading.

Arabic is RTL and uses `body.ar`. Other current languages are LTR.

## Manual Test Checklist

After changes, check:

- The site loads at `http://127.0.0.1:5500/index.html`.
- English loads by default.
- Language selection still works.
- Arabic remains RTL.
- Non-Arabic languages remain LTR.
- Lesson navigation works for all 9 lessons.
- Next lesson buttons work.
- Envelope / Tracking selection still works.
- Lesson 03 mode toggle still works.
- Browser console has no blocking errors.
- Translation JSON files are valid.
- Translation keys match `en.json`.

## Pull Request Checklist

Before opening a pull request:

- Keep changes focused.
- Avoid unrelated formatting churn.
- Do not rewrite tutorial content unless the change is specifically a content edit.
- Do not change lesson structure unless needed for the requested fix.
- Confirm the site still works from a local static server.
