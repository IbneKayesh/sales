import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const DepartmentList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_ccode", header: "Code", width: "80px" },
    {
      key: "dpart_cname",
      header: "Name",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.dpart_actve && "text-red-500"}`}>
            {row.dpart_cname}
          </span>
        );
      },
    },
    { key: "dpart_ofadr", header: "Office Address", width: "80px" },
    { key: "dpart_emcap", header: "Emp Capacity", width: "80px" },
    {
      key: "dpart_stdst",
      header: "Stop Distributor",
      width: "110px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "dpart_stpur",
      header: "Stop Purchase",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "dpart_stsal",
      header: "Stop Sale",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "dpart_stnsf",
      header: "Stop Transfer",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "dpart_stpro",
      header: "Stop Production",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "dpart_stjrn",
      header: "Stop Journal",
      width: "80px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
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
          actve={row.dpart_actve}
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
      exportFilename="departments-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No departments found"
    />
  );
};
export default DepartmentList;
