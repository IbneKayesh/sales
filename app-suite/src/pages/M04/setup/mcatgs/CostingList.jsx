import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import InactiveText from "@/components/InactiveText";

const CostingList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "pcost_party",
      header: "Name",
      width: "120px",
      body: (_, row) => {
        return <InactiveText text={row.pcost_party} active={row.pcost_actve} />;
      },
    },
    {
      key: "pcost_csamt",
      header: "Amount",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.pcost_csamt ?? 0), 0);
      },
    },
    {
      key: "pcost_csrto",
      header: "Ratio",
      width: "80px",
    },
    // {
    //   key: "pcost_ratio",
    //   header: "Ratio",
    //   width: "80px",
    //   body: (row) => {
    //     return row + " %";
    //   },
    //   footer: (_, row) => {
    //     return (
    //       row
    //         .reduce((sum, row) => sum + Number(row.pcost_ratio ?? 0), 0)
    //         .toFixed(2) + " %"
    //     );
    //   },
    // },
    { key: "pcost_notes", header: "Notes", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.pcost_actve}
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
export default CostingList;
