import type React from "react";
import { useDialogInstance } from "../react/DialogInstance";

export type DialogHeaderProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<"header"> & {
    closeButton?: boolean;
    closeButtonLabel?: string;
    closeButtonContent?: React.ReactNode;
    closeButtonProps?: Omit<
      React.ComponentPropsWithoutRef<"button">,
      "children" | "type" | "onClick"
    >;
  }
>;

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="rdf-dialog__close-icon"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function DialogHeader({
  children,
  closeButton = true,
  closeButtonLabel = "Close dialog",
  closeButtonContent,
  closeButtonProps,
  ...props
}: DialogHeaderProps) {
  const { close } = useDialogInstance();
  return (
    <header
      {...props}
      className={["rdf-dialog__header", props.className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {closeButton && (
        <button
          {...closeButtonProps}
          aria-label={closeButtonProps?.["aria-label"] ?? closeButtonLabel}
          className={["rdf-dialog__close-button", closeButtonProps?.className]
            .filter(Boolean)
            .join(" ")}
          onClick={() => close("header")}
          type="button"
        >
          {closeButtonContent ?? <CloseIcon />}
        </button>
      )}
    </header>
  );
}
