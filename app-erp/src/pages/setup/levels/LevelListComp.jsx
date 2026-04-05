import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const LevelListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.role_name}"?`,
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

  const bsins_bname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell
            text={rowData.bsins_bname}
            status={rowData.bsins_actve}
          />
        </span>
        <span className="text-sm text-gray-500">
          {rowData.bsins_addrs}, {rowData.bsins_cntry}
        </span>
        <span className="text-sm text-gray-500 flex gap-2">
          Distributor:
          {rowData.bsins_dstrn === true ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
          Transfer:
          {rowData.bsins_tstrn === true ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
          Purchase:
          {rowData.bsins_prtrn === true ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
          Sales:
          {rowData.bsins_sltrn === true ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
          Analytics:
          {rowData.bsins_pbviw === true ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
        </span>
      </div>
    );
  };

  const bsins_email_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.bsins_cntct}</span>
        <span className="text-sm text-blue-600">{rowData.bsins_email}</span>
      </div>
    );
  };
  const bsins_btags_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.bsins_btags}</span>
        <span className="text-sm text-blue-600">{rowData.bsins_bstyp}</span>
      </div>
    );
  };

  const bsins_stdat_BT = (rowData) => {
    return <>{formatDate(rowData.bsins_stdat)}</>;
  };

  


  const lfcl_name_BT = (rowData) => {
    return (
      <div className="flex flex-column">       
        <span className="text-sm text-gray-500 flex gap-2">
          {rowData.lfcl_name === "Active" ? (
            <i className="pi pi-check-circle text-green-500"></i>
          ) : (
            <i className="pi pi-times-circle text-red-500"></i>
          )}
        </span>
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
      >
        <Column field="id" header="Id" />
        <Column field="role_name" header="Name" />
        <Column field="role_code" header="Code" />
        <Column field="aemp_iusr" header="Created By" />
        <Column field="aemp_eusr" header="Updated By" />
        <Column field="lfcl_name" header="Status" body={lfcl_name_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default LevelListComp;
