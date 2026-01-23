import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";

const PayablesListComp = ({ dataList, onEdit }) => {
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

  const paybl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          {rowData.paybl_refno} on {formatDate(rowData.mbkng_trdat)}
        </span>
        <span className="text-sm text-green-500">{rowData.paybl_srcnm}</span>
        <span className="text-sm text-gray-500">{rowData.paybl_descr}</span>
        <span className="text-sm text-gray-500">{rowData.paybl_notes}</span>
      </div>
    );
  };

  const paybl_dbamt_BT = (rowData) => {
    const { paybl_cramt, mbkng_pdamt, paybl_dbamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(paybl_cramt).toFixed(2)}
        </span>
        •
        <span className="text-green font-bold">
          {Number(mbkng_pdamt).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(paybl_dbamt || 0).toFixed(2)}
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
      due: dataList.reduce((s, i) => s + Number(i.paybl_dbamt || 0), 0),
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
        <Column field="paybl_refno" header="Ref No" body={paybl_refno_BT} />
        <Column
          field="paybl_dbamt"
          header="Payable • Paid • Due"
          body={paybl_dbamt_BT}
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

export default PayablesListComp;
