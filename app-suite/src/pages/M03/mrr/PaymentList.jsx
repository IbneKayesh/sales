import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { formatDate } from "@/utils/datetime";
import { amountInWords } from "@/utils/ntw.js";

const PaymentList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_cname", header: "Payment", width: "200px" },
    {
      key: "mrrpy_pydat",
      header: "Date",
      width: "100px",
      body: (v) => formatDate(v),
    },
    {
      key: "mrrpy_pdamt",
      header: "Amount",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.mrrpy_pdamt ?? 0), 0);
      },
    },
    {
      key: "mrrpy_refno",
      header: "Ref No",
      width: "100px",
      footer: (_, row) => {
        return amountInWords(
          row.reduce((sum, row) => sum + Number(row.mrrpy_pdamt ?? 0), 0),
        );
      },
    },
    { key: "mrrpy_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.mrrpy_actve}
          //onEdit={onEdit}
          onCopy={onEdit}
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
        showPageSize={false}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-2"
      />
    </>
  );
};
export default PaymentList;
