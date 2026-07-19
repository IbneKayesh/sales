import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const DeliveryZoneList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dzone_cname", header: "Zone Name", width: "200px" },
    { key: "dzone_cntry", header: "Country", width: "180px" },
    {
      key: "dzone_actve",
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
          actve={row.dzone_actve}
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
      exportFilename="delivery-zones-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No delivery zones found"
    />
  );
};
export default DeliveryZoneList;
