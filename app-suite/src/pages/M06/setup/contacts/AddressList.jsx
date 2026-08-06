import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const AddressList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "cntad_ttype", header: "Type", width: "80px" },
    { key: "cntad_cntps", header: "Person", width: "100px" },
    { key: "cntad_cntno", header: "Contact No", width: "100px" },
    { key: "cntad_email", header: "Email", width: "100px" },
    { key: "cntad_ofadr", header: "Address", width: "100px" },
    { key: "cntad_notes", header: "Notes", width: "100px" },
    {
      key: "cntad_actve",
      header: "Status",
      width: "120px",
      render: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.cntad_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return (
    <div className="mt-4">
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={20}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
      />
    </div>
  );
};
export default AddressList;
