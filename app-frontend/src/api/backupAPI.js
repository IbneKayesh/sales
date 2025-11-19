import { apiRequest } from "@/utils/api.js";

const API_BASE_URL = '/api';

export const backupAPI = {
  // Backup database
  createBackup: () =>
    apiRequest("/db/backup", {
      method: "POST",
    }),

  // Restore database
  restoreBackup: (backupPath) =>
    apiRequest("/db/restore", {
      method: "POST",
      body: JSON.stringify({ backupPath }),
    }),

  // Export single table
  exportTable: (tableName) =>
    apiRequest(`/db/export/${tableName}`, {
      method: "POST",
    }),

  // Export all tables
  exportAllTables: () =>
    apiRequest("/db/export-all", {
      method: "POST",
    }),

  // List backup files
  getBackups: () => apiRequest("/db/backups"),

  // List export files
  getExports: () => apiRequest("/db/exports"),

  // Delete backup file
  deleteBackup: (filename) =>
    apiRequest(`/db/backups/${filename}`, {
      method: "DELETE",
    }),

  // Delete export file
  deleteExport: (filename) =>
    apiRequest(`/db/exports/${filename}`, {
      method: "DELETE",
    }),

  // Download backup file
  downloadBackup: (filename) =>
    fetch(`${API_BASE_URL}/db/download/backups/${filename}`, {
      headers: {
        'app-api-key': 'sand-grain-digital-2025',
      },
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.blob();
    }),

  // Download export file or folder
  downloadExport: (filename) =>
    fetch(`${API_BASE_URL}/db/download/exports/${filename}`, {
      headers: {
        'app-api-key': 'sand-grain-digital-2025',
      },
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.blob();
    }),
};
