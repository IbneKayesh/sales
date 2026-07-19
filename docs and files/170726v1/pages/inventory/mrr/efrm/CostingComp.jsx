import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import RequiredText from "@/components/RequiredText";
import EmptyState from "@/components/EmptyState";

const CostingComp = ({
  readOnly,
  formData,
  errors,
  onChange,
  mrrcs_csmod_Options,
  mrrcs_clmod_Options,
  mrrcs_chead_Options,
  dataList,
  onAddItemsClick,
  onRemoveItemsClick,
}) => {
  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-trash"
          size="small"
          tooltip="Remove"
          severity="danger"
          outlined
          tooltipOptions={{ position: "left" }}
          onClick={() => onRemoveItemsClick(rowData)}
          className={`${readOnly && "hidden"}`}
        />
      </div>
    );
  };

  return (
    <div className="col-12 md:col-4 p-card p-card-inner">
      {!readOnly && (
        <>
          <label className="block font-bold mb-2 text-red-800">Mode</label>
          <Dropdown
            name="mrrcs_csmod"
            value={formData.mrrcs_csmod}
            onChange={(e) => onChange("mrrcs_csmod", e.value)}
            options={mrrcs_csmod_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.mrrcs_csmod ? "p-invalid" : ""}`}
            placeholder="Select mode"
            filter
            showClear
            disabled={formData.id}
          />
          <RequiredText text={errors.mrrcs_csmod} />

          <label className="block font-bold mb-2 text-red-800">Method</label>
          <Dropdown
            name="mrrcs_clmod"
            value={formData.mrrcs_clmod}
            onChange={(e) => onChange("mrrcs_clmod", e.value)}
            options={mrrcs_clmod_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.mrrcs_clmod ? "p-invalid" : ""}`}
            placeholder="Select method"
            filter
            showClear
            disabled={formData.id}
          />
          <RequiredText text={errors.mrrcs_clmod} />

          <label className="block font-bold mb-2 text-red-800">Cost Head</label>
          <Dropdown
            name="mrrcs_chead"
            value={formData.mrrcs_chead}
            onChange={(e) => onChange("mrrcs_chead", e.value)}
            options={mrrcs_chead_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.mrrcs_chead ? "p-invalid" : ""}`}
            placeholder="Select cost head"
            filter
            showClear
            disabled={formData.id}
          />
          <RequiredText text={errors.mrrcs_chead} />

          <label className="block font-bold mb-2 text-red-800">Amount</label>
          <InputNumber
            name="mrrcs_value"
            value={formData.mrrcs_value}
            onValueChange={(e) => onChange("mrrcs_value", e.value)}
            className={`w-full ${errors.mrrcs_value ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.mrrcs_value} />
          <label className="block font-bold mb-2">Notes</label>
          <InputText
            name="mrrcs_notes"
            value={formData.mrrcs_notes}
            onChange={(e) => onChange("mrrcs_notes", e.target.value)}
            className={`w-full ${errors.mrrcs_notes ? "p-invalid" : ""}`}
            placeholder="Enter notes"
          />
          <RequiredText text={errors.mrrcs_notes} />
          <Button
            label="Add"
            icon="pi pi-plus"
            size="small"
            severity="info"
            onClick={() => onAddItemsClick()}
            className="my-2"
          />
        </>
      )}
      {/* {JSON.stringify(dataList)} */}
      {dataList.length > 0 ? (
        <DataTable
          value={dataList}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
        >
          <Column
            header="Sl"
            body={(rowData, options) => options.rowIndex + 1}
          />
          <Column field="mrrcs_csmod" header="Mode" />
          <Column field="mrrcs_clmod" header="Method" />
          <Column field="mrrcs_chead" header="Head" />
          <Column field="mrrcs_value" header="Amount" />
          <Column field="mrrcs_notes" header="Remarks" />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      ) : (
        <EmptyState stateMessage={"No Costing items added yet!"} />
      )}
    </div>
  );
};
export default CostingComp;
