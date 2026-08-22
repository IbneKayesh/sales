import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const PartyList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_ptype", header: "Party Type", width: "80px" },
    { key: "chtac_cname", header: "Ledger", width: "80px" },
    {
      key: "party_cname",
      header: "Sub-Ledger Party",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.party_actve && "text-red-500"}`}>
            {row.party_cname}
          </span>
        );
      },
    },
    { key: "vndor_cname", header: "Vendor Name", width: "220px" },
    { key: "party_opbal", header: "Opening Balance", width: "80px" },
    // {
    //   key: "party_actve",
    //   header: "Status",
    //   width: "110px",
    //   body: (v) => (
    //     <Badge variant={v ? "success" : "danger"}>
    //       {v ? <IconCheck size={12} /> : <IconClose size={12} />}
    //       {v ? "Active" : "Inactive"}
    //     </Badge>
    //   ),
    // },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
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
      pageSize={15}
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
