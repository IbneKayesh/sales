import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/datetime";

const TBComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Type", accessor: "mjrnl_trtyp" },
    { header: "Trn No", accessor: "mjrnl_trnno" },
    { header: "Date", accessor: "mjrnl_trdat" },
    { header: "Ref No", accessor: "mjrnl_refno" },
    { header: "Narration", accessor: "mjrnl_narrt" },
    { header: "Debit", accessor: "mjrnl_drval" },
    { header: "Credit", accessor: "mjrnl_crval" },
    { header: "Status", accessor: "mjrnl_stats" },
  ];

  const dr_BT = (rowData) => {
    return Number(rowData.dr).toFixed(2);
  };

  const cr_BT = (rowData) => {
    return Number(rowData.cr).toFixed(2);
  };

  const runBal_BT = (rowData) => {
    return (Number(rowData.dr) - Number(rowData.cr)).toFixed(2);
  };

  const drAmt = dataList
    ?.reduce((acc, curr) => acc + Number(curr.dr || 0), 0)
    .toFixed(2);
  const crAmt = dataList
    ?.reduce((acc, curr) => acc + Number(curr.cr || 0), 0)
    .toFixed(2);
  const diffAmt = (Number(drAmt) - Number(crAmt)).toFixed(2);

  const chtac_cname_FT = () => {
    return "Total : " + diffAmt;
  };
  const dr_FT = () => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{drAmt}</span>
      </div>
    );
  };

  const cr_FT = () => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{crAmt}</span>
      </div>
    );
  };

  const dt_HT = () => {
    return (
      <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="p-inputgroup w-full md:w-25rem">
          <span className="p-inputgroup-addon bg-gray-100">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search here"
            className="p-inputtext-sm"
          />
        </div>

        <div className="flex flex-wrap align-items-center gap-2 w-full md:w-auto">
          <CSVExport
            data={dataList}
            fileName={`journal-${new Date().toISOString().slice(0, 10)}`}
            columns={export_columns}
            disable={pageAuth.extpr}
          />
        </div>
      </div>
    );
  };

  return dataList.length > 0 ? (
    <DataTable
      value={dataList}
      paginator
      rows={25}
      rowsPerPageOptions={[25, 50, 100, 200]}
      emptyMessage="No data found."
      size="small"
      rowHover
      showGridlines
      globalFilter={globalFilter}
      globalFilterFields={export_columns.map((col) => col.accessor)}
      header={dt_HT}
    >
      <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
      <Column field="chtac_ctype" header="Type" />
      <Column field="chtac_cname" header="Name" footer={chtac_cname_FT} />
      <Column field="dr" header="Debit" body={dr_BT} footer={dr_FT} />
      <Column field="cr" header="Credit" body={cr_BT} footer={cr_FT} />
      <Column header="R.Balance" body={runBal_BT} />
    </DataTable>
  ) : (
    <EmptyState />
  );
};
export default TBComp;
