import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { IconReceiptPlus } from "@/icons";
import Button from "@/components/Button";
import { formatNumber } from "@/utils/misc";

const FOHList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prfoh_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "prfoh_boqty",
      header: "BOM Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prfoh_boqty)} x {formatNumber(row.prfoh_borat)}{" "}
            {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prfoh_foqty",
      header: "Qty",
      width: "80px",
      body: (v) => formatNumber(v, true),
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.prfoh_foqty ?? 0), 0);
      },
    },
    {
      key: "prfoh_forat",
      header: "Rate",
      width: "80px",
      body: (v) => formatNumber(v, true),
    },
    {
      key: "prfoh_foval",
      header: "Value",
      width: "80px",
      body: (v) => formatNumber(v, true),
    },
    { key: "prfoh_notes", header: "Notes", width: "80px" },
    { key: "prfoh_stock", header: "Stock", width: "80px" },
    { key: "party_id", header: "party_id", width: "80px" },
    { key: "chtac_id", header: "chtac_id", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        // <ActionButton
        //   rowData={row}
        //   actve={row.prfoh_actve}
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
      <p>Input → FOH</p>
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
        emptyMessage="No factory overhead found"
        className="mt-2"
      />
    </>
  );
};
export default FOHList;
