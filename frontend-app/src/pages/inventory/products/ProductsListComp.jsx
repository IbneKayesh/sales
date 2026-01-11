import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Tag } from "primereact/tag";
import ActiveRowCell from "@/components/ActiveRowCell";

const ProductsListComp = ({ dataList, onEdit, onDelete }) => {
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
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
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
