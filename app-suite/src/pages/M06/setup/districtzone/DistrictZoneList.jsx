import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconChevronDown } from "@/icons";
import InactiveText from "@/components/InactiveText";

const DistrictZoneList = ({ listData, onEdit, onDelete, onTArea }) => {
  const dtColumns = [
    {
      key: "dzone_cname",
      header: "District / Zone",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.dzone_cname} active={row.dzone_actve} />;
      },
    },
    { key: "dzone_cntry", header: "Country", width: "80px" },
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
              onTArea(row);
            }}
            title="Thana / Area"
          >
            <IconChevronDown size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.dzone_actve}
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
      emptyMessage="No delivery zones found"
    />
  );
};
export default DistrictZoneList;
