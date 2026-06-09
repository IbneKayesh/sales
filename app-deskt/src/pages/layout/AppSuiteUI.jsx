import { useMemo, useState } from "react";
import { appCatalog } from "../../modules/appCatalog";
import "./AppSuiteUI.css";

const AppSuiteUI = ({ onOpenPageClick }) => {
  const [items, setItems] = useState(appCatalog);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return items;
    return items.filter((item) => item.name.toLowerCase().includes(text));
  }, [items, query]);

  const handleAppSuiteItemClick = (item) => {
    if (item.child?.length) {
      setHistory((prev) => [...prev, items]);
      setItems(item.child);
      setQuery("");
      return;
    }

    if (item.forms) {
      onOpenPageClick(item);
    }
  };

  const handleBackClick = () => {
    if (!history.length) return;

    const prevItems = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setItems(prevItems);
    setQuery("");
  };

  return (
    <div className="app-suite">
      <div className="app-suite-header">App Suite</div>
      <div className="app-suite-search">
        <button
          className="btn-default"
          onClick={handleBackClick}
          disabled={history.length === 0}
          type="button"
        >
          Back
        </button>
        <input
          className="input-default"
          placeholder="Search apps"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="app-suite-grid">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            className="app-suite-item"
            onClick={() => handleAppSuiteItemClick(item)}
            type="button"
          >
            <span className="app-suite-icon" title={item.name}>
              <img
                src={"../src/assets/icons/" + item.icon}
                alt={item.name}
                height="56"
                width="56"
              />
            </span>
            <span className="app-suite-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppSuiteUI;
