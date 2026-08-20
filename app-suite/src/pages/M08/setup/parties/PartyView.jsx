import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const PartyView = ({ listData }) => {
  const dtColumns = [
    { key: "party_ptype", header: "Party Type", width: "80px" },
    {
      key: "chtac_cname",
      header: "Ledger",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.party_actve && "text-red-500"}`}>
            {row.chtac_cname}
          </span>
        );
      },
    },
    { key: "party_cname", header: "Party Name", width: "220px" },
    { key: "vndor_cname", header: "Vendor Name", width: "220px" },
    { key: "party_opbal", header: "Opening Balance", width: "80px" },
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
