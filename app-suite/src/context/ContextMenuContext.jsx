import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ContextMenuContext = createContext();

export const ContextMenuProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(null);

  const closeMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  useEffect(() => {
    if (!menuState) return;
    const handleClose = () => {
      closeMenu();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('click', handleClose);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClose);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuState, closeMenu]);

  const showMenu = useCallback((x, y, context) => {
    setMenuState({ x, y, context });
  }, []);

  return (
    <ContextMenuContext.Provider value={{ menuState, showMenu, closeMenu }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
};
