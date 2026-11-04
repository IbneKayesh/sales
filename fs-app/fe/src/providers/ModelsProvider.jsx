import { useEffect, useMemo, useState } from "react";
import { ModelsContext } from "./modelsContext";
import { modelsApi } from "../lib/api/repositories";

/** Loads model/*.json from the API once and exposes them to every form. */
export function ModelsProvider({ children }) {
  const [models, setModels] = useState({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await modelsApi.list();
        if (!cancelled) setModels(data ?? {});
      } catch {
        // Model validation is a guard rail; forms still work without it.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      models,
      getModel: (collection) => models[collection] ?? null,
    }),
    [models]
  );

  return <ModelsContext.Provider value={value}>{children}</ModelsContext.Provider>;
}
