import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck, IconChevronDown } from "@/icons";
import InactiveText from "@/components/InactiveText";
import Button from "@/components/Button";

const DRouteList = ({ listData, onEdit, onDelete, onCRoutes }) => {
  const dtColumns = [
    {
      key: "route_rname",
      header: "Route Name",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.route_rname} active={row.route_actve} />;
      },
    },
    { key: "route_dname", header: "Day", width: "80px" },
    { key: "trtry_cname", header: "Territory", width: "80px" },
    { key: "route_srial", header: "Serial", width: "80px" },
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
              onCRoutes(row);
            }}
            title="Contact Routes"
          >
            <IconChevronDown size={14} />
          </Button>

          <ActionButton
            rowData={row}
            actve={row.route_actve}
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
      emptyMessage="No data found"
    />
  );
};
export default DRouteList;
