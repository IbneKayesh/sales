export default function LeftFlyout({ open, onClose }) {
  return (
    <>
      {open && <div className="drawerOverlay" onClick={onClose} />}

      <aside className={`drawer ${open ? "show" : ""}`}>
        <h2>Menu</h2>

        <a href="#">🏠 Home</a>
        <a href="#">👤 Profile</a>
        <a href="#">🔔 Notifications</a>
        <a href="#">📦 Orders</a>
        <a href="#">⚙️ Settings</a>
      </aside>
    </>
  );
}
