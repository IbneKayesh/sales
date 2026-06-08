import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutUI from "./pages/layout/LayoutUI";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LayoutUI />} />
      </Routes>
    </Router>
  );
}

export default App;
