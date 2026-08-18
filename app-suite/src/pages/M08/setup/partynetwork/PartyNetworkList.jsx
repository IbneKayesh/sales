import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { IconClose, IconCheck } from "@/icons";

const PartyNetworkList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prtyn_table", header: "Table", width: "80px" },
    { key: "prtyn_cname", header: "Name", width: "80px" },
    { key: "prtyn_ctype", header: "Type", width: "80px" },
    // { key: "prtyn_chtac", header: "Control", width: "80px" },
    { key: "prtyn_chtno", header: "Control Code", width: "80px" },
    { key: "party_cname", header: "Party", width: "80px" },
    { key: "prtyn_notes", header: "Note", width: "80px" },
    {
      key: "prtyn_actve",
      header: "Status",
      width: "110px",
      body: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={20}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No party network found"
    />
  );
};
export default PartyNetworkList;
