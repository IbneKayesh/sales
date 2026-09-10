import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { IconReceiptPlus } from "@/icons";
import Button from "@/components/Button";
import { formatNumber } from "@/utils/misc";

const RMPMList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prrpm_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "prrpm_boqty",
      header: "BOQ",
      width: "80px",
      body: (_, row) => (
        <span>
          {formatNumber(row.prrpm_boqty)} {row.runit_cname} ×{" "}
          {formatNumber(row.prrpm_borat)} ={" "}
          {formatNumber(row.prrpm_boqty * row.prrpm_borat)}
        </span>
      ),
    },
    {
      key: "prrpm_rmqty",
      header: "Consumption",
      width: "80px",
      //body: (v) => formatNumber(v, true),
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prrpm_rmqty)} {row.runit_cname} x{" "}
            {formatNumber(row.prrpm_rmrat)} = {formatNumber(row.prrpm_rmval)}
          </span>
        );
      },
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.prrpm_rmqty ?? 0), 0);
      },
    },
    { key: "prrpm_notes", header: "Notes", width: "80px" },
    // { key: "prrpm_stock", header: "Stock", width: "80px" },
    { key: "stock_ohqty", header: "Stock", width: "80px" },
    { key: "party_id", header: "party_id", width: "80px", visible: false },
    { key: "chtac_id", header: "chtac_id", width: "80px", visible: false },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        // <ActionButton
        //   rowData={row}
        //   actve={row.prrpm_actve}
        //   onEdit={onEdit}
        //   onDelete={onDelete}
        // />
        <>
          <Button
            variant="ghost"
            size="sm"
            className="btn--icon-success"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Add Stock"
          >
            <IconReceiptPlus size={14} className="text-success" />
          </Button>
        </>
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Input → RM/PM/SFG/FG</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={25}
        showPageSize={false}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-2"
      />
    </>
  );
};
export default RMPMList;
