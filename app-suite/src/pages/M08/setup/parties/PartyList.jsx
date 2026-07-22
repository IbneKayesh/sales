import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const PartyList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_ptype", header: "Party Type", width: "140px" },
    { key: "party_cname", header: "Party Name", width: "220px" },
    { key: "party_vndor", header: "Vendor", width: "180px" },
    { key: "party_chtac", header: "Account", width: "180px" },
    {
      key: "party_actve",
      header: "Status",
      width: "120px",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
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
          actve={row.party_actve}
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
      pageSize={10}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No parties found"
    />
  );
};
export default PartyList;
