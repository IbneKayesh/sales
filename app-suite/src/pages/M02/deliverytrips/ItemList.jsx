import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { formatNumber } from "@/utils/misc";

const ItemList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "invcm_trnno", header: "No", width: "80px" },
    {
      key: "invcm_tramt",
      header: "Invoice",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "invcm_duamt",
      header: "Due",
      width: "80px",
      body: (v) => formatNumber(v),
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.invcm_duamt ?? 0), 0);
      },
    },
    {
      key: "cntct_cname",
      header: "Customer",
      width: "200px",
      footer: (_, row) => {
        return listData.length + " lines";
      },
    },
    {
      key: "cntct_ofadr",
      header: "Address",
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invcm_actve}
          //onEdit={onEdit}
          onCopy={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>(Items → Sales Invoice)</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={50}
        showRows={false}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-2"
        cfColumns={[]}
      />
    </>
  );
};
export default ItemList;
