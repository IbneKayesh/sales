import { apiRequest } from "@/utils/api.js";

export const backupAPI = {
  // Backup database
  createBackup: () =>
    apiRequest("/setup/backup", {
      method: "POST",
    }),

  // Restore database
  restoreBackup: (backupPath) =>
    apiRequest("/setup/restore", {
      method: "POST",
      body: JSON.stringify({ backupPath }),
    }),

  // Export single table
  exportTable: (tableName) =>
    apiRequest(`/setup/export/${tableName}`, {
      method: "POST",
    }),

  // Export all tables
  exportAllTables: () =>
    apiRequest("/setup/export-all", {
      method: "POST",
    }),

  // List backup files
  getBackups: () => apiRequest("/setup/backups"),

  // List export files
  getExports: () => apiRequest("/setup/exports"),

  // Delete backup file
  deleteBackup: (filename) =>
    apiRequest(`/setup/backups/${filename}`, {
      method: "DELETE",
    }),

  // Delete export file
  deleteExport: (filename) =>
    apiRequest(`/setup/exports/${filename}`, {
      method: "DELETE",
    }),

  // Download backup file
  downloadBackup: (filename) =>
    fetch(`/setup/download/backups/${filename}`, {
      headers: {
        'app-api-key': 'sand-grain-digital-2025',
      },
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.blob();
    }),

  // Download export file or folder
  downloadExport: (filename) =>
    fetch(`/setup/download/exports/${filename}`, {
      headers: {
        'app-api-key': 'sand-grain-digital-2025',
      },
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.blob();
    }),
};
