# Changelog

## 0.1.0-beta.3 — 2026-06-25

- Add default classes and theme styles for dialog title, description, body, and
  footer slots.
- Inject required base dialog styles automatically when the UI primitive
  renders.
- Split required base styles from the optional bundled theme stylesheet.

## 0.1.0-beta.2 — 2026-06-25

- Add package metadata for the documentation site, repository, and issue
  tracker.
- Add live documentation links and social metadata for the docs app.
- Update install examples to target the beta dist-tag while the package is in
  beta.

## 0.1.0-beta.1 — 2026-06-24

First public beta.

- Component-based dialog stacks with `open`, `closeTop`, and `closeAll`.
- Result-bearing flows through `openAsync`, `openAsyncResult`, and
  `useDialogInstance().complete`.
- Optional native-dialog UI with transitions, focus restoration, accessible
  title and description primitives, and configurable close controls.
- Live documentation playground and React integration coverage for async
  completion, dismissal, animation lifecycle, and ARIA wiring.
