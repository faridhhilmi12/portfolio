# Portfolio React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static portfolio of Muhammad Farid Hilmi as a Vite + React + TypeScript + Tailwind site with an interactive "Figma canvas" feel, keeping every behavior of the static site.

**Architecture:** One page, no router. Content lives in typed `src/data/*`; all prose and names live in two typed dictionaries (`id.ts` is the source of keys, `en.ts` must match). `LangProvider` and `ThemeProvider` wrap the app; components read them through `useT()`, `useLang()`, `useTheme()`. Canvas effects (selection box, dot grid, draggable photo, collaborator cursor) are gated by one hook, `useCanvasMotion()`.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `motion` (import from `motion/react`), Vitest + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-03-portfolio-react-design.md`. The legacy static site, once moved to `legacy/`, is the source of all copy: Indonesian text in `legacy/index.html`, English in the `EN` object of `legacy/script.js`, links in its `LINKS`.

## Global Constraints

- Working directory `E:\portfolio`. The folder is not a git repo. Commit steps run only after the owner agrees to `git init` (ask once at execution start); if declined, skip every commit step.
- Copy is moved verbatim from `legacy/`. Never rewrite a sentence.
- Rule for strings: every prose string, name, org, date, and title goes through the dictionaries, with the same key in both languages. Where legacy had no translation (e.g. "Waldo", "LMS Telkomsat", "Telkomsat, Bogor"), add a key with identical text in both. Plain data (not in dictionaries): project `tags`, `certs`, ids, years.
- Dictionary keys reuse legacy `data-i18n` names (`nav.work`, `hero.lead`, `work.p1.desc`, `exp.e2.org`, `skills.d1`, `contact.title`, `footer.made`, ...). Project keys: `work.<id>.{role,title,sub,desc}` plus `work.p3.note`. Experience keys: `exp.<id>.{date,title,org,desc}`. Skill keys: `skills.d1`..`skills.d5`, `skills.c1`..`skills.c5`. New keys: `meta.title`, `meta.desc`, `nav.theme`, `nav.menu`, `hero.cursor`, `inspect.title`, `inspect.role`, `inspect.about`, `inspect.stack`.
- Tokens (verbatim from legacy `styles.css`). Light: paper `#FFFFFF`, surface `#F4F4F5`, band `#EDEDEE`, ink `#27272A`, body `#3F3F46`, muted `#63636A`, line `#E2E2E4`, line-strong `#D4D4D8`, dash `#B4B4B9`, underline `#A1A1AA`, select `#0D99FF`, select-strong `#0A6FC2`. Dark: paper `#121214`, surface `#1C1C1F`, band `#18181B`, ink `#F4F4F5`, body `#D4D4D8`, muted `#A1A1AA`, line `#2E2E33`, line-strong `#3A3A40`, dash `#52525B`, underline `#71717A`, select `#38B0FF`, select-strong `#1A73C7`. Font: Hanken Grotesk 400/500/600/700/800. Wrap max width 1120px.
- Dark mode: `<html data-theme="light|dark">` is always set (inline script before React sets it from `localStorage('theme')`, else from `prefers-color-scheme`). Tailwind variant: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.
- `localStorage` keys: `lang` (`'id'|'en'`), `theme` (`'light'|'dark'`). Every access is in try/catch.
- Placeholder site URL everywhere: `https://faridhhilmi12.netlify.app/` (owner replaces before release).
- No animation when `prefers-reduced-motion: reduce`. Cursor and parallax only when `(hover: hover) and (pointer: fine)`. Animate only `transform`/`opacity`.
- Viewports checked: 375, 768, 1280 px; no horizontal scroll.
- Test command: `npx vitest run`. Type check: `npx tsc -b`. Build: `npm run build`.

## Review Focus

- `localStorage` throws (blocked storage): app still renders and toggles work in memory. Pinned in Task 2 and 3.
- Saved `lang`/`theme` holds an invalid value (`"fr"`, `"purple"`): defaults are used. Task 2 and 3.
- A project `image` that fails to load: the wireframe shows instead. Task 8.
- Changing language while a project frame is selected keeps that selection. Task 8.
- Every optional link in `LINKS` empty: no empty anchors render, the email button still does. Task 2 and 9.

