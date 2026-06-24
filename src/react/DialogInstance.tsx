import { createContext, useContext } from "react";
import type { DialogInstance } from "../core/types";

export const DialogInstanceContext = createContext<DialogInstance | null>(null);

/** Returns controls for the dialog entry currently being rendered. */
export function useDialogInstance<T = unknown>() {
  const instance = useContext(
    DialogInstanceContext,
  ) as DialogInstance<T> | null;
  if (!instance)
    throw new Error(
      "useDialogInstance must be used inside a dialog rendered by DialogRenderer.",
    );
  return instance;
}
