import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const WorkShiftList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "wkshf_cname", header: "Shift Name", width: "200px" },
    { key: "wkshf_satim", header: "Start Time", width: "130px" },
    { key: "wkshf_entim", header: "End Time", width: "130px" },
    { key: "wkshf_wkhrs", header: "Work Hours", width: "120px" },
    {
      key: "wkshf_actve",
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
          actve={row.wkshf_actve}
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
      exportFilename="workshifts.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No work shifts found"
    />
  );
};
export default WorkShiftList;
