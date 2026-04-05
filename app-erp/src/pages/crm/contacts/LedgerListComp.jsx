import { useMemo } from "react";
import { formatDate } from "@/utils/datetime";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ZeroRowCell from "@/components/ZeroRowCell";

const LedgerListComp = ({ dataList }) => {
  const pymod_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.pymod}</span>
        <span className="text-xs">{rowData.refno}</span>
      </div>
    );
  };
  const trdat_BT = (rowData) => {
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
        <span className="text-md">{formatDate(rowData.trdat)}</span>
        <span
          className={`text-xs font-bold ${getSrcNameColor(rowData.srcnm)}`}
        >
          {rowData.srcnm}
        </span>
      </div>
    );
  };

  const descr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.descr}</span>
        <span className="text-xs">{rowData.notes}</span>
      </div>
    );
  };

  const dbamt_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.dbamt} text={rowData.dbamt} />
    );
  };

  const cramt_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.cramt} text={rowData.cramt} />
    );
  };

  const dbamt_FT = () => {
    return dataList.reduce((total, row) => total + Number(row.dbamt), 0);
  };

  const cramt_FT = () => {
    return dataList.reduce((total, row) => total + Number(row.cramt), 0);
  };

  const account_balance = () => {
    //total debit - total credit;
    const total_debit = dataList.reduce(
      (total, row) => total + Number(row.dbamt),
      0,
    );
    const total_credit = dataList.reduce(
      (total, row) => total + Number(row.cramt),
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
        rows={25}
        rowsPerPageOptions={[25, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        rowClassName={rowClassName}
      >
        <Column field="pymod" header="Mode" body={pymod_BT} />
        <Column field="trdat" header="Date" body={trdat_BT} />
        <Column
          field="descr"
          header="Notes"
          body={descr_BT}
          footer={account_balance}
        />
        <Column
          field="dbamt"
          header="Debit (-)"
          body={dbamt_BT}
          footer={dbamt_FT}
        />
        <Column
          field="cramt"
          header="Credit (+)"
          body={cramt_BT}
          footer={cramt_FT}
        />
      </DataTable>
    </div>
  );
};

export default LedgerListComp;
