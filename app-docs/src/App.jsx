import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
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
    <>
      <Topbar onSelectTab={handleSelectTab} />
      {selectedTab === "features" && <Features />}
      {selectedTab === "tables" && <Tables />}
    </>
  );
}

export default App;
