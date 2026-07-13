import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState(null);

  const confirm = useCallback((title, description, options = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        title,
        description,
        resolve,
        options,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState) {
      dialogState.resolve(true);
      setDialogState(null);
    }
  }, [dialogState]);

  const handleCancel = useCallback(() => {
    if (dialogState) {
      dialogState.resolve(false);
      setDialogState(null);
    }
  }, [dialogState]);

  return (
    <ConfirmContext.Provider value={{ confirm, dialogState, handleConfirm, handleCancel }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
