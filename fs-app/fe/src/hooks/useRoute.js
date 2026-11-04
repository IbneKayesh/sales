import { useEffect, useState } from "react";
import { currentPath, subscribeToRoute } from "../lib/router";

export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => subscribeToRoute(() => setPath(currentPath())), []);

  return path;
}
