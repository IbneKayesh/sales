import Button from "@/components/Button";
import DataTable from "@/components/DataTable";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import { formatNumber } from "@/utils/misc";

const CancelForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  listData,
  onCancelPO,
}) => {
  const cnrsn_Options = [
    {
      label: "Product is not available",
      value: "Product is not available",
    },
    {
      label: "Product is not qualified",
      value: "Product is not qualified",
    },
    {
      label: "Wrong product ordered",
      value: "Wrong product ordered",
    },
    {
      label: "Different product received",
      value: "Different product received",
    },
    {
      label: "Supplier business is closed",
      value: "Supplier business is closed",
    },
  ];

  const cnjrn_Options = [
    { label: "Keep as Advance (Do Nothing)", value: "SYS_NONE" },
  ];

  const dtColumns = [
    {
      key: "price_cname",
      header: "Name",
      width: "200px",
      body: (_, row) => {
        return (
          <span>
            {row.price_cname} - {formatNumber(row.items_szqty)}{" "}
            {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "pordc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.pordc_itrat)} x{" "}
            {formatNumber(rowData.pordc_itqty)} {rowData.runit_cname} ={" "}
            {formatNumber(rowData.pordc_itamt)}
          </>
        );
      },
      footer: (_, row) => {
        return (
          formatNumber(
            row.reduce((sum, row) => sum + Number(row.pordc_itqty ?? 0), 0),
          ) +
          " = " +
          formatNumber(
            row.reduce((sum, row) => sum + Number(row.pordc_itamt ?? 0), 0),
          )
        );
      },
    },
    {
      key: "pordc_mrqty",
      header: "MRR Qty",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "pordc_mrpnd",
      header: "Cancel Qty",
      width: "80px",
      body: (_, rowData) => {
        return <>{formatNumber(rowData.pordc_itqty - rowData.pordc_mrqty)}</>;
      },
    },
  ];
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-12">
          <Dropdown
            label="Cancel Reason"
            options={cnrsn_Options}
            value={formData.pordm_cnrsn}
            onChange={(e) => onChange("pordm_cnrsn", e.target.value)}
            error={formErrors.pordm_cnrsn}
            required
            placeholder="Select..."
            disabled={!readOnly}
          />
        </div>
        {/* <div className="col-span-4">
          <InputNumber
            label="Cancel Value"
            placeholder="0.00"
            value={formData.pordm_cnval}
            onChange={(e) => onChange("pordm_cnval", e.target.value)}
            error={formErrors.pordm_cnval}
            step="0.01"
            required
            disabled={readOnly}
          />
        </div> */}
        <div className="col-span-8">
          <Dropdown
            label="Value Return Mode"
            options={cnjrn_Options}
            value={formData.pordm_cnjrn}
            onChange={(e) => onChange("pordm_cnjrn", e.target.value)}
            error={formErrors.pordm_cnjrn}
            required
            placeholder="Select..."
            disabled={!readOnly}
          />
        </div>
        <div className="col-span-12">
          <DataTable
            columns={dtColumns}
            data={listData}
            pageSize={500}
            showRows={false}
            sortable
            searchable={false}
            striped
            hoverable
            exportable={false}
            exportFilename="data-export.csv"
            //onRowClick={(row) => onEdit(row)}
            emptyMessage="No data found"
            className="mt-2"
            //cfColumns={cfColumns}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={() => onCancelPO()}
          disabled={isBusy || !readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Submit Cancel
        </Button>
      </div>
    </div>
  );
};
export default CancelForm;
