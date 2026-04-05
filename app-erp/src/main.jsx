import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//primereact UI
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-purple/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
//internal imports
import { PrimeReactProvider } from "primereact/api";

const value = {
  locale: "en",
  ripple: true,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
