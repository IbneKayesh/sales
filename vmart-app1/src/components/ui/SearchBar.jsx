import { Search } from "lucide-react";
import "./shared.css";

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`ui-search-bar ${className}`}>
    <div className="ui-search-icon">
      <Search size={16} color="#94a3b8" />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ui-search-input"
    />
  </div>
);

export default SearchBar;
