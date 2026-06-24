import { useContext } from "react";
import { DialogDispatchContext, DialogStateContext } from "./context";

export function useDialog() {
  const dialog = useContext(DialogDispatchContext);
  if (!dialog) throw new Error("useDialog must be used inside DialogProvider.");
  return dialog;
}

export function useDialogStack() {
  const stack = useContext(DialogStateContext);
  if (!stack)
    throw new Error("useDialogStack must be used inside DialogProvider.");
  return stack;
}