## File Structure

| Path | Responsibility |
|---|---|
| `index.html` | static SEO metadata, JSON-LD, theme/`lang` boot script, `<noscript>` summary, `#root` |
| `src/index.css` | `@import "tailwindcss"`, `@theme` tokens, dark variant |
| `src/main.tsx`, `src/App.tsx` | mount providers, assemble sections |
| `src/data/{projects,experience,skills,links}.ts` | typed content, no prose |
| `src/i18n/{id,en}.ts`, `LangProvider.tsx` | dictionaries, `useLang`, `useT` |
| `src/theme/ThemeProvider.tsx` | `useTheme` |
| `src/lib/storage.ts` | `readStore(key)`, `writeStore(key, value)` safe wrappers |
| `src/canvas/{useCanvasMotion,SelectionBox,DotGrid,Reveal}.tsx` | shared canvas primitives |
| `src/components/` | `Nav`, `Hero`, `CollaboratorCursor`, `Projects`, `ProjectFrame`, `Inspect`, `Timeline`, `Skills`, `Contact`, `Footer`, `ExtLink` |
| `src/test/{setup,media}.ts` | jsdom stubs, `mockMedia` helper |
| `public/` | `assets/farid.jpg`, `robots.txt`, `sitemap.xml` |
| `legacy/` | old static site, untouched copy |
| `netlify.toml` | build + cache headers |

---

### Task 1: Scaffold, tokens, static SEO shell

**Files:**
- Move: `index.html`, `styles.css`, `script.js` → `legacy/`; `assets/` → `public/assets/`; `robots.txt`, `sitemap.xml` → `public/`
- Create: `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`, `src/test/media.ts`, `src/test/seo.test.ts`, `netlify.toml`, `.gitignore`

**Interfaces:**
- Produces: `mockMedia(opts: { reducedMotion?: boolean; finePointer?: boolean; dark?: boolean }): void` in `src/test/media.ts` (installs `window.matchMedia` answering those three queries, others `false`); `src/test/setup.ts` registers jest-dom, stubs `ResizeObserver` and `IntersectionObserver` (no-op classes), calls default `mockMedia({finePointer: true})`, and clears `localStorage` in `afterEach`.

- [ ] **Step 1: Move legacy files** into `legacy/` and `public/` as listed (use `mv`; keep copies byte-identical). Verify `legacy/index.html` opens standalone.
- [ ] **Step 2: Scaffold** Vite `react-ts` template into the project root (generate in the scratchpad directory and copy `package.json`, `tsconfig*.json`, `vite.config.ts`; do not overwrite `docs/` or `legacy/`). Install `motion tailwindcss @tailwindcss/vite` and dev deps `vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`. Configure `vite.config.ts` with the Tailwind plugin and `test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true, css: false }`.
- [ ] **Step 3: Write failing test `src/test/seo.test.ts`** reading root `index.html`, `public/robots.txt`, `public/sitemap.xml` with `fs`:
  - `index.html` contains `<link rel="canonical" href="https://faridhhilmi12.netlify.app/">`, `og:title`, `og:image` starting with that origin, `twitter:card`, two `theme-color` metas, and a `<noscript>` block.
  - the `application/ld+json` script parses as JSON with `@type === 'Person'` and `name === 'Muhammad Farid Hilmi'`.
  - `robots.txt` contains `Sitemap: https://faridhhilmi12.netlify.app/sitemap.xml`; `sitemap.xml` contains `<loc>https://faridhhilmi12.netlify.app/</loc>`.
