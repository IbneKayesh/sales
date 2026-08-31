import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const BundleList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Department", width: "80px" },
    {
      key: "bndlm_cname",
      header: "Bundle",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.bndlm_cname} active={row.bndlm_actve} />;
      },
    },
    { key: "bndlm_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Name", width: "80px" },
    { key: "bndlm_itqty", header: "Qty", width: "80px" },
    { key: "bndlm_itrat", header: "Rate", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.bndlm_actve}
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
export default BundleList;
