import { useState } from 'react';

import { IconFile, IconFilePpt, IconFilePdf, IconFileImage, IconFileExcel, IconPlus, IconUpload, IconFolderOpen } from '@/assets/icons';
import './FilesPage.css';
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
        return <IconFileExcel className="fileIconExcel" />;
      case 'powerpoint':
        return <IconFilePpt className="fileIconPpt" />;
      case 'pdf':
        return <IconFilePdf className="fileIconPdf" />;
      case 'image':
        return <IconFileImage className="fileIconImg" />;
      default:
        return <IconFile className="fileIconDefault" />;
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="headerTitleArea">
          <h1 className="title">File Explorer</h1>
          <p className="subtitle">Browse and manage system documents</p>
        </div>
        <div className="actions">
          <button className="actionBtn">
            <IconPlus className="btnIcon" />
            <span>New Folder</span>
          </button>
          <button className="actionBtnPrimary">
            <IconUpload className="btnIcon" />
            <span>Upload File</span>
          </button>
        </div>
      </header>

      <div className="layout">
        <section className="directoriesGrid">
          {directories.map((dir, idx) => (
            <div
              key={dir.name}
              className={`folderCard ${
                idx === 0 ? 'folderBlue' : idx === 1 ? 'folderGreen' : idx === 2 ? 'folderPink' : 'folderOrange'
              }`}
            >
              <div className="folderIconArea">
                <IconFolderOpen className="folderIcon" />
              </div>
              <div className="folderInfo">
                <div className="folderName">{dir.name}</div>
                <div className="folderMeta">{dir.count} files</div>
              </div>
            </div>
          ))}
        </section>

        <section className="filesSection">
          <h2 className="sectionTitle">Recent Files</h2>
          <div className="filesList">
            {mockFiles.map((file) => (
              <div
                key={file.name}
                className={`fileRow ${selectedFile === file.name ? 'fileRowSelected' : ''}`}
                onClick={() => setSelectedFile(file.name === selectedFile ? null : file.name)}
              >
                <div className="filePrimaryInfo">
                  <div className="fileIconWrapper">
                    {getFileIcon(file.type)}
                  </div>
                  <span className="fileName">{file.name}</span>
                </div>
                <div className="fileDetails">
                  <span className="fileSize">{file.size}</span>
                  <span className="fileModified">{file.modified}</span>
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
