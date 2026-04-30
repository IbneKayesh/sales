import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  useState,
  useRef,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// --- Context
const UIContext = createContext(null);

// --- Overlay
const LoadingOverlay = ({ isBusy }) => {
  if (!isBusy) return null;
  return <LoadingSpinner fullScreen />;
};

// --- Provider
export const AppUIProvider = ({ children }) => {
  const toastRef = useRef(null);
  const [isBusy, setIsBusy] = useState(false);

  // --- Toast API (structured)
  const showToast = useCallback((severity, summary, detail, life = 3000) => {
    toastRef.current?.show({ severity, summary, detail, life });
  }, []);

  // --- Promise confirm ✅
  const confirm = useCallback((options = {}) => {
    confirmDialog({
      message: options.message || "Are you sure?",
      header: options.header || "Confirmation",
      icon: options.icon || "pi pi-exclamation-triangle",
      acceptLabel: options.acceptLabel || "Yes",
      rejectLabel: options.rejectLabel || "No",
      accept: () => options.accept && options.accept(),
      reject: () => options.reject && options.reject(),
    });
  }, []);

  // --- Alert (OK only)
  const alert = useCallback((options = {}) => {
    confirmDialog({
      message: options.message || "Done",
      header: options.header || "Completed",
      icon: options.icon || "pi pi-check-circle text-green-500",
      acceptLabel: "OK",
      reject: null,
      rejectLabel: "",
      rejectClassName: "hidden",
      accept: () => options.accept && options.accept(),
    });
  }, []);

  const uiValue = useMemo(
    () => ({
      showToast,
      confirm,
      alert,
      isBusy,
      setIsBusy,
    }),
    [showToast, confirm, alert, isBusy, setIsBusy],
  );

  return (
    <UIContext.Provider value={uiValue}>
      <Toast ref={toastRef} position="top-right" />
      <ConfirmDialog />
      <LoadingOverlay isBusy={isBusy} />
      {children}
    </UIContext.Provider>
  );
};

// --- Hook
export const useAppUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useAppUI must be used within AppUIProvider");
  }
  return ctx;
};
