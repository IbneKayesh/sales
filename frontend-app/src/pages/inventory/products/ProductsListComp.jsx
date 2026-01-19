import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import ActiveRowCell from "@/components/ActiveRowCell";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const ProductsListComp = ({ dataList, onEdit, onDelete, onFilterDataList }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);

  const [filterType, setFilterType] = useState("all");
  const filterOptions = [
    { label: "All", value: "all", icon: "pi pi-list" },
    { label: "With Warranty", value: "warranty", icon: "pi pi-calendar" },
    { label: "With Expiry", value: "expiry", icon: "pi pi-calendar" },
    { label: "With VAT", value: "vat", icon: "pi pi-money-bill" },
    { label: "Without Cost", value: "without_cost", icon: "pi pi-money-bill" },
    {
      label: "Without Barcode",
      value: "without_barcode",
      icon: "pi pi-barcode",
    },
    { label: "Without HSN", value: "without_hsn", icon: "pi pi-barcode" },
    { label: "Inactives", value: "inactives", icon: "pi pi-trash" },
  ];

  const handleFilterChange = (e) => {
    setFilterType(e.value);
    if (onFilterDataList) {
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

          <Dropdown
            value={filterType}
            options={filterOptions}
            onChange={handleFilterChange}
            placeholder="Select Filter"
            className="p-inputtext-sm w-full md:w-15rem"
            itemTemplate={(option) => (
              <div className="flex align-items-center gap-2">
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </div>
            )}
            valueTemplate={(option, props) => {
              if (option) {
                return (
                  <div className="flex align-items-center gap-2">
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </div>
                );
              }
              return <span>{props.placeholder}</span>;
            }}
            checkmark={true}
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
      message: `Are you sure you want to delete "${rowData.items_iname}"?`,
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
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
          disabled={rowData.edit_stop}
        />
      </div>
    );
  };

  const items_icode_BT = (rowData) => {
    return (
      <>
        <span className="text-xl ml-1">{rowData.items_icode}</span>
        <span className="text-md text-gray-600 ml-1">
          {rowData.items_bcode}
        </span>
        <span className="text-sm text-gray-500 ml-1">
          {rowData.items_hscod}
        </span>
      </>
    );
  };
  const items_iname_BT = (rowData) => {
    return (
      <>
        <ActiveRowCell
          text={rowData.items_iname}
          status={rowData.items_actve}
        />
        <span className="text-sm text-gray-600 ml-1">
          {rowData.items_idesc}
        </span>
        <span
          className={`text-sm ${
            rowData.items_nofbi > 0 ? "text-blue-500" : "text-red-500"
          } ml-1`}
        >
          ({rowData.items_nofbi})
        </span>
      </>
    );
  };
  const items_puofm_BT = (rowData) => {
    return (
      <>
        {rowData.items_dfqty} {rowData.puofm_untnm} = 1 {rowData.suofm_untnm}
      </>
    );
  };

  const items_ctgry_BT = (rowData) => {
    return (
      <>
        {rowData.ctgry_ctgnm}
        <span className="text-sm text-gray-600 ml-1">
          {rowData.items_itype}
        </span>
      </>
    );
  };

  const items_hwrnt_BT = (rowData) => {
    return (
      <>
        <ActiveRowCell text={"Warranty"} status={rowData.items_hwrnt} />{" "}
        <ActiveRowCell text={"Expiry"} status={rowData.items_hxpry} />
      </>
    );
  };
  const items_sdvat_BT = (rowData) => {
    return (
      <>
        VAT% {rowData.items_sdvat}
        <span className="text-sm text-gray-600 ml-1">
          Cost % {rowData.items_costp}
        </span>
      </>
    );
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
        header={header()}
      >
        <Column
          field="items_icode"
          header="Code"
          body={items_icode_BT}
          sortable
        />
        <Column
          field="items_iname"
          header="Name"
          body={items_iname_BT}
          sortable
        />
        <Column
          field="items_puofm"
          header="Unit"
          body={items_puofm_BT}
          sortable
        />
        <Column
          field="items_ctgry"
          header="Category"
          body={items_ctgry_BT}
          sortable
        />
        <Column
          field="items_hwrnt"
          header="Support"
          body={items_hwrnt_BT}
          sortable
        />
        <Column
          field="items_sdvat"
          header="Pricing"
          body={items_sdvat_BT}
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default ProductsListComp;
