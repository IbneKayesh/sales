import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const AttendLogList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "atnlg_ecode", header: "Employee Code", width: "180px" },
    { key: "atnlg_crdno", header: "Card No", width: "150px" },
    { key: "atnlg_lgtim", header: "Log Time", width: "200px" },
    { key: "atnlg_trmnl", header: "Terminal", width: "150px" },
    {
      key: "atnlg_ispst",
      header: "Posted",
      width: "100px",
      render: (v) => {
        return (
          <Badge variant={v ? "success" : "secondary"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "atnlg_actve",
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
          actve={row.atnlg_actve}
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
      exportFilename="attend-logs.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No attend logs found"
    />
  );
};
export default AttendLogList;
