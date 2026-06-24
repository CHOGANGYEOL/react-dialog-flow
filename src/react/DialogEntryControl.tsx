import { createContext, useContext } from "react";
import type { CloseReason, RequestClose } from "../core/types";

export type DialogEntryControl = {
  closeEntry: (reason?: CloseReason) => void;
  setRequestClose: (requestClose: RequestClose | null) => void;
};

export const DialogEntryControlContext =
  createContext<DialogEntryControl | null>(null);

export function useDialogEntryControl() {
  const control = useContext(DialogEntryControlContext);
  if (!control)
    throw new Error(
      "useDialogEntryControl must be used inside DialogRenderer.",
    );
  return control;
}
