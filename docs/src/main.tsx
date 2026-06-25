import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DialogProvider } from "react-dialog-flow";
import "react-dialog-flow/ui/style.css";
import { App } from "./App";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>,
);
