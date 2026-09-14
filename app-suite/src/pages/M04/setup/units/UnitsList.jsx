import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const UnitsList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "units_ccode", header: "Code", width: "120px" },
    {
      key: "units_cname",
      header: "Unit Name",
      width: "200px",
      body: (_, row) => {
        return <InactiveText text={row.units_cname} active={row.units_actve} />;
      },
    },
    { key: "units_untgr", header: "Unit Group", width: "180px" },
    {
      key: "units_dcpnt",
      header: "Rounded Qty",
      width: "120px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Full Number" : "Fraction"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.units_actve}
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
      pageSize={15}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No units found"
    />
  );
};
export default UnitsList;
