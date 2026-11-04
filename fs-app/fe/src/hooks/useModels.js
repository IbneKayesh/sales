import { useContext } from "react";
import { ModelsContext } from "../providers/modelsContext";

export function useModels() {
  const models = useContext(ModelsContext);

  if (!models) {
    throw new Error("useModels must be used inside a ModelsProvider");
  }

  return models;
}
