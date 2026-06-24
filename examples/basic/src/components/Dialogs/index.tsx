import { useDialogInstance } from "react-dialog-flow";
import { Dialog } from "react-dialog-flow/ui";
import { FlowControls } from "../Playground/FlowControls";

export type Log = (message: string) => void;
type ConfirmProps = { title: string; description: string; onLog: Log };
type AlertProps = { message: string; onLog: Log };

const dialogProps = { motionDuration: 180, panel: { className: "dialog-panel" } } as const;

export function ConfirmDialog({ title, description, onLog }: ConfirmProps) {
  const { complete } = useDialogInstance<boolean>();
  return <Dialog {...dialogProps} closeOnBackdrop overlay={<FlowControls className="dialog-dock" onLog={onLog} />}>
    <Dialog.Header className="dialog-header"><Dialog.Title>{title}</Dialog.Title></Dialog.Header>
    <Dialog.Body><Dialog.Description>{description}</Dialog.Description></Dialog.Body>
    <Dialog.Footer className="dialog-actions"><button onClick={() => complete(false)}>Decline</button><button className="primary" onClick={() => complete(true)}>Confirm</button></Dialog.Footer>
  </Dialog>;
}

export function AlertDialog({ message, onLog }: AlertProps) {
  const { close } = useDialogInstance();
  return <Dialog {...dialogProps} closeOnBackdrop overlay={<FlowControls className="dialog-dock" onLog={onLog} />}>
    <Dialog.Header className="dialog-header"><Dialog.Title>Alert</Dialog.Title></Dialog.Header>
    <Dialog.Body><p>{message}</p></Dialog.Body>
    <Dialog.Footer className="dialog-actions"><button className="primary" onClick={() => close("programmatic")}>Got it</button></Dialog.Footer>
  </Dialog>;
}
