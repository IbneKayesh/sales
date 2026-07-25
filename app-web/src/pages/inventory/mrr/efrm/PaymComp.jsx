import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import RequiredText from "@/components/RequiredText";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/datetime";

const PaymComp = ({
  readOnly,
  formData,
  errors,
  onChange,
  mrrpy_pmode_Options,
  dataList,
  onAddItemsClick,
  onRemoveItemsClick,
}) => {

  const mrrpy_pydat_BT = (rowData) => {
    return formatDate(rowData.mrrpy_pydat);
  };

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
            name="mrrpy_pmode"
            value={formData.mrrpy_pmode}
            onChange={(e) => onChange("mrrpy_pmode", e.value)}
            options={mrrpy_pmode_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.mrrpy_pmode ? "p-invalid" : ""}`}
            placeholder="Select mode"
            filter
            showClear
            disabled={formData.id}
          />
          <RequiredText text={errors.mrrpy_pmode} />

          <label className="block font-bold mb-2 text-red-800">Amount</label>
          <InputNumber
            name="mrrpy_pdamt"
            value={formData.mrrpy_pdamt}
            onValueChange={(e) => onChange("mrrpy_pdamt", e.value)}
            className={`w-full ${errors.mrrpy_pdamt ? "p-invalid" : ""}`}
            placeholder="0.00"
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={6}
          />
          <RequiredText text={errors.mrrpy_pdamt} />
          <label className="block font-bold mb-2">Notes</label>
          <InputText
            name="mrrpy_notes"
            value={formData.mrrpy_notes}
            onChange={(e) => onChange("mrrpy_notes", e.target.value)}
            className={`w-full ${errors.mrrpy_notes ? "p-invalid" : ""}`}
            placeholder="Enter notes"
          />
          <RequiredText text={errors.mrrpy_notes} />
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
          <Column field="mrrpy_pmode" header="Mode" />
          <Column field="mrrpy_pydat" header="Date" body={mrrpy_pydat_BT} />
          <Column field="mrrpy_pdamt" header="Amount" />
          <Column field="mrrpy_notes" header="Remarks" />
          <Column header={dataList?.length + " rows"} body={action_BT} />
        </DataTable>
      ) : (
        <EmptyState stateMessage={"No Payment items added yet!"} />
      )}
    </div>
  );
};
export default PaymComp;
