import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const PartyAutoList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prtya_ccode", header: "Code", width: "80px" },
    { key: "prtya_sorce", header: "Source", width: "80px" },
    { key: "prtya_cname", header: "Name", width: "80px" },
    {
      key: "chtac_ctype",
      header: "Ledger",
      width: "80px",
      render: (_, rowData) =>
        rowData.chtac_ctype +
        " > " +
        rowData.chtac_chtno +
        "-" +
        rowData.chtac_cname +
        " > " +
        rowData.chtac_ntype,
    },
    { key: "prtya_notes", header: "Notes", width: "80px" },
    {
      key: "prtya_actve",
      header: "Status",
      width: "110px",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    // {
    //   key: "actions",
    //   header: "Actions",
    //   width: "110px",
    //   sortable: false,
    //   render: (_, row) => (
    //     <ActionButton
    //       rowData={row}
    //       actve={row.prtya_actve}
    //       onEdit={onEdit}
    //       onDelete={onDelete}
    //     />
    //   ),
    // },
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
export default PartyAutoList;
