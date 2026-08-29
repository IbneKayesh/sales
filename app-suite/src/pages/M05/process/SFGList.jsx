import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import InputNumber from "@/components/InputNumber";

const SFGList = ({ readOnly, listData, onEdit, onDelete, onChange }) => {
  const dtColumns = [
    { key: "prsfg_itype", header: "Type", width: "100px" },
    { key: "price_cname", header: "Item", width: "200px" },
    { key: "prsfg_group", header: "Group", width: "80px" },
    {
      key: "prsfg_boqty",
      header: "BOM Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.prsfg_boqty} x {row.prsfg_borat} {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prsfg_fgqty",
      header: "Process Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <InputNumber
            label=""
            placeholder="Enter Qty"
            value={row.prsfg_fgqty}
            onChange={(e) =>
              onChange("prsfg_fgqty", e.target.value, row.prsfg_price)
            }
            //error={formErrors.prsfg_fgrto}
            step="0.01"
            disabled={readOnly}
          />
        );
      },
    },
    { key: "prsfg_fgrat", header: "Rate", width: "80px" },
    { key: "prsfg_fgval", header: "Value", width: "80px" },
    { key: "prsfg_rtrto", header: "Cost Ratio", width: "80px" },
    { key: "prsfg_notes", header: "Notes", width: "80px" },
    // { key: "prsfg_stock", header: "Stock", width: "80px" },
    { key: "avail_fgqty", header: "Completed", width: "80px" },
    { key: "party_id", header: "party_id", width: "80px" },
    { key: "chtac_id", header: "chtac_id", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prsfg_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
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
        pageSize={15}
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
