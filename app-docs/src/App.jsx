import { useState } from "react";
import "./App.css";
import Features from "./pages/Features";
import Tables from "./pages/Tables";
import Topbar from "./pages/Topbar";

function App() {
  const [selectedTab, setSelectedTab] = useState("");
  const handleSelectTab = (tabNo) => {
    setSelectedTab(tabNo);
  };

  return (
    <div className="app-container">
      <Topbar onSelectTab={handleSelectTab} activeTab={selectedTab} />
      <main className="app-content">
        {selectedTab === "features" && <Features />}
        {selectedTab === "tables" && <Tables />}
      </main>
    </div>
  );
}

export default App;