- [ ] **Step 4: Run** `npx vitest run src/test/seo.test.ts`. Expected: FAIL (index.html lacks tags).
- [ ] **Step 5: Write root `index.html`**: head copied from `legacy/index.html` (meta, og, twitter, theme-color, JSON-LD, favicon, Google Fonts link for Hanken Grotesk), with every URL switched to the placeholder origin and `/assets/farid.jpg`. Add inline boot script: read `theme` (valid values only) else `matchMedia('(prefers-color-scheme: dark)')`, set `document.documentElement.dataset.theme`; read `lang` and set `<html lang>` only when valid. Body: `<div id="root"></div>`, `<noscript>` with a two-sentence summary of the hero lead (ID then EN, verbatim from `hero.lead`), `<script type="module" src="/src/main.tsx">`. Update `public/robots.txt` and `public/sitemap.xml` to the placeholder origin.
- [ ] **Step 6: Write `src/index.css`**: `@import "tailwindcss";`, the dark `@custom-variant`, and `@theme` defining color tokens (names `paper surface band ink body muted line line-strong dash underline select select-strong`) for light; dark values override the same CSS variables under `:root[data-theme="dark"]` so utilities like `bg-paper` need no `dark:` prefix. Set `--font-sans` to Hanken Grotesk stack and base `body` styles (17px/1.6, `bg-paper text-ink`).
- [ ] **Step 7: Minimal `App.tsx`** renders `<h1>Muhammad Farid Hilmi</h1>`; `main.tsx` mounts it. Add `netlify.toml`: `[build] command = "npm run build"`, `publish = "dist"`, and a `[[headers]]` for `/assets/*` with `Cache-Control = "public, max-age=31536000, immutable"`. Add `.gitignore` (`node_modules`, `dist`).
- [ ] **Step 8: Run** `npx vitest run`, `npx tsc -b`, `npm run build`. Expected: PASS, no type errors, `dist/index.html` exists.
- [ ] **Step 9: Commit** `chore: scaffold vite react ts tailwind, move legacy site`.

---

### Task 2: Data, dictionaries, language provider

**Files:**
- Create: `src/lib/storage.ts`, `src/data/{projects,experience,skills,links}.ts`, `src/i18n/{id,en}.ts`, `src/i18n/LangProvider.tsx`, `src/i18n/i18n.test.tsx`

**Interfaces:**
- Produces:
  - `readStore(key: string): string | null`, `writeStore(key: string, value: string): void` (both swallow errors).
  - `type Wire = 'app' | 'dashboard' | 'lms' | 'site'`; `interface Project { id: 'p1'|'p2'|'p3'|'p4'; year: number; tags: string[]; wire: Wire; image?: string; isPrivate?: boolean; link?: string }`; `export const projects: Project[]` (order p1..p4, p3 `isPrivate: true`, years/tags from legacy).
  - `interface Experience { id: 'e1'|'e2'|'e3'|'e4' }`; `export const experience: Experience[]`.
  - `export const designSkills: string[]` (`['d1'..'d5']`), `codeSkills: string[]` (`['c1'..'c5']`), `certs: string[]`, `pairs: Array<[string, string]>` = `[['d1','c2'],['d3','c1'],['d4','c3'],['d4','c5']]`.
  - `type LinkKey = 'email'|'emailText'|'linkedin'|'github'|'instagram'|'winme'|'projects'`; `LINKS: Record<LinkKey, string>` (values from legacy); `linkHref(key: LinkKey): string | null` (null when empty).
  - `id.ts`: `export const id = {...}` with all keys; `export type MessageKey = keyof typeof id`. `en.ts`: `export const en: Record<MessageKey, string>`.
  - `type Lang = 'id' | 'en'`; `LangProvider({children})`; `useLang(): { lang: Lang; setLang(l: Lang): void }`; `useT(): (key: MessageKey) => string`.
- Behavior: initial lang = valid stored `lang`, else `navigator.language` starting with `id` → `'id'`, else `'en'`. `setLang` stores it, sets `document.documentElement.lang`, `document.title = t('meta.title')`, and the `meta[name=description]` content to `t('meta.desc')`.

- [ ] **Step 1: Write failing tests in `i18n.test.tsx`**:
  - `Object.keys(en)` equals `Object.keys(id)` (sorted).
  - `linkHref('instagram')` returns the legacy URL; with `vi.spyOn`/object patch setting `LINKS.winme = ''`, `linkHref('winme')` is `null`.
  - Render `<LangProvider><Probe/></LangProvider>` with `Probe` showing `useT()('nav.work')`: with `localStorage.lang='en'` shows `Work`; with `lang='fr'` and `navigator.language='id-ID'` shows `Karya`; calling `setLang('en')` sets `document.title` to the English title and `document.documentElement.lang` to `en`.
  - With `Storage.prototype.getItem` and `setItem` made to throw, the provider still renders and `setLang('en')` still switches the text (storage blocked).
