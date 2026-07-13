import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useContextMenu } from '../../context/ContextMenuContext';
import DesktopIcon from './DesktopIcon';
import Window from '../Window/Window';
import FilesPage from '../../pages/FilesPage';
import GalleryPage from '../../pages/GalleryPage';
import SettingsPage from '../../pages/SettingsPage';
import SalesApp from '../../pages/Sales/SalesApp';
import styles from './Desktop.module.css';

const desktopIconsList = [
  { id: 'files',     label: 'Finder' },
  { id: 'gallery',   label: 'System Gallery' },
  { id: 'settings',  label: 'System Settings' },
  { id: 'sales',     label: 'Sales' },
  { id: 'documents', label: 'Documents' },
  { id: 'trash',     label: 'Trash' },
];

const DocumentsView = () => (
  <div className={styles.placeholderView}>
    <h2>Documents</h2>
    <p>This is a simulated document reader. Double-click document files from Finder to open them here.</p>
  </div>
);

const TrashView = () => (
  <div className={styles.placeholderView}>
    <h2>Trash</h2>
    <p>The trash bin is currently empty. Deleted files and folders will appear here before permanent erasure.</p>
  </div>
);

const WINDOW_COMPONENTS = {
  files:     <FilesPage />,
  gallery:   <GalleryPage />,
  settings:  <SettingsPage />,
  sales:     <SalesApp />,
  documents: <DocumentsView />,
  trash:     <TrashView />,
};

const Desktop = () => {
  const { windows, openWindow } = useWindowManager();
  const { showMenu } = useContextMenu();
  const [selectedIconId, setSelectedIconId] = useState(null);

  const handleDesktopClick = () => setSelectedIconId(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  };

  return (
    <div
      className={styles.desktopWorkspace}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.iconsGrid}>
        {desktopIconsList.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            isSelected={selectedIconId === icon.id}
            onClick={() => setSelectedIconId(icon.id)}
            onDoubleClick={() => openWindow(icon.id)}
          />
        ))}
      </div>

      <div className={styles.windowsContainer}>
        {windows.map((win) => (
          <Window key={win.id} {...win}>
            {WINDOW_COMPONENTS[win.id] ?? null}
          </Window>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
