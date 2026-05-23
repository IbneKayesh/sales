import React, { createContext, useCallback, useContext, useState } from "react";
import ConfirmBox from "../components/ConfirmBox.jsx";

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        message,
        title: options.title ?? "Confirm",
        confirmLabel: options.confirmLabel ?? "Yes",
        cancelLabel: options.cancelLabel ?? "No",
        resolve,
      });
    });
  }, []);

  const close = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return React.createElement(
    ConfirmContext.Provider,
    { value: { confirm } },
    children,
    dialog &&
      React.createElement(ConfirmBox, {
        message: dialog.message,
        title: dialog.title,
        confirmLabel: dialog.confirmLabel,
        cancelLabel: dialog.cancelLabel,
        onConfirm: () => close(true),
        onCancel: () => close(false),
      }),
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export default ConfirmContext;
