import "./app.css";
import { AppShell } from "./components/layout/AppShell";
import { BankingProvider } from "./providers/BankingProvider";
import { ModelsProvider } from "./providers/ModelsProvider";
import { ToastProvider } from "./providers/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <ModelsProvider>
        <BankingProvider>
          <AppShell />
        </BankingProvider>
      </ModelsProvider>
    </ToastProvider>
  );
}