- [ ] **Step 2: Run** `npx vitest run src/i18n`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement** `storage.ts`, data files, `id.ts` (ID copy from `legacy/index.html`), `en.ts` (EN from legacy `EN` plus the identical-text keys per Global Constraints and the new keys: `hero.cursor` `Halo! 👋`/`Hi! 👋`, `inspect.title` `Inspect`/`Inspect`, `inspect.role` `Peran`/`Role`, `inspect.about` `Deskripsi`/`Description`, `inspect.stack` `Stack`/`Stack`, `meta.title`/`meta.desc` ID from legacy `<title>`/description), and `LangProvider.tsx`.
- [ ] **Step 4: Run** `npx vitest run src/i18n && npx tsc -b`. Expected: PASS, no type errors.
- [ ] **Step 5: Commit** `feat: typed data, dictionaries, language provider`.

---

### Task 3: Theme provider

**Files:**
- Create: `src/theme/ThemeProvider.tsx`, `src/theme/theme.test.tsx`

**Interfaces:**
- Consumes: `readStore`, `writeStore`.
- Produces: `ThemeProvider({children})`; `useTheme(): { theme: 'light'|'dark'; toggle(): void }`.
- Behavior: initial theme = `document.documentElement.dataset.theme` if valid, else valid stored `theme`, else system (`mockMedia({dark})`). `toggle()` flips, writes `theme`, sets `data-theme`, adds class `no-anim` to `<html>` and removes it after two animation frames. Add CSS in `index.css`: `.no-anim, .no-anim *, .no-anim *::before, .no-anim *::after { transition: none !important; }`. Without a stored choice, it follows later system changes; after a manual toggle it stops following.

- [ ] **Step 1: Write failing tests**: stored `dark` → `data-theme="dark"` after mount; stored `purple` with `mockMedia({dark:true})` → `dark`; `toggle()` flips and persists `localStorage.theme`; right after `toggle()` `<html>` has class `no-anim`; with storage throwing, toggle still flips `data-theme`.
- [ ] **Step 2: Run** `npx vitest run src/theme`. Expected: FAIL.
- [ ] **Step 3: Implement** `ThemeProvider.tsx` and the `.no-anim` CSS.
- [ ] **Step 4: Run** `npx vitest run src/theme`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: theme provider with flash-free toggle`.

---

### Task 4: Canvas primitives

**Files:**
- Create: `src/canvas/useCanvasMotion.ts`, `src/canvas/SelectionBox.tsx`, `src/canvas/DotGrid.tsx`, `src/canvas/Reveal.tsx`, `src/canvas/canvas.test.tsx`

**Interfaces:**
- Produces:
  - `useCanvasMotion(): { animate: boolean; finePointer: boolean }`; `animate` false under `(prefers-reduced-motion: reduce)`; `finePointer` true only for `(hover: hover) and (pointer: fine)`.
  - `SelectionBox(props: { selected?: boolean; badge?: ReactNode; showSize?: boolean; className?: string; children: ReactNode })`: wraps children; when `selected` (default `true`) draws a 1.5px `select` border and four 9px corner handles (`data-testid="handle"`), the badge below-center, and when `showSize` a label `` `${Math.round(w)} × ${Math.round(h)}` `` (`data-testid="size-label"`) tracked with `ResizeObserver`. Draw-in animation only when `animate`.
  - `DotGrid(props: { className?: string; children?: ReactNode })`: absolute dot-pattern background; parallax shift (max 8px) from mouse only when `animate && finePointer`.
  - `Reveal(props: { delay?: number; children: ReactNode })`: `motion.div` fading/translating in `whileInView` once; renders plain `div` when `!animate`.

- [ ] **Step 1: Write failing tests**: `useCanvasMotion` returns `{animate:false}` under `mockMedia({reducedMotion:true})` and `finePointer:false` under `mockMedia({finePointer:false})`; `SelectionBox` renders 4 handles and the badge text when selected, 0 handles when `selected={false}`; with a stubbed `ResizeObserver` that reports `{width: 412, height: 168}` the size label reads `412 × 168`; `Reveal` under reduced motion renders its children without a `style` opacity of 0.
- [ ] **Step 2: Run** `npx vitest run src/canvas`. Expected: FAIL.
- [ ] **Step 3: Implement** the four files (handles and border use `select`/`paper` tokens; badge uses `select-strong` with white text).
- [ ] **Step 4: Run** `npx vitest run src/canvas && npx tsc -b`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: canvas primitives`.

