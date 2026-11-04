import { Search } from "lucide-react";

export function SearchField({ value, onChange, placeholder = "Search…", label }) {
  return (
    <div className="search-field">
      <span className="search-field__icon">
        <Search size={14} aria-hidden="true" />
      </span>
      <input
        className="input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
