import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import InactiveText from "@/components/InactiveText";

const ScatgList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "scatg_ccode", header: "Code", width: "120px" },
    {
      key: "scatg_cname",
      header: "Sub Category",
      width: "200px",
      body: (_, row) => {
        return <InactiveText text={row.scatg_cname} active={row.scatg_actve} />;
      },
    },
    // {
    //   key: "scatg_actve",
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
          actve={row.scatg_actve}
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
      emptyMessage="No data found"
    />
  );
};
export default ScatgList;
