import React, { useState } from 'react';
import styles from './FilesPage.module.css';

const directories = [
  { name: 'Documents', count: 18, color: '#3b82f6' },
  { name: 'Downloads', count: 42, color: '#10b981' },
  { name: 'Gallery', count: 125, color: '#ec4899' },
  { name: 'Projects', count: 8, color: '#f59e0b' },
];

const mockFiles = [
  { name: 'q4_sales_report.xlsx', size: '2.4 MB', type: 'excel', modified: '2 hours ago' },
  { name: 'presentation_draft.pptx', size: '14.8 MB', type: 'powerpoint', modified: 'Yesterday' },
  { name: 'resume_revised.pdf', size: '840 KB', type: 'pdf', modified: '3 days ago' },
  { name: 'avatar_backup.png', size: '1.2 MB', type: 'image', modified: 'Last week' },
  { name: 'index.js', size: '12 KB', type: 'code', modified: 'Last month' },
  { name: 'package.json', size: '2.1 KB', type: 'code', modified: 'Last month' },
];

const FilesPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const getFileIcon = (type) => {
    switch (type) {
      case 'excel':
        return (
          <svg className={styles.fileIconExcel} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        );
      case 'powerpoint':
        return (
          <svg className={styles.fileIconPpt} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <rect x="8" y="12" width="8" height="6" rx="1" />
          </svg>
        );
      case 'pdf':
        return (
          <svg className={styles.fileIconPdf} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="10" y1="12" x2="14" y2="16" />
            <line x1="14" y1="12" x2="10" y2="16" />
          </svg>
        );
      case 'image':
        return (
          <svg className={styles.fileIconImg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      default:
        return (
          <svg className={styles.fileIconDefault} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <h1 className={styles.title}>File Explorer</h1>
          <p className={styles.subtitle}>Browse and manage system documents</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Folder</span>
          </button>
          <button className={styles.actionBtnPrimary}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Upload File</span>
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.directoriesGrid}>
          {directories.map((dir, idx) => (
            <div
              key={dir.name}
              className={`${styles.folderCard} ${
                idx === 0 ? styles.folderBlue : idx === 1 ? styles.folderGreen : idx === 2 ? styles.folderPink : styles.folderOrange
              }`}
            >
              <div className={styles.folderIconArea}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.folderIcon}>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className={styles.folderInfo}>
                <div className={styles.folderName}>{dir.name}</div>
                <div className={styles.folderMeta}>{dir.count} files</div>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.filesSection}>
          <h2 className={styles.sectionTitle}>Recent Files</h2>
          <div className={styles.filesList}>
            {mockFiles.map((file) => (
              <div
                key={file.name}
                className={`${styles.fileRow} ${selectedFile === file.name ? styles.fileRowSelected : ''}`}
                onClick={() => setSelectedFile(file.name === selectedFile ? null : file.name)}
              >
                <div className={styles.filePrimaryInfo}>
                  <div className={styles.fileIconWrapper}>
                    {getFileIcon(file.type)}
                  </div>
                  <span className={styles.fileName}>{file.name}</span>
                </div>
                <div className={styles.fileDetails}>
                  <span className={styles.fileSize}>{file.size}</span>
                  <span className={styles.fileModified}>{file.modified}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FilesPage;
