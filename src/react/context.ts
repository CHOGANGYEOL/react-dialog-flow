import { createContext } from "react";
import type {
  CloseReason,
  DialogApi,
  DialogStack,
  RequestClose,
} from "../core/types";

export const DialogStateContext = createContext<DialogStack | null>(null);
export const DialogDispatchContext = createContext<DialogApi | null>(null);

export type DialogEntryDispatch = {
  finalizeClose: (id: string, reason: CloseReason) => void;
  registerCloseRequest: (id: string, requestClose: RequestClose | null) => void;
  setResult: (id: string, value: unknown) => void;
};

export const DialogEntryDispatchContext =
  createContext<DialogEntryDispatch | null>(null);
