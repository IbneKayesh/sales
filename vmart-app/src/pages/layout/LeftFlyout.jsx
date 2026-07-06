import { useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiBell, FiPackage, FiSettings } from "react-icons/fi";

const drawerItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/auth/login", icon: FiUser, label: "Profile" },
  { path: "/shop", icon: FiBell, label: "Notifications" },
  { path: "/shopping", icon: FiPackage, label: "Orders" },
  { path: "/shop", icon: FiSettings, label: "Settings" },
];

export default function LeftFlyout({ open, onClose }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}

      <aside className={`drawer-panel${open ? " drawer-panel--open" : ""}`}>
        <h2 className="drawer-title">Menu</h2>

        <nav>
          <ul className="drawer-list">
            {drawerItems.map(({ path, icon: Icon, label }) => (
              <li key={label}>
                <button className="drawer-link" onClick={() => handleNav(path)}>
                  <Icon />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
