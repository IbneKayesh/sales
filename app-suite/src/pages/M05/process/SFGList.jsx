import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import InputNumber from "@/components/InputNumber";
import { IconReceiptPlus } from "@/icons";
import Button from "@/components/Button";
import { formatNumber } from "@/utils/misc";

const SFGList = ({ readOnly, listData, onEdit, onDelete, onChange }) => {
  const dtColumns = [
    { key: "prsfg_itype", header: "Type", width: "80px" },
    { key: "prsfg_group", header: "Group", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "prsfg_boqty",
      header: "BOQ",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prsfg_boqty)} x {formatNumber(row.prsfg_borat)}{" "}
            {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prsfg_fgqty",
      header: "Yield",
      width: "80px",
      body: (_, row) => {
        return (
          <div className="d-flex align-center gap-1">
            {row.prsfg_group === "MAIN" ? (
              <InputNumber
                label=""
                placeholder="Enter Qty"
                value={row.prsfg_fgqty}
                onChange={(e) =>
                  onChange(
                    "prsfg_fgqty",
                    e.target.value,
                    row.prsfg_price,
                    row.prsfg_boqty,
                  )
                }
                step="0.01"
                disabled={readOnly}
              />
            ) : (
              formatNumber(row.prsfg_fgqty)
            )}
            {" x "}
            {formatNumber(row.prsfg_fgrat)}
            {" = "}
            {formatNumber(row.prsfg_fgval)}
          </div>
        );
      },

      footer: (_, row) => {
        const qtySum = row.reduce(
          (sum, item) => sum + Number(item.prsfg_fgqty ?? 0),
          0,
        );

        const valueSum = row.reduce(
          (sum, item) => sum + Number(item.prsfg_fgval ?? 0),
          0,
        );

        return `${formatNumber(qtySum)} || ${formatNumber(valueSum)}`;
      },
    },
    {
      key: "prsfg_rtrto",
      header: "Yield Cost Ratio",
      width: "80px",
      body: (v) => formatNumber(v, true) + " %",
      footer: (_, row) => {
        return (
          formatNumber(
            row.reduce((sum, row) => sum + Number(row.prsfg_rtrto ?? 0), 0),
          ) + " %"
        );
      },
    },
    { key: "prsfg_notes", header: "Notes", width: "80px" },
    // { key: "prsfg_stock", header: "Stock", width: "80px" },
    { key: "avail_fgqty", header: "Completed", width: "80px" },
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
        //   actve={row.prsfg_actve}
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
            disabled={true}
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
      <p>Output → SFG/FG</p>
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
        //onRowClick={(row) => onEdit(row)}
        emptyMessage="No SFG/FG found"
        className="mt-2"
      />
    </>
  );
};
export default SFGList;
