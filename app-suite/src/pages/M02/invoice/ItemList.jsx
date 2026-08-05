import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const ItemList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "items_iname",
      header: "Item",
      width: "200px",
      render: (_, row) => {
        return (
          <span>
            {row.items_iname} - {row.items_szqty} {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "mrrdc_itrat",
      header: "Rate * Qty",
      width: "80px",
      render: (_, rowData) => {
        return (
          <>
            {Number(rowData.mrrdc_itrat).toFixed(4)} x{" "}
            {Number(rowData.mrrdc_itqty).toFixed(4)} {rowData.runit_uname} ={" "}
            {Number(rowData.mrrdc_itamt).toFixed(4)}
          </>
        );
      },
    },
    {
      key: "mrrdc_dsamt",
      header: "Discount",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            [{rowData.mrrdc_edamt}] {Number(rowData.mrrdc_dsamt).toFixed(4)} (
            {rowData.mrrdc_dspct}%)
          </>
        );
      },
    },
    {
      key: "mrrdc_ivpct",
      header: "iVAT",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            {rowData.mrrdc_ivamt} ({rowData.mrrdc_ivpct}%)
          </>
        );
      },
    },
    {
      key: "mrrdc_vtpct",
      header: "VAT",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            {rowData.mrrdc_vtamt} ({rowData.mrrdc_vtpct}%)
          </>
        );
      },
    },
    {
      key: "mrrdc_txpct",
      header: "TAX",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            {rowData.mrrdc_txamt} ({rowData.mrrdc_txpct}%)
          </>
        );
      },
    },
    {
      key: "mrrdc_fcpct",
      header: "Fix Cost",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            {rowData.mrrdc_fcamt} ({rowData.mrrdc_fcpct}%)
          </>
        );
      },
    },
    {
      key: "mrrdc_icamt",
      header: "Other Cost",
      width: "80px",
      render: (_, rowData) => {
        return (
          <>
            {(
              Number(rowData.mrrdc_icamt || 0) +
              Number(rowData.mrrdc_ecamt || 0)
            ).toFixed(4)}
          </>
        );
      },
    },
    {
      key: "mrrdc_ntamt",
      header: "Sub Total",
      width: "80px",
      render: (_, rowData) => {
        return <>{(Number(rowData.mrrdc_ntamt) || 0).toFixed(4)}</>;
      },
    },
    { key: "mrrdc_notes", header: "Notes", width: "100px" },
    {
      key: "mrrdc_csrat",
      header: "Unit Cost",
      width: "80px",
      render: (_, rowData) => {
        return <>{(Number(rowData.mrrdc_csrat) || 0).toFixed(4)}</>;
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
          actve={row.mrrdc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>(Items → RM/PM/FG)</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={10}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No items found"
        className="mt-2"
      />
    </>
  );
};
export default ItemList;
