import type React from "react";

export type CloseReason = "esc" | "backdrop" | "header" | "programmatic";

export type RequestClose = (reason?: CloseReason) => void;

export type DialogResult<T = unknown> =
  | { status: "completed"; value: T }
  | { status: "dismissed"; reason: CloseReason };

/** Controls for the dialog entry currently being rendered. */
export type DialogInstance<T = unknown> = {
  id: string;
  close: RequestClose;
  complete: (value: T) => void;
};

export interface DialogOptions {
  /** Keep only one entry with the same `instanceKey` in the stack. */
  isSingleInstance?: boolean;
  /** Key used by `isSingleInstance`; defaults to the component display name. */
  instanceKey?: string;
  /** Invoked immediately before this entry is removed from the stack. */
  closeCallback?: (reason: CloseReason) => void;
}

export type DialogOpenProps<C extends React.ElementType> =
  React.ComponentPropsWithoutRef<C> & DialogOptions;

export type DialogEntry = DialogOptions & {
  id: string;
  Component: React.ElementType;
  props: Record<string, unknown> | null;
};

export type DialogStack = readonly DialogEntry[];

export interface CloseOptions {
  /** Close every open dialog. */
  isAll?: boolean;
  reason?: CloseReason;
  /** Close the first entry matching this predicate. */
  matcher?: (entry: DialogEntry) => boolean;
}

export type OpenDialog = <C extends React.ElementType>(
  Component: C,
  props?: DialogOpenProps<C>,
) => string;

export type AsyncDialogOptions<T> = {
  /** Maps a normal dismissal to the value expected by the calling flow. Defaults to false. */
  onDismiss?: (reason: CloseReason) => T;
};

export type DialogAsyncOpenProps<C extends React.ElementType, T> =
  DialogOpenProps<C> & AsyncDialogOptions<T>;

export type OpenAsyncResultDialog = <
  T = void,
  C extends React.ElementType = React.ElementType,
>(
  Component: C,
  props?: DialogOpenProps<C>,
) => Promise<DialogResult<T>>;

export type OpenAsyncDialog = {
  <T = void, C extends React.ElementType = React.ElementType>(
    Component: C,
    propsAndOptions: DialogAsyncOpenProps<C, T> & {
      onDismiss: (reason: CloseReason) => T;
    },
  ): Promise<T>;
  <T = void, C extends React.ElementType = React.ElementType>(
    Component: C,
    propsAndOptions?: DialogAsyncOpenProps<C, T>,
  ): Promise<T | false>;
};

export type CloseDialog = (options?: CloseOptions) => void;

export type DialogApi = {
  open: OpenDialog;
  openAsync: OpenAsyncDialog;
  openAsyncResult: OpenAsyncResultDialog;
  close: CloseDialog;
  closeTop: (reason?: CloseReason) => void;
  closeAll: (reason?: CloseReason) => void;
};

export type DialogProviderProps = React.PropsWithChildren<{
  /** Render the stack through a portal. Defaults to true. */
  withPortal?: boolean;
  /** Attach the portal to an existing element selected by CSS selector. */
  containerSelector?: string;
  /** ID for a portal element created under document.body. */
  portalId?: string;
  className?: string;
  zIndex?: number;
  /** Close the top entry when Escape is pressed. Defaults to true. */
  closeOnEscape?: boolean;
}>;
