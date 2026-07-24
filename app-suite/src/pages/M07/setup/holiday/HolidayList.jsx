import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { formatDate } from "@/utils/datetime.js";

const HolidayList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "hlday_yerid", header: "Year", width: "80px" },
    {
      key: "hlday_hldat",
      header: "Holiday Date",
      width: "80px",
      render: (v) => {
        return formatDate(v);
      },
    },
    { key: "hlday_cname", header: "Holiday Name", width: "80px" },
    { key: "hlday_notes", header: "Notes", width: "80px" },
    {
      key: "hlday_actve",
      header: "Status",
      width: "110px",
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
          actve={row.hlday_actve}
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
      exportFilename="holidays.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No holidays found"
    />
  );
};
export default HolidayList;
