import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { IconClose, IconCheck } from "@/icons";

const CoaNetworkList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "chtrt_trnid", header: "Transaction Id", width: "80px" },
    { key: "chtrt_pegid", header: "Page Id", width: "80px" },
    { key: "chtrt_grpid", header: "Group Id", width: "80px" },
    { key: "chtrt_route", header: "Route", width: "80px" },
    { key: "chtrt_chtno", header: "COA", width: "80px" },
    { key: "chtrt_cname", header: "Name", width: "80px" },
    { key: "chtrt_notes", header: "Notes", width: "80px" },
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
      emptyMessage="No data found"
    />
  );
};
export default CoaNetworkList;
