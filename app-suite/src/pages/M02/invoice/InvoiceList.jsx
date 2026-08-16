import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";

const InvoiceList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "invcm_trnno",
      header: "Invoice No",
      width: "100px",
      render: (_, row) => {
        return (
          <span className={`${!row.invcm_actve && "text-red-500"}`}>
            {row.invcm_trnno}
          </span>
        );
      },
    },
    {
      key: "invcm_trdat",
      header: "Date",
      width: "90px",
      render: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "cntct_cname", header: "Customer", width: "180px" },
    { key: "invcm_refno", header: "Ref No", width: "100px" },
    { key: "invcm_tramt", header: "Amount", width: "100px" },
    { key: "invcm_pyamt", header: "Payable", width: "100px" },
    {
      key: "invcm_duamt",
      header: "Due",
      width: "80px",
      render: (_, row) => (
        <>
          <NegativeValue value={row.invcm_duamt} />
        </>
      ),
    },
    {
      key: "invcm_ispst",
      header: "Posted",
      width: "80px",
      render: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invcm_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={15}
      sortable
      searchable
      showTotals
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
    />
  );
};
export default InvoiceList;
