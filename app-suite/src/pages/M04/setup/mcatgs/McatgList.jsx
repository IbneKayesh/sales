import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import InactiveText from "@/components/InactiveText";
import { IconChevronDown, IconFile, IconDollar, IconMenu } from "@/icons";

const McatgList = ({
  listData,
  onEdit,
  onDelete,
  onSubCategory,
  onAttributes,
  onCosting,
}) => {
  const dtColumns = [
    { key: "mcatg_ccode", header: "Code", width: "180px" },
    {
      key: "mcatg_cname",
      header: "Category",
      width: "200px",
      body: (_, row) => {
        return <InactiveText text={row.mcatg_cname} active={row.mcatg_actve} />;
      },
    },
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
              onSubCategory(row);
            }}
            title="Sub Categories"
          >
            <IconChevronDown size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAttributes(row);
            }}
            title="Attributes"
          >
            <IconFile size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCosting(row);
            }}
            title="Costing"
          >
            <IconDollar size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.mcatg_actve}
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
      emptyMessage="No data found"
    />
  );
};
export default McatgList;
