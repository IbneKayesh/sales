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
      header: "BOQ",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prfoh_boqty)} {row.runit_cname} ×{" "}
            {formatNumber(row.prfoh_borat)} ={" "}
            {formatNumber(row.prfoh_boqty * row.prfoh_borat)}
          </span>
        );
      },
    },
    {
      key: "prfoh_foqty",
      header: "Consumption",
      width: "80px",
      //body: (v) => formatNumber(v, true),
      body: (_, row) => {
        return (
          <span>
            {formatNumber(row.prfoh_foqty)} {row.runit_cname} x{" "}
            {formatNumber(row.prfoh_forat)} = {formatNumber(row.prfoh_foval)}
          </span>
        );
      },
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.prfoh_foqty ?? 0), 0);
      },
    },
    { key: "prfoh_notes", header: "Notes", width: "80px" },
    { key: "prfoh_stock", header: "Stock", width: "80px", visible: false },
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
