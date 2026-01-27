import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ActiveRowCell from "@/components/ActiveRowCell";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import LedgerListComp from "./LedgerListComp";

const ContactListComp = ({
  dataList,
  onEdit,
  onDelete,
  onShowContactLedger,
  ledgerDataList,
  onFilterDataList,
}) => {
  const [selectedRowDetail, setSelectedRowDetail] = useState({});
  const [dlgLedger, setDlgLedger] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filterType, setFilterType] = useState("both");
  const toast = useRef(null);

  const filterOptions = [
    { label: "Both", value: "both", icon: "pi pi-users" },
    { label: "Customers", value: "customer", icon: "pi pi-shopping-cart" },
    { label: "Suppliers", value: "supplier", icon: "pi pi-truck" },
  ];

  const handleFilterChange = (e) => {
    if (e.value) {
      setFilterType(e.value);
      onFilterDataList(e.value);
    }
  };

  const onExportCsv = () => {
    toast.current.show({
      severity: "warn",
      summary: "Permission Denied",
      detail: "You are not allowed to export CSV",
      life: 3000,
    });
  };

  const onImportCsv = () => {
    toast.current.show({
      severity: "warn",
      summary: "Permission Denied",
      detail: "You are not allowed to import CSV",
      life: 3000,
    });
  };

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="flex flex-wrap align-items-center gap-2">
          <div className="p-inputgroup w-full md:w-25rem">
            <span className="p-inputgroup-addon bg-gray-100">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="p-inputtext-sm"
            />
          </div>

          <SelectButton
            value={filterType}
            options={filterOptions}
            onChange={handleFilterChange}
            className="p-buttonset-sm"
            itemTemplate={(option) => (
              <div className="flex align-items-center gap-1">
                <i className={option.icon}></i>
                <span className="hidden sm:inline">{option.label}</span>
              </div>
            )}
          />
        </div>

        <div className="flex align-items-center gap-2">
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            size="small"
            tooltip="Export CSV"
            tooltipOptions={{ position: "bottom" }}
            onClick={onExportCsv}
          />
          <Button
            type="button"
            icon="pi pi-file-import"
            severity="info"
            size="small"
            tooltip="Import CSV"
            tooltipOptions={{ position: "bottom" }}
            onClick={onImportCsv}
          />
        </div>
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.cntct_cntnm}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          onEdit(rowData);
        },
        disabled: rowData.edit_stop,
      },
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: rowData.edit_stop,
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-book"
          size="small"
          tooltip="Ledger"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDlgLedger(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const cntct_ctype_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.cntct_ctype}</span>
        <span className="text-sm text-blue-500">{rowData.cntct_sorce}</span>
      </div>
    );
  };

  const cntct_cntnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell
            text={rowData.cntct_cntnm}
            status={rowData.cntct_actve}
          />
        </span>
        <span className="text-sm text-blue-500">{rowData.cntct_cntps}</span>
        <span className="text-sm text-gray-500">{rowData.cntct_cntno}</span>
        <span className="text-sm text-gray-500">{rowData.cntct_email}</span>
      </div>
    );
  };

  const cntct_tinno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.cntct_tinno}</span>
        <span className="text-sm text-blue-500">{rowData.cntct_trade}</span>
      </div>
    );
  };

  const cntct_ofadr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell
            text={rowData.cntct_ofadr}
            status={rowData.cntct_actve}
          />
        </span>
        <span className="text-sm text-blue-500">{rowData.cntct_fcadr}</span>
        <span className="text-sm text-gray-500">
          {rowData.tarea_tname}, {rowData.dzone_dname}, {rowData.cntct_cntry}
        </span>
      </div>
    );
  };

  const cntct_crlmt_BT = (rowData) => {
    const { cntct_dspct, cntct_crlmt, cntct_pybln, cntct_adbln, cntct_crbln } =
      rowData;

    return (
      <div className="flex gap-1">
        <span className="text-green-500 font-bold">
          {Number(cntct_dspct).toFixed(2)}
        </span>
        •
        <span className="text-purple-500 font-bold">
          {Number(cntct_crlmt).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(cntct_pybln).toFixed(2)}
        </span>
        •
        <span className="text-blue-500 font-bold">
          {Number(cntct_adbln || 0).toFixed(2)}
        </span>
        •
        <span className="text-gray-500 font-bold">
          {Number(cntct_crbln || 0).toFixed(2)}
        </span>
      </div>
    );
  };

  const handleDlgLedger = (rowData) => {
    setSelectedRowDetail(rowData);
    setDlgLedger(true);
    onShowContactLedger(rowData);
  };

  return (
    <div className="p-1">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        globalFilter={globalFilter}
        globalFilterFields={[
          "cntct_sorce",
          "cntct_cntnm",
          "cntct_cntps",
          "cntct_cntno",
          "cntct_email",
          "cntct_ofadr",
          "cntct_fcadr",
          "cntct_cntry",
          "cntct_crlmt",
          "cntct_pybln",
          "cntct_adbln",
          "cntct_crbln",
        ]}
        header={header()}
      >
        <Column
          field="cntct_ctype"
          header="Type"
          body={cntct_ctype_BT}
          sortable
        />
        <Column
          field="cntct_cntnm"
          header="Name"
          body={cntct_cntnm_BT}
          sortable
        />
        <Column
          field="cntct_tinno"
          header="License"
          body={cntct_tinno_BT}
          sortable
        />
        <Column
          field="cntct_ofadr"
          header="Address"
          body={cntct_ofadr_BT}
          sortable
        />
        <Column
          field="cntct_crlmt"
          header="Discount • Credit • Payable • Advance • Balance"
          body={cntct_crlmt_BT}
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>

      <Dialog
        header={
          <>
            Payment Ledger of{" "}
            <span className="text-blue-500">
              {selectedRowDetail?.cntct_cntnm || "N/A"}
            </span>
          </>
        }
        visible={dlgLedger}
        style={{ minWidth: "50vw" }}
        onHide={() => {
          if (!dlgLedger) return;
          setDlgLedger(false);
        }}
      >
        <LedgerListComp dataList={ledgerDataList} />
      </Dialog>
    </div>
  );
};

export default ContactListComp;
