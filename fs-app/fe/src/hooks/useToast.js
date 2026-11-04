import { useContext } from "react";
import { ToastContext } from "../providers/toastContext";

export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error("useToast must be used inside a ToastProvider");
  }

  return toast;
}
