import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const ContactList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "cntct_cname", header: "Name", width: "180px" },
    { key: "cntct_ccode", header: "Code", width: "120px" },
    { key: "cntct_ctype", header: "Type", width: "120px" },
    { key: "cntct_cntno", header: "Contact No", width: "140px" },
    { key: "cntct_email", header: "Email", width: "180px" },
    { key: "cntct_cntry", header: "Country", width: "120px" },
    {
      key: "cntct_actve",
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
          actve={row.cntct_actve}
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
      exportFilename="contacts-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No contacts found"
    />
  );
};
export default ContactList;
