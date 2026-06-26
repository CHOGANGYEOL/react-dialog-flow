import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DialogProvider, useDialog, useDialogInstance } from "../src";
import { Dialog } from "../src/ui";

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value() {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value() {
      this.removeAttribute("open");
    },
  });
});

afterEach(cleanup);

function ResultDialog() {
  const { complete } = useDialogInstance<boolean>();
  return (
    <Dialog motionDuration={180}>
      <Dialog.Header>
        <Dialog.Title>Confirm action</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description>This action needs a decision.</Dialog.Description>
      <button onClick={() => complete(true)}>Accept</button>
    </Dialog>
  );
}

function HeaderOnlyDialog() {
  return (
    <Dialog>
      <Dialog.Header />
    </Dialog>
  );
}

function EscapeDisabledDialog() {
  return (
    <Dialog closeOnEscape={false}>
      <Dialog.Header>
        <Dialog.Title>Required decision</Dialog.Title>
      </Dialog.Header>
    </Dialog>
  );
}

function BackdropDismissDialog() {
  return (
    <Dialog closeOnBackdrop motionDuration={180}>
      <Dialog.Header>
        <Dialog.Title>Backdrop dismissal</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description>Click outside to dismiss.</Dialog.Description>
    </Dialog>
  );
}

function StackDialog({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  const { complete } = useDialogInstance<string>();
  return (
    <Dialog closeOnBackdrop motionDuration={180}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <button onClick={() => complete(value)}>Complete {title}</button>
    </Dialog>
  );
}

function OpenAsyncFlow({ onResult }: { onResult: (value: boolean) => void }) {
  const { openAsync } = useDialog();
  return (
    <button
      onClick={async () =>
        onResult(
          await openAsync<boolean>(ResultDialog, { onDismiss: () => false }),
        )
      }
    >
      Open async
    </button>
  );
}

function OpenBackdropDismissFlow({
  onResult,
}: {
  onResult: (value: string) => void;
}) {
  const { openAsync } = useDialog();
  return (
    <button
      onClick={async () =>
        onResult(
          await openAsync<string>(BackdropDismissDialog, {
            onDismiss: (reason) => reason,
          }),
        )
      }
    >
      Open backdrop async
    </button>
  );
}

function OpenBackdropResultFlow({
  onResult,
}: {
  onResult: (value: unknown) => void;
}) {
  const { openAsyncResult } = useDialog();
  return (
    <button
      onClick={async () =>
        onResult(await openAsyncResult<string>(BackdropDismissDialog))
      }
    >
      Open backdrop result
    </button>
  );
}

function OpenResultFlow({ onResult }: { onResult: (value: unknown) => void }) {
  const { openAsyncResult } = useDialog();
  return (
    <button
      onClick={async () =>
        onResult(await openAsyncResult<boolean>(ResultDialog))
      }
    >
      Open result
    </button>
  );
}

function OpenStackedAsyncFlow({
  onFirst,
  onSecond,
}: {
  onFirst: (value: string) => void;
  onSecond: (value: string) => void;
}) {
  const { openAsync } = useDialog();
  return (
    <button
      onClick={() => {
        void openAsync<string>(StackDialog, {
          title: "First dialog",
          value: "first",
          onDismiss: (reason) => `first:${reason}`,
        }).then(onFirst);
        void openAsync<string>(StackDialog, {
          title: "Second dialog",
          value: "second",
          onDismiss: (reason) => `second:${reason}`,
        }).then(onSecond);
      }}
    >
      Open stacked async
    </button>
  );
}

function OpenHeaderOnlyFlow() {
  const { open } = useDialog();
  return (
    <button onClick={() => open(HeaderOnlyDialog)}>Open header only</button>
  );
}

function OpenEscapeDisabledFlow() {
  const { open } = useDialog();
  return (
    <button onClick={() => open(EscapeDisabledDialog)}>
      Open escape disabled
    </button>
  );
}

function OpenAndCloseTopFlow({
  onDismiss,
}: {
  onDismiss: (reason: string) => void;
}) {
  const { closeTop, openAsync } = useDialog();
  return (
    <>
      <button
        onClick={async () => {
          await openAsync<boolean>(ResultDialog, {
            onDismiss: (reason) => {
              onDismiss(reason);
              return false;
            },
          });
        }}
      >
        Open async
      </button>
      <button onClick={() => closeTop()}>Close top</button>
    </>
  );
}

function OpenAndCloseAllFlow({
  onDismiss,
}: {
  onDismiss: (reason: string) => void;
}) {
  const { closeAll, openAsync } = useDialog();
  return (
    <>
      <button
        onClick={async () => {
          await openAsync<boolean>(ResultDialog, {
            onDismiss: (reason) => {
              onDismiss(reason);
              return false;
            },
          });
        }}
      >
        Open async
      </button>
      <button onClick={() => closeAll()}>Close all</button>
    </>
  );
}

function finishDialogExit() {
  const panel =
    document.querySelector('dialog[data-state="closing"] .rdf-dialog__panel') ??
    document.querySelector(".rdf-dialog__panel");
  if (!panel) throw new Error("Dialog panel was not rendered.");
  fireEvent.transitionEnd(panel);
}

function clickTopBackdrop() {
  const backdrops = document.querySelectorAll<HTMLButtonElement>(
    ".rdf-dialog__backdrop",
  );
  const backdrop = backdrops[backdrops.length - 1];
  if (!backdrop) throw new Error("Dialog backdrop was not rendered.");
  fireEvent.click(backdrop);
}

describe("DialogProvider integration", () => {
  it("resolves openAsync with a completed value after the exit transition", async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    render(
      <DialogProvider>
        <OpenAsyncFlow onResult={onResult} />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open async" }));
    await user.click(await screen.findByRole("button", { name: "Accept" }));
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    expect(onResult).not.toHaveBeenCalled();
    finishDialogExit();
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
  });

  it("resolves an openAsync dismissal only after the exit transition", async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    render(
      <DialogProvider>
        <OpenBackdropDismissFlow onResult={onResult} />
      </DialogProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open backdrop async" }),
    );
    await screen.findByRole("heading", { name: "Backdrop dismissal" });
    clickTopBackdrop();

    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    expect(onResult).not.toHaveBeenCalled();
    finishDialogExit();
    await waitFor(() => expect(onResult).toHaveBeenCalledWith("backdrop"));
  });

  it("returns a dismiss reason for Escape through openAsyncResult", async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    render(
      <DialogProvider>
        <OpenResultFlow onResult={onResult} />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open result" }));
    await screen.findByRole("button", { name: "Accept" });
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    finishDialogExit();
    await waitFor(() =>
      expect(onResult).toHaveBeenCalledWith({
        status: "dismissed",
        reason: "esc",
      }),
    );
  });

  it("returns a dismiss reason for backdrop through openAsyncResult", async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    render(
      <DialogProvider>
        <OpenBackdropResultFlow onResult={onResult} />
      </DialogProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open backdrop result" }),
    );
    await screen.findByRole("heading", { name: "Backdrop dismissal" });
    clickTopBackdrop();
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    finishDialogExit();
    await waitFor(() =>
      expect(onResult).toHaveBeenCalledWith({
        status: "dismissed",
        reason: "backdrop",
      }),
    );
  });

  it("closes only the top dialog in a stacked async flow on Escape", async () => {
    const user = userEvent.setup();
    const onFirst = vi.fn();
    const onSecond = vi.fn();
    render(
      <DialogProvider>
        <OpenStackedAsyncFlow onFirst={onFirst} onSecond={onSecond} />
      </DialogProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open stacked async" }),
    );
    await screen.findByRole("heading", { name: "First dialog" });
    await screen.findByRole("heading", { name: "Second dialog" });

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      const dialogs = document.querySelectorAll("dialog");
      expect(dialogs).toHaveLength(2);
      expect(dialogs[1]?.dataset.state).toBe("closing");
    });
    expect(onFirst).not.toHaveBeenCalled();
    expect(onSecond).not.toHaveBeenCalled();

    finishDialogExit();
    await waitFor(() => expect(onSecond).toHaveBeenCalledWith("second:esc"));
    expect(onFirst).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "First dialog" })).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Second dialog" }),
    ).toBeNull();
  });

  it("keeps lower stacked dialogs open when the top backdrop closes", async () => {
    const user = userEvent.setup();
    const onFirst = vi.fn();
    const onSecond = vi.fn();
    render(
      <DialogProvider>
        <OpenStackedAsyncFlow onFirst={onFirst} onSecond={onSecond} />
      </DialogProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open stacked async" }),
    );
    await screen.findByRole("heading", { name: "First dialog" });
    await screen.findByRole("heading", { name: "Second dialog" });
    clickTopBackdrop();

    await waitFor(() => {
      const dialogs = document.querySelectorAll("dialog");
      expect(dialogs).toHaveLength(2);
      expect(dialogs[1]?.dataset.state).toBe("closing");
    });
    finishDialogExit();
    await waitFor(() =>
      expect(onSecond).toHaveBeenCalledWith("second:backdrop"),
    );
    expect(onFirst).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "First dialog" })).toBeTruthy();
  });

  it("uses the supplied dismiss fallback when closeTop closes an async entry", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn(() => false);
    render(
      <DialogProvider>
        <OpenAndCloseTopFlow onDismiss={onDismiss} />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open async" }));
    await screen.findByRole("button", { name: "Accept" });
    await user.click(screen.getByRole("button", { name: "Close top" }));
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    finishDialogExit();
    await waitFor(() => expect(onDismiss).toHaveBeenCalledWith("programmatic"));
  });

  it("uses the supplied dismiss fallback when closeAll closes an async entry", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn(() => false);
    render(
      <DialogProvider>
        <OpenAndCloseAllFlow onDismiss={onDismiss} />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open async" }));
    await screen.findByRole("button", { name: "Accept" });
    await user.click(screen.getByRole("button", { name: "Close all" }));
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    finishDialogExit();
    await waitFor(() => expect(onDismiss).toHaveBeenCalledWith("programmatic"));
  });

  it("connects Dialog.Title and Dialog.Description to the native dialog", async () => {
    render(
      <DialogProvider>
        <OpenResultFlow onResult={() => undefined} />
      </DialogProvider>,
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Open result" }));

    const dialog = document.querySelector("dialog");
    const title = screen.getByRole("heading", { name: "Confirm action" });
    const description = screen.getByText("This action needs a decision.");
    await waitFor(() => {
      expect(dialog?.getAttribute("aria-labelledby")).toBe(title.id);
      expect(dialog?.getAttribute("aria-describedby")).toBe(description.id);
    });
  });

  it("injects base UI styles once and applies structural classes", async () => {
    const user = userEvent.setup();
    render(
      <DialogProvider>
        <OpenResultFlow onResult={() => undefined} />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open result" }));
    expect(
      document.querySelectorAll("#react-dialog-flow-base-style"),
    ).toHaveLength(1);
    expect(
      screen
        .getByRole("heading", { name: "Confirm action" })
        .classList.contains("rdf-dialog__title"),
    ).toBe(true);
    expect(
      screen
        .getByText("This action needs a decision.")
        .classList.contains("rdf-dialog__description"),
    ).toBe(true);

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() =>
      expect(document.querySelector("dialog")?.dataset.state).toBe("closing"),
    );
    finishDialogExit();
    await waitFor(() => expect(document.querySelector("dialog")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Open result" }));
    expect(
      document.querySelectorAll("#react-dialog-flow-base-style"),
    ).toHaveLength(1);
  });

  it("keeps the header close button aligned to the end without children", async () => {
    const user = userEvent.setup();
    render(
      <DialogProvider>
        <OpenHeaderOnlyFlow />
      </DialogProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open header only" }));
    const closeButton = document.querySelector(".rdf-dialog__close-button");

    expect(closeButton).not.toBeNull();
    expect(closeButton?.getAttribute("aria-label")).toBe("Close dialog");
    expect(
      document
        .getElementById("react-dialog-flow-base-style")
        ?.textContent?.includes(
          ".rdf-dialog__header > .rdf-dialog__close-button",
        ),
    ).toBe(true);
  });

  it("keeps a dialog open when closeOnEscape is false", async () => {
    const user = userEvent.setup();
    render(
      <DialogProvider>
        <OpenEscapeDisabledFlow />
      </DialogProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open escape disabled" }),
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).not.toBeNull();
    await waitFor(() => expect(dialog?.dataset.state).toBe("open"));

    fireEvent.keyDown(dialog!, { key: "Escape" });
    dialog!.dispatchEvent(new Event("cancel", { bubbles: false }));

    expect(document.querySelector("dialog")?.dataset.state).toBe("open");
  });
});
