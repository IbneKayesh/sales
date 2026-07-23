import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const HolidayList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "hlday_yerid", header: "Year", width: "100px" },
    { key: "hlday_hldat", header: "Holiday Date", width: "180px" },
    { key: "hlday_hldnm", header: "Holiday Name", width: "250px" },
    { key: "hlday_notes", header: "Notes", width: "200px" },
    {
      key: "hlday_actve",
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
