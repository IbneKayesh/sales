import {
  BrowserRouter as Router,
  useRoutes,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Providers
import { AppUIProvider } from "./hooks/useAppUI";
import { AuthProvider } from "./hooks/useAuth";

// Routes list
import AppRoutesList from "./routes/index.tsx";

const AppRoutes = () => {
  const routes = useRoutes(AppRoutesList);
  return routes;
};

function App() {
  return (
    <AppUIProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </AppUIProvider>
  );
}

export default App;
