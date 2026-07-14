import React, { useState } from 'react';
import styles from './DocumentsPage.module.css';

// ── Icon utilities ────────────────────────────────────────────────────────
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const PdfIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const typeIcon = (type) => {
  switch (type) {
    case 'folder': return <FolderIcon />;
    case 'image':  return <ImageIcon />;
    case 'code':   return <CodeIcon />;
    case 'pdf':    return <PdfIcon />;
    default:       return <FileIcon />;
  }
};

const typeBadge = (type) => {
  switch (type) {
    case 'folder': return styles.badgeFolder;
    case 'image':  return styles.badgeImage;
    case 'code':   return styles.badgeCode;
    case 'pdf':    return styles.badgePdf;
    default:       return styles.badgeFile;
  }
};

const typeLabel = (type) => {
  switch (type) {
    case 'folder': return 'Folder';
    case 'image':  return 'Image';
    case 'code':   return 'Script';
    case 'pdf':    return 'PDF';
    default:       return 'File';
  }
};

// ── Mock data ─────────────────────────────────────────────────────────────
const FOLDERS = [
  { id: 'f1', name: 'Projects', items: 8, type: 'folder' },
  { id: 'f2', name: 'Reports', items: 4, type: 'folder' },
  { id: 'f3', name: 'Assets', items: 12, type: 'folder' },
  { id: 'f4', name: 'Archives', items: 6, type: 'folder' },
];

const FILES = [
  { id: 'd1', name: 'Q2_Sales_Report.pdf', type: 'pdf', size: '2.4 MB', modified: '2 hours ago' },
  { id: 'd2', name: 'hero-banner-dark.png', type: 'image', size: '1.8 MB', modified: 'Yesterday' },
  { id: 'd3', name: 'app-config.js', type: 'code', size: '12 KB', modified: '2 days ago' },
  { id: 'd4', name: 'Project_Proposal_Final.pdf', type: 'pdf', size: '4.2 MB', modified: '3 days ago' },
  { id: 'd5', name: 'team-photo-2026.jpg', type: 'image', size: '3.6 MB', modified: '5 days ago' },
  { id: 'd6', name: 'api-routes.ts', type: 'code', size: '8 KB', modified: '1 week ago' },
  { id: 'd7', name: 'invoice-template.pdf', type: 'pdf', size: '0.9 MB', modified: '1 week ago' },
  { id: 'd8', name: 'dashboard-mockup.png', type: 'image', size: '5.1 MB', modified: '2 weeks ago' },
];

const DocumentsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const q = search.toLowerCase().trim();
  const filtered = FILES.filter((f) => {
    if (q && !f.name.toLowerCase().includes(q)) return false;
    if (activeFolder) {
      const folderMap = { f1: 'Projects', f2: 'Reports', f3: 'Assets', f4: 'Archives' };
      // Folders with images belong to Assets, PDFs to Reports/Projects, code to Projects
      if (folderMap[activeFolder] === 'Assets' && f.type !== 'image') return false;
      if (folderMap[activeFolder] === 'Reports' && !f.name.includes('Report')) return false;
      if (folderMap[activeFolder] === 'Archives') return false;
      if (folderMap[activeFolder] === 'Projects' && f.type === 'image') return false;
    }
    return true;
  });

  const handleFileClick = (file) => {
    setSelectedFile(selectedFile?.id === file.id ? null : file);
  };

  return (
    <div className={styles.page}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>Quick Access</h3>
          <button className={`${styles.sidebarItem} ${!activeFolder ? styles.sidebarActive : ''}`} onClick={() => setActiveFolder(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sidebarIcon}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            All Files
          </button>
          <button className={styles.sidebarItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sidebarIcon}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Recent
          </button>
          <button className={styles.sidebarItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sidebarIcon}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Favorites
          </button>
        </div>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>Folders</h3>
          {FOLDERS.map((folder) => (
            <button
              key={folder.id}
              className={`${styles.sidebarItem} ${styles.sidebarFolder} ${activeFolder === folder.id ? styles.sidebarActive : ''}`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <FolderIcon />
              <span className={styles.sidebarLabel}>{folder.name}</span>
              <span className={styles.sidebarCount}>{folder.items}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h2 className={styles.pageTitle}>{activeFolder ? FOLDERS.find((f) => f.id === activeFolder)?.name : 'All Files'}</h2>
            <span className={styles.fileCount}>{filtered.length} file{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.searchWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* File List */}
        <div className={styles.fileList}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <h3>No files found</h3>
              <p>{search ? 'Try a different search term.' : 'This folder is empty.'}</p>
            </div>
          ) : (
            filtered.map((file) => (
              <div
                key={file.id}
                className={`${styles.fileRow} ${selectedFile?.id === file.id ? styles.fileRowSelected : ''}`}
                onClick={() => handleFileClick(file)}
              >
                <div className={`${styles.fileIcon} ${typeBadge(file.type)}`}>
                  {typeIcon(file.type)}
                </div>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileMeta}>
                    <span className={`${styles.fileBadge} ${typeBadge(file.type)}`}>{typeLabel(file.type)}</span>
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
                <button className={styles.fileAction} title="More options" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
