import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import type { Brand } from "@/models/inventory/tmib_brand";
import type { MenuItem } from "primereact/menuitem";

interface BrandListCompProps {
  dataList: Brand[];
  onEdit: (data: Brand) => void;
  onDelete: (data: Brand) => void;
}

const BrandListComp: React.FC<BrandListCompProps> = ({
  dataList,
  onEdit,
  onDelete,
}) => {
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);

  const handleDelete = (rowData: Brand) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.brand_brnam}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData);
      },
    });
  };

  const action_BT = (rowData: Brand) => {
    let menuItems: MenuItem[] = [
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

  const brand_brnam_BT = (rowData: Brand) => {
    return (
      <ActiveRowCell text={rowData.brand_brnam} status={rowData.brand_actve} />
    );
  };

  const header = () => {
    return (
      <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="p-inputgroup w-full md:w-25rem">
          <span className="p-inputgroup-addon bg-gray-100">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
            placeholder="Search..."
            className="p-inputtext-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-1">
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
        globalFilterFields={["brand_brnam"]}
        header={header()}
      >
        <Column
          field="brand_brnam"
          header="Brand Name"
          body={brand_brnam_BT}
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default BrandListComp;