---

### Task 5: Nav, footer, shell

**Files:**
- Create: `src/components/{Nav,Footer,ExtLink}.tsx`, `src/components/useActiveSection.ts`, `src/components/nav.test.tsx`
- Modify: `src/App.tsx`, `src/main.tsx` (wrap with `LangProvider`, `ThemeProvider`)

**Interfaces:**
- Consumes: `useT`, `useLang`, `useTheme`, `linkHref`.
- Produces:
  - `useActiveSection(ids: string[]): string | null` (IntersectionObserver with `rootMargin: '-45% 0px -54% 0px'`).
  - `ExtLink(props: { linkKey: LinkKey; className?: string; children: ReactNode })`: renders `null` when `linkHref` is null; `target="_blank" rel="noopener"` for `http` URLs.
  - `Nav()`: sticky bar, brand "Farid Hilmi", links to `#karya #pengalaman #keahlian #kontak` labelled `nav.work/exp/skills/contact`, ID/EN buttons (`aria-pressed`), theme button (`aria-label` = `nav.theme`), mobile menu button (`aria-label` = `nav.menu`, `aria-expanded`, `aria-controls="nav-links"`), shadow class after `scrollY > 8`, active link `aria-current="location"`. Skip link `#karya`.
  - `Footer()`: `© {year} Muhammad Farid Hilmi` + `footer.made`.

- [ ] **Step 1: Write failing tests**: menu button toggles `aria-expanded`, `Escape` closes it, clicking a link closes it; clicking `EN` sets `aria-pressed="true"` on EN and shows `Work`; theme button flips `data-theme`; with a stubbed `IntersectionObserver` firing an intersecting entry for `#karya`, the Work link gets `aria-current="location"`; `ExtLink` with `LINKS.winme = ''` renders no anchor.
- [ ] **Step 2: Run** `npx vitest run src/components/nav`. Expected: FAIL.
- [ ] **Step 3: Implement** the components and wire `App.tsx` (skip link, Nav, `<main id="top">`, Footer).
- [ ] **Step 4: Run** `npx vitest run && npx tsc -b`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: nav, footer, providers wired`.

---

### Task 6: Hero with draggable frame photo

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/hero.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `SelectionBox`, `DotGrid`, `useCanvasMotion`, `useT`, `ExtLink`.
- Produces: `Hero()`: `DotGrid` background; frame label `hero.frame`; `SelectionBox` (`showSize`, badge `UI/UX Designer + Developer`) around `<h1>Muhammad<br>Farid Hilmi</h1>`; the redline `48` (hidden below 760px); `hero.lead`; buttons `hero.cta1` → `#karya`, `hero.cta2` → `#kontak`; photo `figure` with `/assets/farid.jpg` (`width=640 height=640`, `fetchpriority="high"`, `decoding="async"`, alt `hero.alt`) and caption `Bogor, Jawa Barat`. Photo is a `motion.figure` with `drag`, `dragSnapToOrigin`, `dragElastic: 0.2` only when `animate && finePointer`; otherwise a static `figure`.

