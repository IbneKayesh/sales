import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { WindowManagerProvider } from '@/context/WindowManagerContext';
import { DesktopProvider } from '@/context/DesktopContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
import MenuBar from '@/components/MenuBar/MenuBar';
import AppLauncher from '@/components/AppLauncher/AppLauncher';
import Dock from '@/components/Dock/Dock';
import Desktop from '@/components/Desktop/Desktop';
import FeedbackDialog from '@/components/Feedback/FeedbackDialog';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import styles from './DesktopLayout.module.css';

const DesktopLayout = () => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  const toggleLauncher = () => setIsLauncherOpen((prev) => !prev);
  const closeLauncher = () => setIsLauncherOpen(false);

  return (
    <FeedbackProvider>
      <DesktopProvider>
        <WindowManagerProvider>
          <div className={styles.layout}>
            <MenuBar toggleLauncher={toggleLauncher} isLauncherOpen={isLauncherOpen} />

            <div className={styles.mainArea}>
              <Desktop />
              <Dock />

              {isLauncherOpen && (
                <AppLauncher isOpen={isLauncherOpen} closeLauncher={closeLauncher} />
              )}

              <ContextMenu />
            </div>
          </div>

          {/* Outlet: keeps React Router lifecycle active but is visually hidden */}
          <div className={styles.hiddenOutlet}>
            <Outlet />
          </div>

          <FeedbackDialog />
        </WindowManagerProvider>
      </DesktopProvider>
    </FeedbackProvider>
  );
};

export default DesktopLayout;
