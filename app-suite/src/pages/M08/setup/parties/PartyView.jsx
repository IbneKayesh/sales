import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const PartyView = ({ listData }) => {
  const dtColumns = [
    { key: "party_ptype", header: "Party Type", width: "80px" },
    { key: "chtac_cname", header: "Ledger", width: "80px" },
    { key: "party_cname", header: "Party Name", width: "220px" },
    { key: "vndor_cname", header: "Vendor Name", width: "220px" },
    { key: "party_opbal", header: "Opening Balance", width: "80px" },
    {
      key: "party_actve",
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
      pageSize={15}
      sortable
      searchable={false}
      striped
      hoverable
      exportable={false}
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No parties found"
    />
  );
};
export default PartyView;
