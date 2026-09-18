import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { formatNumber } from "@/utils/misc";
import Badge from "@/components/Badge";
import { IconClose, IconCheck } from "@/icons";

const ItemList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "tripc_sorce", header: "Source", width: "80px" },
    {
      key: "tripm_trnno",
      header: "No",
      width: "80px",
      footer: (_, row) => {
        return listData.length + " lines";
      },
    },
    {
      key: "tripc_inval",
      header: "Invoice",
      width: "80px",
      body: (v) => formatNumber(v),
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.tripc_inval ?? 0), 0);
      },
    },
    {
      key: "tripc_duval",
      header: "Due",
      width: "80px",
      body: (v) => formatNumber(v),
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.tripc_duval ?? 0), 0);
      },
    },
    {
      key: "tripc_clval",
      header: "Collections",
      width: "80px",
      body: (v) => formatNumber(v),
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.tripc_clval ?? 0), 0);
      },
    },
    { key: "cntct_cname", header: "Customer", width: "80px" },
    { key: "tripc_addrs", header: "Address", width: "200px" },
    { key: "tripc_atmpt", header: "Attempt", width: "80px" },
    {
      key: "tripc_isdlv",
      header: "Delivered",
      width: "110px",
      body: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Delivered" : "Not Delivered"}
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
          actve={row.tripc_actve}
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
