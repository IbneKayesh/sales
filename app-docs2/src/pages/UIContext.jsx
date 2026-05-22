import { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {

  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const value = useMemo(
    () => ({
      selectedTableId,
      setSelectedTableId,
      selectedFeatureId,
      setSelectedFeatureId,
    }),
    [selectedTableId, selectedFeatureId],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

