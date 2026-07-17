
import { useWindowManager } from '../../context/WindowManagerContext';
import WindowTab from './WindowTab';
import './WindowTabs.css';
const WindowTabs = () => {
  const { windows } = useWindowManager();

  const openWindows = windows.filter((win) => win.isOpen);

  if (openWindows.length === 0) return null;

  return (
    <nav className="tabsContainer" aria-label="Open Applications">
      {openWindows.map((win) => (
        <WindowTab key={win.id} window={win} />
      ))}
    </nav>
  );
};

export default WindowTabs;
