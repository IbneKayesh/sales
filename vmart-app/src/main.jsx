import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

//primereact UI
//import "primereact/resources/themes/lara-light-purple/theme.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
//internal imports
import { PrimeReactProvider } from "primereact/api";
import { getStorageLoginData } from "@/utils/storage";

const value = {
  locale: "en",
  ripple: true,
};

// 🔥 Theme Loader Component
const ThemeLoader = ({ children }) => {
  useEffect(() => {
    const savedTheme = getStorageLoginData()?.theme || "green";

    const linkId = "erp-theme-css";
    let existingLink = document.getElementById(linkId);

    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `/themes/index-${savedTheme}.css`;
    // example: index-blue.css, index-red.css, index-green.css

    document.head.appendChild(link);
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <ThemeLoader>
        <App />
      </ThemeLoader>
    </PrimeReactProvider>
  </StrictMode>,
);
