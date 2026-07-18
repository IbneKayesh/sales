import DataTable from "@/components/DataTable";
import { IconCheck, IconClose } from "@/icons";
import Badge from "@/components/Badge";

const COAList = ({ listData, onEdit }) => {
  const dtColumns = [
    { key: "chtac_cname", header: "Name", width: "180px" },
    { key: "chtac_ctype", header: "Type", width: "180px" },
    { key: "chtac_chtno", header: "Chart No", width: "180px" },
    { key: "chtac_ntype", header: "Nature Type", width: "180px" },
    {
      key: "chtac_child",
      header: "Child",
      width: "180px",
      render: (v) => (
        <Badge
          variant={v ? "success" : "danger"}
          icon={v ? <IconCheck size={12} /> : <IconClose size={12} />}
        >
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "chtac_ispst",
      header: "Postable",
      width: "180px",
      render: (v) => (
        <Badge
          variant={v ? "success" : "danger"}
          icon={v ? <IconCheck size={12} /> : <IconClose size={12} />}
        >
          {v ? "Allowed" : "Not Allowed"}
        </Badge>
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
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
    />
  );
};
export default COAList;
