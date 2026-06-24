import { useDialog, useDialogStack } from "react-dialog-flow";
import { AlertDialog, ConfirmDialog, type Log } from "../Dialogs";

export function FlowControls({
  className,
  onLog,
}: {
  className: string;
  onLog: Log;
}) {
  const { closeAll, closeTop, open, openAsync } = useDialog();
  const stack = useDialogStack();
  const openAlert = () => {
    const id = open(AlertDialog, {
      message:
        "A regular stack entry. Open another dialog, then close this from the dock.",
      onLog,
      closeCallback: (reason) => onLog(`Alert closed (${reason})`),
    });
    onLog(`Alert opened (${id.slice(0, 8)})`);
  };
  const openConfirm = () => {
    const id = open(ConfirmDialog, {
      title: "Regular confirm",
      description:
        "This entry is opened with open(). Its buttons still exercise the shared close lifecycle.",
      onLog,
      closeCallback: (reason) => onLog(`Confirm closed (${reason})`),
    });
    onLog(`Confirm opened (${id.slice(0, 8)})`);
  };
  const openAsyncConfirm = async () => {
    onLog("Async confirm opened");
    const value = await openAsync<boolean>(ConfirmDialog, {
      title: "Async confirm",
      description:
        "Choose a result, then watch the log after the exit animation completes.",
      onLog,
      onDismiss: (reason) => {
        onLog(`Async dismissed: ${reason}`);
        return false;
      },
    });
    onLog(`Async completed: ${String(value)}`);
  };
  return (
    <aside aria-label="Dialog flow controls" className={className}>
      <span className="stack-count">Stack {stack.length}</span>
      <button className="primary" onClick={openConfirm}>
        Open confirm
      </button>
      <button onClick={openAlert}>Open alert</button>
      <button onClick={() => void openAsyncConfirm()}>Open async</button>
      <button
        disabled={stack.length === 0}
        onClick={() => {
          onLog("Close top requested");
          closeTop();
        }}
      >
        Close top
      </button>
      <button
        disabled={stack.length === 0}
        onClick={() => {
          onLog("Close all requested");
          closeAll();
        }}
      >
        Close all
      </button>
    </aside>
  );
}
