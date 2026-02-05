import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";

const PaymentDetailListComp = ({ dataList }) => {
  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        {/*<Button
          icon="pi pi-check-circle"
          size="small"
          tooltip="Payment"
          tooltipOptions={{ position: "top" }}
          //onClick={() => onEdit(rowData)}
        />*/}
      </div>
    );
  };

  const rcvbl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.rcvbl_refno}</span>
        <span className="text-sm text-green-500">{rowData.rcvbl_srcnm}</span>
      </div>
    );
  };

  const rcvbl_trdat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{formatDate(rowData.rcvbl_trdat)}</span>
        <span className="text-sm text-green-500">{rowData.rcvbl_pymod}</span>
      </div>
    );
  };

  const rcvbl_descr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.rcvbl_descr}</span>
        <span className="text-sm text-green-500">{rowData.rcvbl_notes}</span>
      </div>
    );
  };

  const rcvbl_dbamt_BT = (rowData) => {
    const { rcvbl_dbamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(rcvbl_dbamt).toFixed(2)}
        </span>
      </div>
    );
  };

  const rcvbl_cramt_BT = (rowData) => {
    const { rcvbl_cramt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(rcvbl_cramt).toFixed(2)}
        </span>
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
      >
        <Column field="rcvbl_refno" header="Ref No" body={rcvbl_refno_BT} />
        <Column field="rcvbl_trdat" header="Date" body={rcvbl_trdat_BT} />
        <Column
          field="rcvbl_descr"
          header="Description"
          body={rcvbl_descr_BT}
        />
        <Column field="rcvbl_dbamt" header="Debit" body={rcvbl_dbamt_BT} />
        <Column field="rcvbl_cramt" header="Credit" body={rcvbl_cramt_BT} />

        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default PaymentDetailListComp;
