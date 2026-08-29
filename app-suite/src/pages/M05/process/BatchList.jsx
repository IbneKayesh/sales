import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { getRelativeDays, formatDate } from "@/utils/datetime.js";

const BatchList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prbtc_itype", header: "Type", width: "80px" },
    { key: "prbtc_group", header: "Group", width: "80px" },
    { key: "prbtc_brcod", header: "Barcode", width: "80px" },
    { key: "prbtc_batch", header: "Batch", width: "80px" },
    { key: "prbtc_srial", header: "Serial", width: "80px" },
    {
      key: "prbtc_gdstk",
      header: "Good",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.prbtc_gdstk} {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prbtc_bdstk",
      header: "Reject",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.prbtc_bdstk} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prbtc_fgrat", header: "Cost Rate", width: "80px" },
    { key: "prbtc_fgval", header: "Value", width: "80px" },
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "prbtc_wkshf", header: "Shift", width: "80px" },
    { key: "prbtc_emply", header: "Manager", width: "80px" },
    { key: "prbtc_notes", header: "Notes", width: "100px" },
    {
      key: "prbtc_crdat",
      header: "Date",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prbtc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Output → Batch Complete</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={15}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No batch records found"
        className="mt-2"
      />
    </>
  );
};
export default BatchList;
