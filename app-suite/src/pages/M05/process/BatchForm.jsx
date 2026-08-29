import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import { IconPlus } from "@/icons";
import DataTable from "@/components/DataTable";

const BatchForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onAddToList,
}) => {
  const dtColumns = [
    { key: "price_cname", header: "Name", width: "100px" },
    {
      key: "avail_fgqty",
      header: "Process Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.avail_fgqty} {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prbtc_brcod",
      header: "Barcode",
      width: "80px",
      body: (_, row) => {
        return (
          <InputText
            label=""
            placeholder="Enter barcode"
            value={formData.prbtc_brcod}
            onChange={(e) => onChange("prbtc_brcod", e.target.value, row.id)}
            disabled={!readOnly}
          />
        );
      },
    },
    {
      key: "prbtc_batch",
      header: "Batch No",
      width: "80px",
      body: (_, row) => {
        return (
          <InputText
            label=""
            placeholder="Enter batch"
            value={formData.prbtc_batch}
            onChange={(e) => onChange("prbtc_batch", e.target.value, row.id)}
            disabled={!readOnly}
          />
        );
      },
    },
    {
      key: "prbtc_srial",
      header: "Serial No",
      width: "80px",
      body: (_, row) => {
        return (
          <InputText
            label=""
            placeholder="Enter serial"
            value={formData.prbtc_srial}
            onChange={(e) => onChange("prbtc_srial", e.target.value, row.id)}
            disabled={!readOnly}
          />
        );
      },
    },
    {
      key: "prbtc_gdstk",
      header: "Good Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <InputNumber
            label=""
            placeholder="Enter Qty"
            value={row.prbtc_gdstk}
            onChange={(e) => onChange("prbtc_gdstk", e.target.value, row.id)}
            step="0.01"
            disabled={!readOnly}
          />
        );
      },
    },
    {
      key: "prbtc_bdstk",
      header: "Reject Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <InputNumber
            label=""
            placeholder="Enter Qty"
            value={row.prbtc_bdstk}
            onChange={(e) => onChange("prbtc_bdstk", e.target.value, row.id)}
            //error={formErrors.prsfg_fgrto}
            step="0.01"
            disabled={!readOnly}
          />
        );
      },
    },
    { key: "prbtc_fgrat", header: "Rate", width: "80px" },
    { key: "prbtc_fgval", header: "Value", width: "80px" },
    { key: "prbtc_wkshf", header: "Shift", width: "80px" },
    { key: "prbtc_emply", header: "Manager", width: "80px" },
    {
      key: "prbtc_notes",
      header: "Notes",
      width: "200px",
      body: (_, row) => {
        return (
          <InputText
            label=""
            placeholder="Enter notes"
            value={formData.prbtc_notes}
            onChange={(e) => onChange("prbtc_notes", e.target.value, row.id)}
            disabled={!readOnly}
          />
        );
      },
    },
  ];
  return (
    <div className="form-wrap">
      <h4>Batch Output</h4>
      {/* <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={[
              { label: "Raw Material (RM)", value: "RM" },
              { label: "Packing Material (PM)", value: "PM" },
              { label: "Semi-FG", value: "SFG" },
              { label: "FG", value: "FG" },
            ]}
            value={formData.prbtc_types}
            onChange={(e) => onChange("prbtc_types", e.target.value)}
            error={formErrors.prbtc_types}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Group"
            options={[
              { label: "Main", value: "MAIN" },
              { label: "Co-Product (CO)", value: "CO" },
              { label: "By-Product (BY)", value: "BY" },
            ]}
            value={formData.prbtc_group}
            onChange={(e) => onChange("prbtc_group", e.target.value)}
            error={formErrors.prbtc_group}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={items_Options}
            value={formData.prbtc_items}
            onChange={(e) => onChange("prbtc_items", e.target.value)}
            error={formErrors.prbtc_items}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.prbtc_units}
            onChange={(e) => onChange("prbtc_units", e.target.value)}
            error={formErrors.prbtc_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Batch No"
            placeholder="Enter batch no"
            value={formData.prbtc_batch}
            onChange={(e) => onChange("prbtc_batch", e.target.value)}
            error={formErrors.prbtc_batch}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Good Qty (A)"
            placeholder="Enter qty"
            value={formData.prbtc_gaqty}
            onChange={(e) => onChange("prbtc_gaqty", e.target.value)}
            error={formErrors.prbtc_gaqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Good Qty (B)"
            placeholder="Enter qty"
            value={formData.prbtc_gbqty}
            onChange={(e) => onChange("prbtc_gbqty", e.target.value)}
            error={formErrors.prbtc_gbqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Reject Qty"
            placeholder="Enter qty"
            value={formData.prbtc_rjqty}
            onChange={(e) => onChange("prbtc_rjqty", e.target.value)}
            error={formErrors.prbtc_rjqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.prbtc_pbrat}
            onChange={(e) => onChange("prbtc_pbrat", e.target.value)}
            error={formErrors.prbtc_pbrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Work Shift"
            placeholder="Enter shift"
            value={formData.prbtc_wkshf}
            onChange={(e) => onChange("prbtc_wkshf", e.target.value)}
            error={formErrors.prbtc_wkshf}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Employee"
            placeholder="Select employee"
            value={formData.prbtc_emply}
            onChange={(e) => onChange("prbtc_emply", e.target.value)}
            error={formErrors.prbtc_emply}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-5">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.prbtc_notes}
            onChange={(e) => onChange("prbtc_notes", e.target.value)}
            error={formErrors.prbtc_notes}
            disabled={readOnly}
          />
        </div>
      </div> */}

      <DataTable
        columns={dtColumns}
        data={formData}
        pageSize={100}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        //onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-0"
      />
      <div className="form-actions">
        <Button variant="outline" onClick={onAddToList} disabled={isBusy}>
          <IconPlus size={16} className="icon-left" />
          Complete
        </Button>
      </div>
    </div>
  );
};
export default BatchForm;