- [ ] **Step 1: Write failing tests**: renders heading "Muhammad Farid Hilmi" (accessible name), both CTAs with correct `href`, image `src` ends `/assets/farid.jpg`; under `mockMedia({reducedMotion:true})` the figure has no `draggable`/drag handlers (assert `data-drag="false"` attribute you set on the static variant) and under normal media `data-drag="true"`.
- [ ] **Step 2: Run** `npx vitest run src/components/hero`. Expected: FAIL.
- [ ] **Step 3: Implement** `Hero.tsx`; mount in `App.tsx`. Layout per legacy `styles.css` (`.hero` grid 1.55fr/1fr, photo `aspect-ratio 4/5`, mobile: photo first, 200px).
- [ ] **Step 4: Run** `npx vitest run && npx tsc -b`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: hero with selection box and draggable photo`.

---

### Task 7: Collaborator cursor

**Files:**
- Create: `src/components/CollaboratorCursor.tsx`, `src/components/cursor.test.tsx`
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `useCanvasMotion`, `useT`.
- Produces: `CollaboratorCursor(props: { targets: RefObject<HTMLElement | null>[] })`: renders `null` unless `animate && finePointer`; otherwise an `aria-hidden` pointer arrow with label `Farid` that moves through the targets' centers in order (loop, ~2.2s per move, `motion` animate on `x`/`y`), and shows a comment bubble (`hero.cursor`) when resting on the last target. Mounted in `Hero` with refs for name, photo, and primary CTA.

- [ ] **Step 1: Write failing tests**: with `mockMedia({reducedMotion:true})` renders nothing; with `mockMedia({finePointer:false})` renders nothing; with default media renders an element with `aria-hidden="true"` containing text `Farid`.
- [ ] **Step 2: Run** `npx vitest run src/components/cursor`. Expected: FAIL.
- [ ] **Step 3: Implement** component and mount it in `Hero`.
- [ ] **Step 4: Run** `npx vitest run && npx tsc -b`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: collaborator cursor`.

---

### Task 8: Projects as frames with Inspect panel

**Files:**
- Create: `src/components/{Projects,ProjectFrame,Inspect,Wireframe}.tsx`, `src/components/projects.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `projects`, `Project`, `SelectionBox`, `Reveal`, `useT`, `MessageKey`.
- Produces:
  - `Wireframe(props: { kind: Wire })`: decorative abstract SVG/div skeleton, `aria-hidden`.
  - `ProjectFrame(props: { project: Project; selected: boolean; onSelect(): void })`: label above (`{title} · {year}`), a `<button aria-pressed={selected}>` containing a `SelectionBox` (`selected`, badge = role) around the preview (`<img>` when `project.image`, falling back to `Wireframe` on `onError`; `Wireframe` when absent). Private projects get a dashed border.
  - `Inspect(props: { project: Project })`: heading `inspect.title`; rows `inspect.role` → `work.<id>.role`, `inspect.about` → `work.<id>.desc` (+ `work.p3.note` when private), `inspect.stack` → tags as pills; `aria-live="polite"`.
  - `Projects()`: section `#karya` with `work.title` and `work.intro`; 2-column grid (`md`), 1 column below; state `selectedId` defaults to `'p1'`; on screens under 768px `Inspect` renders directly under the selected frame (accordion), otherwise below the grid.

- [ ] **Step 1: Write failing tests**: four buttons render, first has `aria-pressed="true"`; clicking the p2 button switches Inspect to show the `work.p2.desc` text; pressing `Enter` on the focused p3 button selects it and the Inspect text includes the `work.p3.note` copy; a project with `image: '/x.png'` shows an `<img>` and, after firing `error` on it, shows the wireframe; with LangProvider switched to `en` while p2 is selected, p2 stays `aria-pressed="true"` and Inspect shows the English description.
- [ ] **Step 2: Run** `npx vitest run src/components/projects`. Expected: FAIL.
- [ ] **Step 3: Implement** the four components; mount `Projects` after `Hero` in `App.tsx`. Hover styling per legacy `.project:hover` only under `(hover: hover)`.
- [ ] **Step 4: Run** `npx vitest run && npx tsc -b`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: project frames and inspect panel`.

---

### Task 9: Timeline, Skills, Contact

**Files:**
- Create: `src/components/{Timeline,Skills,Contact}.tsx`, `src/components/sections.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `experience`, `designSkills`, `codeSkills`, `certs`, `pairs`, `ExtLink`, `Reveal`, `useT`.
- Produces: `Timeline()` section `#pengalaman` (four entries in legacy order, keys `exp.<id>.*`); `Skills()` section `#keahlian` with `skills.title/intro`, two columns (`skills.design`, `skills.code`) joined by the diamond line, certifications chips; hovering or focusing (`tabIndex=0`) a skill gives its paired skills `data-paired="true"` and the others none; `Contact()` section `#kontak` on `band` background with `contact.title/lead`, buttons `contact.email` (`ExtLink email`), `contact.winme`, `contact.projects`, and socials list (LinkedIn, GitHub, `Instagram @faridhhilmi`, email text).

