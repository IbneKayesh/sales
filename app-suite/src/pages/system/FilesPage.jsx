import React, { useState } from 'react';
import { IconFile, IconFilePpt, IconFilePdf, IconFileImage, IconFileExcel, IconPlus, IconUpload, IconFolderOpen } from '@/assets/icons';
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
        return <IconFileExcel className={styles.fileIconExcel} />;
      case 'powerpoint':
        return <IconFilePpt className={styles.fileIconPpt} />;
      case 'pdf':
        return <IconFilePdf className={styles.fileIconPdf} />;
      case 'image':
        return <IconFileImage className={styles.fileIconImg} />;
      default:
        return <IconFile className={styles.fileIconDefault} />;
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
            <IconPlus className={styles.btnIcon} />
            <span>New Folder</span>
          </button>
          <button className={styles.actionBtnPrimary}>
            <IconUpload className={styles.btnIcon} />
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
                <IconFolderOpen className={styles.folderIcon} />
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
