import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { formatDate, formatDateTime } from "@/utils/datetime";
import ZeroRowCell from "@/components/ZeroRowCell";
import { Badge } from "primereact/badge";
import { SplitButton } from "primereact/splitbutton";
import { Tag } from "primereact/tag";

const ListComp = ({ dataList, onEdit }) => {

  const pmstr_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-blue-600">
          {rowData.pmstr_trnno},{" "}
          <span className="text-md text-blue-400 mt-1">
            {rowData.pmstr_odtyp}
          </span>
        </span>
        <span className="text-sm font-italic text-green-600 mt-1">
          {rowData.cntct_cntnm},{" "}
          <span className="text-xs text-gray-600">{rowData.cntct_cntps}</span>
        </span>
      </div>
    );
  };

  const pmstr_trdat_BT = (rowData) => {
    const { pmstr_trdat, pmstr_trnte, pmstr_refno } = rowData;
    return (
      <div className="flex flex-column">
        {formatDate(pmstr_trdat)}
        {(pmstr_trnte || pmstr_refno) && (
          <small className="text-xs text-gray-500 font-italic mt-1">
            {[pmstr_trnte, pmstr_refno].filter(Boolean).join(" • ")}
          </small>
        )}
      </div>
    );
  };

  const pmstr_pyamt_BT = (rowData) => {
    const { pmstr_pyamt, pmstr_pdamt, pmstr_duamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(pmstr_pyamt).toFixed(2)}
        </span>
        •
        <span className="text-green-500 font-bold">
          {Number(pmstr_pdamt || 0).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(pmstr_duamt || 0).toFixed(2)}
        </span>
      </div>
    );
  };

  const is_paid_BT = (rowData) => {
    const statusMap = {
      1: { severity: "success", label: "Paid", icon: "pi-check-circle" },
      0: { severity: "danger", label: "Unpaid", icon: "pi-times-circle" },
      2: {
        severity: "warning",
        label: "Partial",
        icon: "pi-exclamation-circle",
      },
    };

    const status = statusMap[rowData.pmstr_ispad];

    return (
      <div className="flex flex-wrap gap-1 align-items-center">
        {status && (
          <Tag
            value={status.label}
            severity={status.severity}
            icon={`pi ${status.icon}`}
            rounded
            className="px-2"
          />
        )}
        {rowData.pmstr_ispst === 1 ? (
          <Tag
            value="Posted"
            severity="info"
            icon="pi pi-lock"
            rounded
            className="px-2"
          />
        ) : (
          <Tag
            value="Draft"
            severity="secondary"
            icon="pi pi-pencil"
            rounded
            className="px-2"
          />
        )}
        {rowData.pmstr_isret === 1 ? (
          <Tag value="Returned" severity="warning" rounded />
        ) : null}
        {rowData.pmstr_iscls === 1 ? (
          <Tag value="Closed" severity="contrast" rounded />
        ) : null}
      </div>
    );
  };

  const handleCancelBooking = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to cancel Pending Invoice Qty "${rowData.pmstr_trnno}"?`,
      header: "Cancel Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // onCancelBooking logic would go here if provided via props
      },
    });
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.pmstr_trnno}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        // onDelete logic would go here if provided via props
      },
    });
  };

  const action_BT = (rowData) => {
    const menuItems = [
      {
        label: "Return",
        icon: "pi pi-arrow-left",
        className: "text-red-500",
        command: () => handleCancelBooking(rowData),
        disabled: !rowData.edit_stop,
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        className: "text-red-500",
        command: () => handleDelete(rowData),
        disabled: !!rowData.edit_stop,
      },
    ];

    return (
      <div className="flex justify-content-center">
        <SplitButton
          icon={rowData.edit_stop ? "pi pi-eye" : "pi pi-pencil"}
          size="small"
          onClick={() => onEdit(rowData)}
          model={menuItems}
          severity={rowData.edit_stop ? "secondary" : "info"}
          className="p-button-rounded"
        />
      </div>
    );
  };

  const dataTable_FT = () => {
    const stats = {
      paid: dataList.filter((i) => i.pmstr_ispad === 1).length,
      unpaid: dataList.filter((i) => i.pmstr_ispad === 0).length,
      partial: dataList.filter((i) => i.pmstr_ispad === 2).length,
      due: dataList.reduce((s, i) => s + Number(i.pmstr_duamt || 0), 0),
      unposted: dataList.filter((i) => i.pmstr_ispst !== 1).length,
    };

    return (
      <div className="flex flex-wrap justify-content-center font-bold gap-4 py-2">
        {dataList.length > 0 && (
          <div className="text-blue-500 gap-2">
            <span>Records: </span>
            <span>{dataList.length}</span>
          </div>
        )}
        {stats.due > 0 && (
          <div className="text-red-500 gap-2">
            <span>Dues: </span>
            <span>{Number(stats.due).toFixed(2)}</span>
          </div>
        )}
        <div className="flex gap-2">
          {stats.paid > 0 && (
            <Badge value={`Paid: ${stats.paid}`} severity="success" />
          )}
          {stats.unpaid > 0 && (
            <Badge value={`Unpaid: ${stats.unpaid}`} severity="danger" />
          )}
          {stats.unposted > 0 && (
            <Badge value={`Drafts: ${stats.unposted}`} severity="warning" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        dataKey="pmstr_trnno"
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        className="shadow-1"
        rowHover
        showGridlines
        footer={dataTable_FT}
      >
        <Column field="pmstr_trnno" header="No" body={pmstr_trnno_BT} sortable />
        <Column header="Date & Notes" body={pmstr_trdat_BT} />
        <Column header="Payable • Paid • Due" body={pmstr_pyamt_BT} />
        <Column header="Status" body={is_paid_BT} />
        <Column body={action_BT} style={{ width: "100px" }} />
      </DataTable>
    </div>
  );
};

export default ListComp;
