import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";

const ReceivablesListComp = ({ dataList, onEdit }) => {
  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-check-circle"
          size="small"
          tooltip="Payment"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
        />
      </div>
    );
  };

  const rcvbl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          {rowData.rcvbl_refno} on {formatDate(rowData.mbkng_trdat)}
        </span>
        <span className="text-sm text-green-500">{rowData.rcvbl_srcnm}</span>
        <span className="text-sm text-gray-500">{rowData.rcvbl_descr}</span>
        <span className="text-sm text-gray-500">{rowData.rcvbl_notes}</span>
      </div>
    );
  };

  const rcvbl_dbamt_BT = (rowData) => {
    const { rcvbl_cramt, mbkng_pdamt, rcvbl_dbamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(rcvbl_cramt).toFixed(2)}
        </span>
        •
        <span className="text-green font-bold">
          {Number(mbkng_pdamt).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(rcvbl_dbamt || 0).toFixed(2)}
        </span>
      </div>
    );
  };

  const cntct_cntnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.cntct_cntnm}</span>
        <span className="text-sm text-gray-600">
          {rowData.cntct_cntps}, {rowData.cntct_cntno}, {rowData.cntct_email}
        </span>
        <span className="text-sm text-gray-400">{rowData.cntct_ofadr}</span>
      </div>
    );
  };

  const dataTable_FT = () => {
    const stats = {
      due: dataList.reduce((s, i) => s + Number(i.rcvbl_dbamt || 0), 0),
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
      </div>
    );
  };

  return (
    <div className="p-1">
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        footer={dataTable_FT}
      >
        <Column field="rcvbl_refno" header="Ref No" body={rcvbl_refno_BT} />
        <Column
          field="rcvbl_dbamt"
          header="Payable • Paid • Due"
          body={rcvbl_dbamt_BT}
        />
        <Column
          field="cntct_cntnm"
          header="Contact Name"
          body={cntct_cntnm_BT}
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default ReceivablesListComp;
