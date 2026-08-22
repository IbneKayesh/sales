import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { IconClose, IconCheck } from "@/icons";

const PartyNetworkList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prtyr_mgrup", header: "Master Group", width: "80px" },
    { key: "prtyr_sgrup", header: "Sub Group", width: "80px" },
    { key: "chtac_ctype", header: "Class", width: "80px" },
    {
      key: "chtac_cname",
      header: "Ledger",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.prtyr_actve && "text-red-500"}`}>
            {row.chtac_cname}
          </span>
        );
      },
    },
    { key: "chtac_chtno", header: "Code", width: "80px" },
    { key: "party_cname", header: "Sub-Ledger Party", width: "80px" },
    { key: "prtyr_notes", header: "Note", width: "80px" },
    // {
    //   key: "prtyr_actve",
    //   header: "Status",
    //   width: "110px",
    //   body: (v) => (
    //     <Badge variant={v ? "success" : "danger"}>
    //       {v ? <IconCheck size={12} /> : <IconClose size={12} />}
    //       {v ? "Active" : "Inactive"}
    //     </Badge>
    //   ),
    // },
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
