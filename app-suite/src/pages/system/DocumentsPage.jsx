import { useState } from 'react';

import { IconFolderOpen, IconFile, IconFileImage, IconFileCode, IconFilePdf, IconHomeSimple, IconTrendingUp, IconPencil, IconSearch, IconSearch as IconSearchIcon, IconMore } from '@/assets/icons';
import CollapsiblePanel from '@/components/CollapsiblePanel/CollapsiblePanel';
import './DocumentsPage.css';
const typeIcon = (type) => {
  switch (type) {
    case 'folder': return <IconFolderOpen />;
    case 'image':  return <IconFileImage />;
    case 'code':   return <IconFileCode />;
    case 'pdf':    return <IconFilePdf />;
    default:       return <IconFile />;
  }
};

const typeBadge = (type) => {
  switch (type) {
    case 'folder': return 'badgeFolder';
    case 'image':  return 'badgeImage';
    case 'code':   return 'badgeCode';
    case 'pdf':    return 'badgePdf';
    default:       return 'badgeFile';
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
    <div className="page">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <CollapsiblePanel title="Quick Access" defaultOpen size="sm">
          <button className={`sidebarItem ${!activeFolder ? 'sidebarActive' : ''}`} onClick={() => setActiveFolder(null)}>
            <IconHomeSimple className="sidebarIcon" />
            All Files
          </button>
          <button className="sidebarItem">
            <IconTrendingUp className="sidebarIcon" />
            Recent
          </button>
          <button className="sidebarItem">
            <IconPencil className="sidebarIcon" />
            Favorites
          </button>
        </CollapsiblePanel>

        <CollapsiblePanel title="Folders" defaultOpen size="sm">
          {FOLDERS.map((folder) => (
            <button
              key={folder.id}
              className={`sidebarItem sidebarFolder ${activeFolder === folder.id ? 'sidebarActive' : ''}`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <IconFolderOpen />
              <span className="sidebarLabel">{folder.name}</span>
              <span className="sidebarCount">{folder.items}</span>
            </button>
          ))}
        </CollapsiblePanel>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="main">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbarLeft">
            <h2 className="pageTitle">{activeFolder ? FOLDERS.find((f) => f.id === activeFolder)?.name : 'All Files'}</h2>
            <span className="fileCount">{filtered.length} file{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="searchWrap">
            <IconSearch className="searchIcon" />
            <input
              type="text"
              className="searchInput"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* File List */}
        <div className="fileList">
          {filtered.length === 0 ? (
            <div className="empty">
              <IconFile className="emptyIcon" />
              <h3>No files found</h3>
              <p>{search ? 'Try a different search term.' : 'This folder is empty.'}</p>
            </div>
          ) : (
            filtered.map((file) => (
              <div
                key={file.id}
                className={`fileRow ${selectedFile?.id === file.id ? 'fileRowSelected' : ''}`}
                onClick={() => handleFileClick(file)}
              >
                <div className={`fileIcon ${typeBadge(file.type)}`}>
                  {typeIcon(file.type)}
                </div>
                <div className="fileInfo">
                  <div className="fileName">{file.name}</div>
                  <div className="fileMeta">
                    <span className={`fileBadge ${typeBadge(file.type)}`}>{typeLabel(file.type)}</span>
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
                <button className="fileAction" title="More options" onClick={(e) => e.stopPropagation()}>
                  <IconMore />
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
