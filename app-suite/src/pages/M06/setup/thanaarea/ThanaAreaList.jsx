import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconChevronDown } from "@/icons";
import InactiveText from "@/components/InactiveText";

const ThanaAreaList = ({ listData, onEdit, onDelete, onTerritory }) => {
  const dtColumns = [
    {
      key: "tarea_cname",
      header: "Area Name",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.tarea_cname} active={row.tarea_actve} />;
      },
    },
    {
      key: "dzone_cname",
      header: "District Zone",
      width: "80px",
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTerritory(row);
            }}
            title="Thana / Area"
          >
            <IconChevronDown size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.tarea_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      ),
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={25}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No territory areas found"
    />
  );
};
export default ThanaAreaList;
