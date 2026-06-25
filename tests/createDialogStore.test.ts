import { describe, expect, it, vi } from "vitest";
import {
  closeDialog,
  dialogsReducer,
  entriesToClose,
  openDialog,
} from "../src/core/createDialogStore";

function ConfirmDialog(_props: { title?: string }) {
  return null;
}

function AlertDialog(_props: { message?: string }) {
  return null;
}

describe("dialog stack reducer", () => {
  it("opens dialogs in stack order", () => {
    const first = openDialog(ConfirmDialog, { title: "Delete?" });
    const second = openDialog(AlertDialog, { message: "Done" });

    const stack = dialogsReducer(dialogsReducer([], first), second);

    expect(stack.map((entry) => entry.id)).toEqual([
      first.payload.id,
      second.payload.id,
    ]);
  });

  it("closes only the top dialog by default", () => {
    const first = openDialog(ConfirmDialog);
    const second = openDialog(AlertDialog);
    const stack = dialogsReducer(dialogsReducer([], first), second);

    expect(dialogsReducer(stack, closeDialog())).toEqual([first.payload]);
  });

  it("closes every dialog and calls the selected close callbacks", () => {
    const onClose = vi.fn();
    const first = openDialog(ConfirmDialog, { closeCallback: onClose });
    const second = openDialog(AlertDialog, { closeCallback: onClose });
    const stack = dialogsReducer(dialogsReducer([], first), second);
    const victims = entriesToClose(stack, { isAll: true });

    victims.forEach((entry) => entry.closeCallback?.("programmatic"));

    expect(dialogsReducer(stack, closeDialog({ isAll: true }))).toEqual([]);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("replaces a single-instance dialog with the same instance key", () => {
    const first = openDialog(ConfirmDialog, {
      isSingleInstance: true,
      instanceKey: "confirm",
      title: "First",
    });
    const second = openDialog(ConfirmDialog, {
      isSingleInstance: true,
      instanceKey: "confirm",
      title: "Second",
    });

    const stack = dialogsReducer(dialogsReducer([], first), second);

    expect(stack).toEqual([second.payload]);
  });
});
