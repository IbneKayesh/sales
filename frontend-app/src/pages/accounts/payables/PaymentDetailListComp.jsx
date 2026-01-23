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

  const paybl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.paybl_refno}</span>
        <span className="text-sm text-green-500">{rowData.paybl_srcnm}</span>
      </div>
    );
  };

  const paybl_trdat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{formatDate(rowData.paybl_trdat)}</span>
        <span className="text-sm text-green-500">{rowData.paybl_pymod}</span>
      </div>
    );
  };

  const paybl_descr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.paybl_descr}</span>
        <span className="text-sm text-green-500">{rowData.paybl_notes}</span>
      </div>
    );
  };

  const paybl_dbamt_BT = (rowData) => {
    const { paybl_dbamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(paybl_dbamt).toFixed(2)}
        </span>
      </div>
    );
  };

  const paybl_cramt_BT = (rowData) => {
    const { paybl_cramt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(paybl_cramt).toFixed(2)}
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
        <Column field="paybl_refno" header="Ref No" body={paybl_refno_BT} />
        <Column field="paybl_trdat" header="Date" body={paybl_trdat_BT} />
        <Column
          field="paybl_descr"
          header="Description"
          body={paybl_descr_BT}
        />
        <Column field="paybl_dbamt" header="Debit" body={paybl_dbamt_BT} />
        <Column field="paybl_cramt" header="Credit" body={paybl_cramt_BT} />

        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default PaymentDetailListComp;
