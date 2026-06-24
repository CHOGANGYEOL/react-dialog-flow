import type React from "react";
import type {
  CloseOptions,
  DialogEntry,
  DialogOpenProps,
  DialogStack,
} from "./types";

export const OPEN_DIALOG = "OPEN_DIALOG" as const;
export const CLOSE_DIALOG = "CLOSE_DIALOG" as const;

export type OpenDialogAction = {
  type: typeof OPEN_DIALOG;
  payload: DialogEntry;
};
export type CloseDialogAction = {
  type: typeof CLOSE_DIALOG;
  payload?: CloseOptions;
};
export type DialogAction = OpenDialogAction | CloseDialogAction;

function componentName(Component: React.ElementType) {
  return (
    (Component as { displayName?: string; name?: string }).displayName ??
    (Component as { displayName?: string; name?: string }).name ??
    "dialog"
  );
}

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `dialog-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function openDialog<C extends React.ElementType>(
  Component: C,
  props?: DialogOpenProps<C>,
): OpenDialogAction {
  const { isSingleInstance, instanceKey, closeCallback, ...elementProps } =
    props ?? {};

  return {
    type: OPEN_DIALOG,
    payload: {
      id: createId(),
      Component,
      isSingleInstance,
      instanceKey: instanceKey ?? componentName(Component),
      closeCallback,
      props:
        Object.keys(elementProps).length > 0
          ? (elementProps as Record<string, unknown>)
          : null,
    },
  };
}

export function closeDialog(options?: CloseOptions): CloseDialogAction {
  return { type: CLOSE_DIALOG, payload: options };
}

export function dialogsReducer(
  stack: DialogStack,
  action: DialogAction,
): DialogStack {
  switch (action.type) {
    case OPEN_DIALOG: {
      const entry = action.payload;

      if (entry.isSingleInstance) {
        const index = stack.findIndex(
          (current) => current.instanceKey === entry.instanceKey,
        );
        if (index >= 0) {
          const next = [...stack];
          next[index] = entry;
          return next;
        }
      }

      return [...stack, entry];
    }
    case CLOSE_DIALOG: {
      if (stack.length === 0) return stack;
      const { isAll, matcher } = action.payload ?? {};

      if (isAll) return [];
      if (matcher) {
        const index = stack.findIndex(matcher);
        if (index < 0) return stack;
        return stack.filter((_, currentIndex) => currentIndex !== index);
      }

      return stack.slice(0, -1);
    }
  }
}

export function entriesToClose(
  stack: DialogStack,
  options?: CloseOptions,
): DialogEntry[] {
  if (stack.length === 0) return [];
  if (options?.isAll) return [...stack];

  if (options?.matcher) {
    const entry = stack.find(options.matcher);
    return entry ? [entry] : [];
  }

  const top = stack[stack.length - 1];
  return top ? [top] : [];
}
