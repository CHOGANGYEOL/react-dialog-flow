# Changelog

## Unreleased

- Add integration coverage for async dismissal timing, ensuring `openAsync`
  resolves only after the dialog exit lifecycle completes.
- Add coverage for Escape and backdrop dismissal reasons across
  `openAsyncResult` and `onDismiss`.
- Add stacked dialog coverage to confirm Escape and backdrop dismissal close
  only the top entry while lower entries remain mounted.

### Migration notes

- No application code changes are required. This release clarifies and tests
  existing behavior.
- If your app depends on async dialog promises resolving immediately when a
  close is requested, move that work to the dialog action handler or set
  `motionDuration={0}` for dialogs that should resolve without an exit delay.
- In stacked flows, Escape and backdrop dismissal are top-entry operations.
  Use `closeAll()` when the intended behavior is to dismiss every open entry.

## 0.1.0-beta.4 — 2026-06-25

- Expose additional CSS custom properties for dialog styling.
- Improve docs positioning around async dialog flows.
- Add branded logo assets, favicon, and social metadata.
- Keep the header close button aligned when no header children are provided.

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
