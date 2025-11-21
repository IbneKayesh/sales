import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { backupAPI } from "@/api/backupAPI";

const BackupPage = () => {
  const toast = useRef(null);
  const [backups, setBackups] = useState([]);
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'backup' or 'export'

  const tables = [
    { label: "Users", value: "users" },
    { label: "Bank Accounts", value: "bank_accounts" },
    { label: "Contacts", value: "contacts" },
    { label: "Categories", value: "categories" },
    { label: "Units", value: "units" },
    { label: "Items", value: "items" },
    { label: "Bank Transactions", value: "bank_transactions" },
    { label: "Purchase Orders Master", value: "po_master" },
    { label: "Purchase Orders Child", value: "po_child" },
    { label: "Sales Orders Master", value: "so_master" },
    { label: "Sales Orders Child", value: "so_child" },
  ];

  useEffect(() => {
    loadBackups();
    loadExports();
  }, []);

  const loadBackups = async () => {
    try {
      const response = await backupAPI.getBackups();
      console.log("response " + JSON.stringify(response));
      setBackups(response.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load backups",
      });
    }
  };

  const loadExports = async () => {
    try {
      const response = await backupAPI.getExports();
      console.log("response " + JSON.stringify(response));
      setExports(response.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load exports",
      });
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await backupAPI.createBackup();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Database backed up successfully",
      });
      loadBackups();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Backup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    setLoading(true);
    try {
      await backupAPI.restoreBackup(selectedBackup.path);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Database restored successfully",
      });
      setRestoreDialog(false);
      setSelectedBackup(null);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Restore failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportTable = async () => {
    if (!selectedTable) return;

    setLoading(true);
    try {
      const response = await backupAPI.exportTable(selectedTable);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Table ${selectedTable} exported successfully`,
      });
      loadExports();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Export failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setLoading(true);
    try {
      const response = await backupAPI.exportAllTables();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "All tables exported successfully",
      });
      loadExports();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Export failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (file, type) => {
    setFileToDelete(file);
    setDeleteType(type);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete || !deleteType) return;

    setLoading(true);
    try {
      if (deleteType === "backup") {
        await backupAPI.deleteBackup(fileToDelete.name);
        loadBackups();
      } else if (deleteType === "export") {
        await backupAPI.deleteExport(fileToDelete.name);
        loadExports();
      }
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `${
          deleteType.charAt(0).toUpperCase() + deleteType.slice(1)
        } deleted successfully`,
      });
      setDeleteDialog(false);
      setFileToDelete(null);
      setDeleteType(null);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to delete ${deleteType}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file, type) => {
    setLoading(true);
    try {
      let blob;
      if (type === "backup") {
        blob = await backupAPI.downloadBackup(file.name);
      } else if (type === "export") {
        blob = await backupAPI.downloadExport(file.name);
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name + (file.type === "folder" ? ".zip" : "");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `${file.name} downloaded successfully`,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to download ${file.name}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (filename) => {
    // Extract timestamp from filename like "database_backup_2025-11-19T08-43-56-129Z.db"
    const match = filename.match(
      /(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/
    );
    if (match) {
      // Convert "2025-11-19T08-43-56-129Z" to "2025-11-19T08:43:56.129Z"
      const isoString = match[1].replace(
        /T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
        "T$1:$2:$3.$4Z"
      );
      return new Date(isoString).toLocaleString();
    }
    return filename;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Backup, Restore and Export
          </h1>
          <p className="text-gray-300">Perform backup your full data.</p>
        </div>

        <div className="grid">
          <Card
            title="Database Backup"
            className="shadow-lg md:col-5 m-2"
            subTitle="Create and manage full database backups"
          >
            <div className="flex-grow">
              <p className="text-gray-700 mb-4">Backup full database</p>
            </div>
            <Button
              label="Create Backup"
              icon="pi pi-save"
              onClick={handleBackup}
              loading={loading}
              className="w-full"
            />
          </Card>

          <Card
            title="Export to CSV"
            className="shadow-lg md:col-5 m-2"
            subTitle="Export data tables to CSV format"
          >
            <div className="flex-grow">
              <p className="text-gray-700 mb-4">write something</p>
            </div>
            <div className="col-12">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Table
                </label>
                <Dropdown
                  value={selectedTable}
                  options={tables}
                  onChange={(e) => setSelectedTable(e.value)}
                  placeholder="Choose a table"
                  className="w-full mb-2"
                />
              </div>
              <Button
                label="Export Table"
                icon="pi pi-download"
                onClick={handleExportTable}
                loading={loading}
                disabled={!selectedTable}
                className="m-1"
              />
              <Button
                label="Export All Tables"
                icon="pi pi-download"
                severity="info"
                onClick={handleExportAll}
                loading={loading}
                className="m-1"
              />
            </div>
          </Card>

          <Card
            title="Backup Files"
            className="shadow-lg md:col-5 m-2"
            subTitle="View and manage existing backup files"
          >
            <DataTable
              value={backups}
              paginator
              rows={5}
              className="p-datatable-sm"
            >
              <Column field="name" header="File Name" sortable />
              <Column
                field="size"
                header="Size"
                body={(row) => formatSize(row.size)}
                sortable
              />
              <Column
                header="Created"
                body={(row) => formatDate(row.name)}
                sortable
              />
              <Column
                header="Actions"
                body={(row) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-refresh"
                      severity="warning"
                      size="small"
                      onClick={() => {
                        setSelectedBackup(row);
                        setRestoreDialog(true);
                      }}
                      tooltip="Restore"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      onClick={() => openDeleteDialog(row, "backup")}
                      tooltip="Delete"
                    />
                  </div>
                )}
              />
            </DataTable>
          </Card>

          <Card
            title="Export Files"
            className="shadow-lg md:col-5 m-2"
            subTitle="View and manage exported CSV files"
          >
            <DataTable
              value={exports}
              paginator
              rows={5}
              className="p-datatable-sm"
            >
              <Column field="name" header="File Name" sortable />
              <Column
                field="size"
                header="Size"
                body={(row) => formatSize(row.size)}
                sortable
              />
              <Column
                header="Created"
                body={(row) => formatDate(row.name)}
                sortable
              />
              <Column
                header="Type"
                body={(row) => (row.type === "folder" ? "Folder" : "File")}
                sortable
              />
              <Column
                header="Actions"
                body={(row) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-download"
                      severity="success"
                      size="small"
                      onClick={() => handleDownload(row, "export")}
                      tooltip="Download"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      onClick={() => openDeleteDialog(row, "export")}
                      tooltip="Delete"
                    />
                  </div>
                )}
              />
            </DataTable>
          </Card>
        </div>
      </div>

      <Dialog
        header="Confirm Restore"
        visible={restoreDialog}
        onHide={() => setRestoreDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setRestoreDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Restore"
              icon="pi pi-check"
              onClick={handleRestore}
              loading={loading}
              severity="warning"
            />
          </div>
        }
      >
        <p>Are you sure you want to restore the database from this backup?</p>
        {selectedBackup && (
          <p className="mt-2 text-sm text-gray-600">
            File: {selectedBackup.name}
          </p>
        )}
        <p className="mt-2 text-red-600 font-semibold">
          This action cannot be undone and will replace the current database.
        </p>
      </Dialog>

      <Dialog
        header="Confirm Delete"
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setDeleteDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              onClick={handleDelete}
              loading={loading}
              severity="danger"
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this {deleteType} file?</p>
        {fileToDelete && (
          <p className="mt-2 text-sm text-gray-600">
            File: {fileToDelete.name}
          </p>
        )}
        <p className="mt-2 text-red-600 font-semibold">
          This action cannot be undone.
        </p>
      </Dialog>
    </>
  );
};

export default BackupPage;
