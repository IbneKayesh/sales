import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { formatDate } from "@/utils/datetime";

const PaymentList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_cname", header: "Payment", width: "200px" },
    {
      key: "mrrpy_pydat",
      header: "Date",
      width: "100px",
      render: (v) => formatDate(v),
    },
    { key: "mrrpy_pdamt", header: "Amount", width: "80px" },
    { key: "mrrpy_refno", header: "Ref No", width: "100px" },
    { key: "mrrpy_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.mrrpy_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p className="mt-2">(Payments → Cash/Bank)</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={10}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No items found"
        className="mt-2"
      />
    </>
  );
};
export default PaymentList;
