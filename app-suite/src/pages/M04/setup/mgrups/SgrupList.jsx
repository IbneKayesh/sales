import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const SgrupList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "sgrup_ccode", header: "Code", width: "120px" },
    {
      key: "sgrup_cname",
      header: "Sub Group",
      width: "200px",
      body: (_, row) => {
        return <InactiveText text={row.sgrup_cname} active={row.sgrup_actve} />;
      },
    },
    // {
    //   key: "sgrup_actve",
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
        <ActionButton
          rowData={row}
          actve={row.sgrup_actve}
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
      emptyMessage="No sub groups found"
    />
  );
};
export default SgrupList;
