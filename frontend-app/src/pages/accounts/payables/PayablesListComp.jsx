import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";

const AccountsListComp = ({ dataList, onEdit }) => {
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

  const rcvpy_refno_BT = (rowData) => {
    return (
      <>
        <span className="text-md">{rowData.rcvpy_refno}</span> {" on "}
        <span className="text-sm">{formatDate(rowData.pmstr_trdat)}</span>
        <br />
        <span className="text-sm text-green-500">{rowData.rcvpy_srcnm}</span>
        {", "}
        <span className="text-sm text-gray-500">{rowData.rcvpy_notes}</span>
      </>
    );
  };

  const rcvpy_pyamt_BT = (rowData) => {
    const { rcvpy_pyamt, pmstr_pdamt, pmstr_duamt } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-primary font-bold">
          {Number(rcvpy_pyamt).toFixed(2)}
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

  const cntct_cntnm_BT = (rowData) => {
    return (
      <>
        <span className="text-md">{rowData.cntct_cntnm}</span>
        <br />
        <span className="text-sm text-gray-600">
          {rowData.cntct_cntps}, {rowData.cntct_cntno}, {rowData.cntct_email}
        </span>
        <br />
        <span className="text-sm text-gray-500">{rowData.cntct_ofadr}</span>
      </>
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
        <Column field="rcvpy_refno" header="Ref No" body={rcvpy_refno_BT} />
        <Column
          field="rcvpy_pyamt"
          header="Payable • Paid • Due"
          body={rcvpy_pyamt_BT}
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

export default AccountsListComp;
