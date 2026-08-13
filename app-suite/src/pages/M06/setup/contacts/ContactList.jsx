import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";

const ContactList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "cntct_ccode", header: "Code", width: "120px" },
    {
      key: "cntct_cname",
      header: "Name",
      width: "180px",
      render: (_, row) => {
        return (
          <span className={`${!row.cntct_actve && "text-red-500"}`}>
            {row.cntct_cname}, {row.cntct_cntno} ({row.cntct_ctype})
          </span>
        );
      },
    },
    {
      key: "cntct_cntry",
      header: "Location",
      width: "120px",
      render(_, row) {
        return (
          <span>
            {[
              row.trtry_cname,
              row.tarea_cname,
              row.dzone_cname,
              row.cntct_cntry,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        );
      },
    },
    {
      key: "cntct_dspct",
      header: "Discount%",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.cntct_dspct} />,
    },
    {
      key: "cntct_crlmt",
      header: "Limit",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.cntct_crlmt} />,
    },
    {
      key: "cntct_crbal",
      header: "Balance",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.cntct_crbal} />,
    },
    // {
    //   key: "cntct_actve",
    //   header: "Status",
    //   width: "120px",
    //   render: (v) => {
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
export default ContactList;
