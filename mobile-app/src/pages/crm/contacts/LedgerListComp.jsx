import { useMemo } from "react";
import { formatDate } from "@/utils/datetime";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ZeroRowCell from "@/components/ZeroRowCell";

const LedgerListComp = ({ dataList }) => {
  const paybl_pymod_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.paybl_pymod}</span>
        <span className="text-xs">{rowData.paybl_refno}</span>
      </div>
    );
  };
  const paybl_trdat_BT = (rowData) => {
    const getSrcNameColor = (srcnm) => {
      switch (srcnm) {
        case "Purchase Receipt":
          return "text-orange-500";
        case "Purchase Booking":
          return "text-blue-500";
        case "Sales Invoice":
          return "text-green-500";
        case "Sales Return":
          return "text-red-500";
        default:
          return "text-gray-500";
      }
    };
    return (
      <div className="flex flex-column">
        <span className="text-md">{formatDate(rowData.paybl_trdat)}</span>
        <span
          className={`text-xs font-bold ${getSrcNameColor(rowData.paybl_srcnm)}`}
        >
          {rowData.paybl_srcnm}
        </span>
      </div>
    );
  };

  const paybl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.paybl_descr}</span>
        <span className="text-xs">{rowData.paybl_notes}</span>
      </div>
    );
  };

  const paybl_dbamt_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.paybl_dbamt} text={rowData.paybl_dbamt} />
    );
  };

  const paybl_cramt_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.paybl_cramt} text={rowData.paybl_cramt} />
    );
  };

  const paybl_dbamt_FT = () => {
    return dataList.reduce((total, row) => total + Number(row.paybl_dbamt), 0);
  };

  const paybl_cramt_FT = () => {
    return dataList.reduce((total, row) => total + Number(row.paybl_cramt), 0);
  };

  const account_balance = () => {
    //total debit - total credit;
    const total_debit = dataList.reduce(
      (total, row) => total + Number(row.paybl_dbamt),
      0,
    );
    const total_credit = dataList.reduce(
      (total, row) => total + Number(row.paybl_cramt),
      0,
    );
    const balance = total_credit - total_debit;
    return balance > 0 ? (
      <span className="text-green-600">{balance.toFixed(2)}</span>
    ) : (
      <span className="text-red-600">{balance.toFixed(2)}</span>
    );
  };

  const uniqueRefMap = useMemo(() => {
    const refs = [...new Set(dataList.map((item) => item.paybl_refno))];
    const map = {};
    refs.forEach((ref, index) => {
      // Using a light blue background for every other group of unique refs
      map[ref] = index % 2 === 0 ? "bg-gray-200" : "";
    });
    return map;
  }, [dataList]);

  const rowClassName = (rowData) => {
    return uniqueRefMap[rowData.paybl_refno];
  };

  return (
    <div className="m-0">
      {/* {JSON.stringify(dataList)} */}
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        rowClassName={rowClassName}
      >
        <Column field="paybl_pymod" header="Mode" body={paybl_pymod_BT} />
        <Column field="paybl_trdat" header="Date" body={paybl_trdat_BT} />
        <Column
          field="paybl_refno"
          header="Ref"
          body={paybl_refno_BT}
          footer={account_balance}
        />
        <Column
          field="paybl_dbamt"
          header="Debit (-)"
          body={paybl_dbamt_BT}
          footer={paybl_dbamt_FT}
        />
        <Column
          field="paybl_cramt"
          header="Credit (+)"
          body={paybl_cramt_BT}
          footer={paybl_cramt_FT}
        />
      </DataTable>
    </div>
  );
};

export default LedgerListComp;
