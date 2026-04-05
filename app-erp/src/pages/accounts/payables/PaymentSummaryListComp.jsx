import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";

const PaymentSummaryListComp = ({ dataList }) => {
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
        {rowData.paybl_dbamt - rowData.paybl_cramt}
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
        <Column field="cntct_cntnm" header="Supplier" />
        <Column field="paybl_refno" header="Ref No" body={paybl_refno_BT} />
        <Column field="paybl_dbamt" header="Debit" body={paybl_dbamt_BT} />
        <Column field="paybl_cramt" header="Credit" body={paybl_cramt_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default PaymentSummaryListComp;
