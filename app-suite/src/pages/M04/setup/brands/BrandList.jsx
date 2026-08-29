import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const BrandList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "brand_ccode", header: "Code", width: "80px" },
    { key: "brand_cntry", header: "Country", width: "80px" },
    {
      key: "brand_cname",
      header: "Brand Name",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.brand_cname} active={row.brand_actve} />;
      },
    },
    // {
    //   key: "brand_actve",
    //   header: "Status",
    //   width: "110px",
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
          actve={row.brand_actve}
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
      autofit
    />
  );
};
export default BrandList;
