import React, { useRef, useState } from "react";
import { useDatabase } from "@/hooks/setup/useDatabase";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const DatabasePage = () => {
  const toast = useRef(null);

  const {
    dataList,
    isBusy,
    handleDelete,
    handleRefresh,
    handleCreate,
    handleDownload,
  } = useDatabase();


  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  const confirmDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete the backup "${rowData.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(rowData),
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-download"
          severity="success"
          size="small"
          rounded
          outlined
          onClick={() => handleDownload(rowData)}
          tooltip="Download Backup"
          disabled={isBusy}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          rounded
          outlined
          onClick={() => confirmDelete(rowData)}
          tooltip="Delete Backup"
          disabled={isBusy}
        />
      </div>
    );
  };

  const fileNameTemplate = (rowData) => {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-file-o mr-2 text-blue-500"></i>
        <span className="font-semibold">{rowData.name}</span>
      </div>
    );
  };

  return (
    <div className="p-1">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="p-3 bg-gray-900/50 border-round mb-3 flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 m-0">
            <i className="pi pi-database mr-2"></i>Database Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Full database backups with compression (.sql.gz)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            onClick={handleRefresh}
            disabled={isBusy}
            severity="secondary"
            className="p-button-sm"
          />
          <Button
            label="Create New Backup"
            icon="pi pi-save"
            severity="success"
            onClick={handleCreate}
            loading={isBusy}
            className="p-button-sm font-bold"
          />
        </div>
      </div>

      <div className="card">
        <DataTable
          value={dataList}
          paginator
          rows={15}
          rowsPerPageOptions={[15, 30, 50]}
          className="p-datatable-sm"
          loading={isBusy}
          emptyMessage="No backup files found."
          showGridlines
          rowHover
          size="small"
          header={`${dataList?.length || 0} Total Backups`}
        >
          <Column
            field="name"
            header="File Name"
            sortable
            body={fileNameTemplate}
            filter
            filterPlaceholder="Search by name"
          />
          <Column
            field="size"
            header="Size"
            body={(row) => formatSize(row.size)}
            sortable
            style={{ width: "10rem" }}
          />
          <Column
            field="createdAt"
            header="Created At"
            body={(row) => formatDate(row.createdAt)}
            sortable
            style={{ width: "15rem" }}
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "10rem", textAlign: "center" }}
          />
        </DataTable>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border-round border-1 border-blue-500/30">
        <h3 className="text-blue-200 text-sm font-bold flex align-items-center">
          <i className="pi pi-info-circle mr-2"></i>About Database Backups
        </h3>
        <ul className="text-gray-400 text-xs mt-2 list-none p-0">
          <li className="mb-1">
            • Backups are stored in the "backups" directory of the application.
          </li>
          <li className="mb-1">
            • Backups are compressed using gzip.
          </li>
          <li className="mb-1">
            • Backups are stored in the "backups" directory of the application.
          </li>
        </ul>
      </div>

      {isBusy && (
        <div className="fixed top-0 left-0 w-full h-full bg-black-alpha-40 flex align-items-center justify-content-center z-5">
          <div
            className="bg-gray-800 p-5 border-round-lg shadow-8 text-center"
            style={{ minWidth: "200px" }}
          >
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              animationDuration=".5s"
            />
            <p className="mt-3 text-gray-200 font-semibold">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePage;
