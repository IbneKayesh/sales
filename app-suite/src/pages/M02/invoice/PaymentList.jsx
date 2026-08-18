import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { formatDate } from "@/utils/datetime";

const PaymentList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_cname", header: "Payment", width: "200px" },
    {
      key: "invpy_pydat",
      header: "Date",
      width: "100px",
      body: (v) => formatDate(v),
    },
    { key: "invpy_pdamt", header: "Amount", width: "80px" },
    { key: "invpy_refno", header: "Ref No", width: "100px" },
    { key: "invpy_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invpy_actve}
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
        pageSize={15}
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
