# react-dialog-flow

A headless dialog stack manager for React, based on the dialog provider used in
`ext-wallet-fe`.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## Project layout

- `src/core`: React-independent registry, stack, and store logic.
- `src/react`: React Provider, hook, and headless renderer integration.
- `tests`: Core-store tests.
- `examples/basic`: A small consumer example with custom dialog UI.

## Current API

The component-based API also supports result-bearing dialog flows with
`openAsync`.

```tsx
import { DialogProvider, useDialog, useDialogInstance } from 'react-dialog-flow';

function ConfirmDialog({ title }: { title: string }) {
  const { close } = useDialogInstance();

  return (
    <section role="dialog">
      <h2>{title}</h2>
      <button onClick={() => close('header')}>Cancel</button>
    </section>
  );
}

function Page() {
  const { open } = useDialog();

  return <button onClick={() => open(ConfirmDialog, { title: 'Delete?' })}>Delete</button>;
}

function App() {
  return <DialogProvider><Page /></DialogProvider>;
}
```

For a dialog that returns a value, complete it from the entry context. The
promise resolves after its exit animation has finished.

```tsx
function ConfirmDialog() {
  const { complete, close } = useDialogInstance<boolean>();
  return <>
    <button onClick={() => complete(true)}>Confirm</button>
    <button onClick={() => close('header')}>Cancel</button>
  </>;
}

const confirmed = await openAsync<boolean>(ConfirmDialog, {
  onDismiss: () => false,
});

// Use openAsyncResult when the dismissal reason matters.
const result = await openAsyncResult<boolean>(ConfirmDialog);
```

`DialogProvider` creates a portal container by default and renders the stack
there. Set `withPortal={false}` and render `DialogRenderer` yourself when the
application needs to control placement.

## Optional UI primitives

The stack manager remains headless. Import a native-dialog primitive when an
app wants a styled backdrop, panel, header close button, Escape handling,
scroll-lock, and enter/exit transitions:

```tsx
import { Dialog } from 'react-dialog-flow/ui';
import 'react-dialog-flow/ui/style.css';
```

`Dialog` supplies sensible defaults and exposes `className`, `backdropClassName`,
`backdropProps`, `panel`, `data-state`, and CSS custom properties for overriding
them. The default motion duration is 180ms; set `motionDuration={0}` to disable
it. `Dialog.Header` includes an SVG close icon by default; use `closeButtonContent`
or `closeButtonProps` to customize it.

Use `Dialog.Title` for the dialog's accessible name. `Dialog.Description` is
optional and links supporting text through `aria-describedby`. `initialFocusRef`
and `finalFocusRef` override the default focus placement and restoration.