- [ ] **Step 1: Write failing tests**: Timeline shows four headings in order; focusing the `skills.d1` item sets `data-paired="true"` on the `skills.c2` item and not on `skills.c4`; with every optional link emptied only the email button and email text anchors remain in Contact; Contact buttons have the legacy `href`s (`mailto:faridmochilmi@gmail.com`, winme, projects.co.id).
- [ ] **Step 2: Run** `npx vitest run src/components/sections`. Expected: FAIL.
- [ ] **Step 3: Implement** the three components; assemble final `App.tsx` order: Nav, Hero, Projects, Timeline, Skills, Contact, Footer.
- [ ] **Step 4: Run** `npx vitest run && npx tsc -b && npm run build`. Expected: PASS, build succeeds.
- [ ] **Step 5: Commit** `feat: timeline, skills pairing, contact`.

---

### Task 10: Parity verification and docs

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/plans/parity-report.md` (results, written at the end)

**Interfaces:**
- Consumes: the complete app.

- [ ] **Step 1: Rewrite `README.md`** (Indonesian): structure table, `npm install`, `npm run dev`, `npm run build`, `npm test`; where to edit content (`src/data`, `src/i18n`); Netlify steps (connect repo, build `npm run build`, publish `dist`; Vercel uses the Vite preset); the exact list of files holding the placeholder URL (`index.html` canonical/`og:url`/`og:image`/`twitter:image`/JSON-LD, `public/robots.txt`, `public/sitemap.xml`); note that `LINKS` and JSON-LD social links must be changed together; note `legacy/` can be deleted after the owner approves.
- [ ] **Step 2: Full automated run**: `npx vitest run && npx tsc -b && npm run build`. Expected: all green. Record output in the parity report.
- [ ] **Step 3: Browser check** with `npm run dev` in the built-in browser at 375, 768, 1280 px, light and dark. For each parity item in spec section 8, record pass/fail: ID/EN text identical to legacy (spot-check hero, p1, e2, contact), tab title and meta description change with language, theme persists across reload with no flash, mobile menu and Esc, active nav link, no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), frame selection and Inspect, photo drag springs back, cursor visible on desktop only, console empty. Also emulate `prefers-reduced-motion: reduce` and confirm no cursor/drag/parallax.
- [ ] **Step 4: Check `dist/index.html`** contains the canonical, `og:*`, JSON-LD, and `<noscript>`; confirm smooth-scroll was not testable in the preview pane and say so in the report.
- [ ] **Step 5: Write `parity-report.md`** with every item and its result, listing any failure verbatim. Fix failures (new task commits) before reporting done.
- [ ] **Step 6: Commit** `docs: readme and parity report`.

---

## Self-Review Notes

- Spec coverage: stack/structure (T1), SEO static + noscript + robots/sitemap (T1), data/i18n/storage errors (T2), theme + no flash (T1 boot script, T3), canvas primitives and reduced-motion (T4), nav/menu/active link (T5), hero/draggable photo (T6), cursor (T7), project frames/Inspect/private/image fallback/accordion (T8), timeline/skills pairing/contact (T9), deploy config (T1), parity list, build checks, README placeholder list (T10).
- Decision recorded: dark mode is driven only by `data-theme` (always set by the boot script, from system when nothing is stored), which satisfies the spec's "follows the system when no manual choice" while keeping one Tailwind variant.
- Content for owner review: the skill `pairs` in `src/data/skills.ts` are provisional.
