import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck, IconChevronDown } from "@/icons";
import InactiveText from "@/components/InactiveText";
import Button from "@/components/Button";

const TerritoryList = ({ listData, onEdit, onDelete, onRoutes }) => {
  const dtColumns = [
    {
      key: "trtry_cname",
      header: "Territory Name",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.trtry_cname} active={row.trtry_actve} />;
      },
    },
    { key: "tarea_cname", header: "T/Area", width: "80px" },
    { key: "dzone_cname", header: "D/Zone", width: "80px" },
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
              onRoutes(row);
            }}
            title="Routes"
          >
            <IconChevronDown size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.trtry_actve}
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
      emptyMessage="No territories found"
    />
  );
};
export default TerritoryList;
