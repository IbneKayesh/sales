import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconChevronDown, IconCheck, IconBar } from "@/icons";
import InactiveText from "@/components/InactiveText";

const MgrupList = ({ listData, onEdit, onDelete, onSubGroup }) => {
  const dtColumns = [
    { key: "mgrup_ccode", header: "Code", width: "180px" },
    {
      key: "mgrup_cname",
      header: "Group Name",
      width: "200px",
      body: (_, row) => {
        return <InactiveText text={row.mgrup_cname} active={row.mgrup_actve} />;
      },
    },
    // {
    //   key: "mgrup_actve",
    //   header: "Status",
    //   width: "120px",
    //   body: (v) => {
    //     return (
    //       <Badge variant={v ? "success" : "danger"}>
    //         {v ? <IconCheck size={12} /> : <IconClose size={12} />}
    //         {v ? "Active" : "Inactive"}
    //       </Badge>
    //     );
    //   },
    // },
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
              onSubGroup(row);
            }}
            title="Sub Group"
          >
            <IconChevronDown size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.mgrup_actve}
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
      pageSize={15}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No main groups found"
    />
  );
};
export default MgrupList;
