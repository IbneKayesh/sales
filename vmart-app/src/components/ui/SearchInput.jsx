/**
 * SearchInput – Reusable search input with built-in search icon.
 * Places the icon AFTER the input in the DOM so it overlays correctly.
 *
 * @example
 * <SearchInput placeholder="Search..."
 *   value={query} onChange={(e) => setQuery(e.target.value)} />
 *
 * <SearchInput icon={false} placeholder="No icon variant..."
 *   value={query} onChange={(e) => setQuery(e.target.value)} />
 */
import { FiSearch, FiLoader } from "react-icons/fi";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  iconClassName = "",
  icon = true,
  loading = false,
  id,
  name,
  type = "search",
  ...props
}) {
  const inputClasses = `ui-search-input ${inputClassName}`.trim();
  const iconClasses = iconClassName || "ui-search-icon";

  return (
    <div className={`ui-search ${className}`.trim()}>
      <input
        type={type}
        id={id}
        name={name || id}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {icon && (loading ? (
        <FiLoader size={14} className={`${iconClasses} ui-search-spinner`} />
      ) : (
        <FiSearch size={14} className={iconClasses} />
      ))}
    </div>
  );
}
