import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import RequiredText from "@/components/RequiredText";
import EmptyState from "@/components/EmptyState";
import { formatUnits } from "@/utils/unitFormatter";

const ItemsComp = ({
  readOnly,
  formData,
  errors,
  onChange,
  mrrdt_items_Options,
  dataList,
  onAddItemsClick,
  onRemoveItemsClick,
}) => {
  const items_iname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{rowData.sgrup_sname}</span>
        <span className="text-sm">{rowData.items_iname}</span>
        <span className="text-sm mt-1">#{rowData.items_icode}</span>
      </div>
    );
  };

  const mrrdt_trqty_BT = (rowData) => {
    return formatUnits(
      rowData.runit_uname,
      rowData.items_pkqty,
      rowData.punit_uname,
      rowData.mrrdt_trqty,
    );
  };

  const mrrdt_dspct_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          %: {Number(rowData.mrrdt_dspct || 0).toFixed(2)}
        </span>
        <span className="text-sm mt-1">
          Amount: {Number(rowData.mrrdt_dsamt || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const mrrdt_sdvat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          VAT%: {Number(rowData.mrrdt_sdvat || 0).toFixed(2)}
        </span>
        <span className="text-sm mt-1">
          TAX%: {Number(rowData.mrrdt_txpct || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const mrrdt_fxcst_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Fix Cost %: {Number(rowData.mrrdt_fxcst || 0).toFixed(2)}
        </span>
        <span className="text-sm mt-1">
          Other Cost: {Number(rowData.mrrdt_otcst || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Cost Price: {Number(rowData.mrrdt_csrat || 0).toFixed(3)}
        </span>
      </div>
    );
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
          // disabled={readOnly}
        />
      </div>
    );
  };

  return (
    <>
      {!readOnly && (
        <div className="grid">
          <div className="col-12 md:col-4">
            <label className="block font-bold mb-2 text-red-800">
              Products
            </label>
            <Dropdown
              name="mrrdt_items"
              value={formData.mrrdt_items}
              onChange={(e) => onChange("mrrdt_items", e.value)}
              options={mrrdt_items_Options}
              optionLabel="items_iname"
              optionValue="id"
              className={`w-full ${errors.mrrdt_items ? "p-invalid" : ""}`}
              placeholder="Select item"
              filter
              showClear
              disabled={formData.id}
            />
            <RequiredText text={errors.mrrdt_items} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">Rate</label>
            <InputNumber
              name="mrrdt_trate"
              value={formData.mrrdt_trate}
              onValueChange={(e) => onChange("mrrdt_trate", e.value)}
              className={`w-full ${errors.mrrdt_trate ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
            />
            <RequiredText text={errors.mrrdt_trate} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">Qty</label>
            <InputNumber
              name="mrrdt_trqty"
              value={formData.mrrdt_trqty}
              onValueChange={(e) => onChange("mrrdt_trqty", e.value)}
              className={`w-full ${errors.mrrdt_trqty ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
            />
            <RequiredText text={errors.mrrdt_trqty} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">Disc%</label>
            <InputNumber
              name="mrrdt_dspct"
              value={formData.mrrdt_dspct}
              onValueChange={(e) => onChange("mrrdt_dspct", e.value)}
              className={`w-full ${errors.mrrdt_dspct ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
            />
            <RequiredText text={errors.mrrdt_dspct} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">Disc</label>
            <InputNumber
              name="mrrdt_dsamt"
              value={formData.mrrdt_dsamt}
              onValueChange={(e) => onChange("mrrdt_dsamt", e.value)}
              className={`w-full ${errors.mrrdt_dsamt ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
              disabled
            />
            <RequiredText text={errors.mrrdt_dsamt} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">VAT%</label>
            <InputNumber
              name="mrrdt_sdvat"
              value={formData.mrrdt_sdvat}
              onValueChange={(e) => onChange("mrrdt_sdvat", e.value)}
              className={`w-full ${errors.mrrdt_sdvat ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
            />
            <RequiredText text={errors.mrrdt_sdvat} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">TAX%</label>
            <InputNumber
              name="mrrdt_txpct"
              value={formData.mrrdt_txpct}
              onValueChange={(e) => onChange("mrrdt_txpct", e.value)}
              className={`w-full ${errors.mrrdt_txpct ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
            />
            <RequiredText text={errors.mrrdt_txpct} />
          </div>
          <div className="col-12 md:col-2">
            <label className="block font-bold mb-2 text-red-800">F.Cost%</label>
            <InputNumber
              name="mrrdt_fxcst"
              value={formData.mrrdt_fxcst}
              onValueChange={(e) => onChange("mrrdt_fxcst", e.value)}
              className={`w-full ${errors.mrrdt_fxcst ? "p-invalid" : ""}`}
              placeholder="0.00"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={6}
              disabled={true}
            />
            <RequiredText text={errors.mrrdt_fxcst} />
          </div>
          <div className="col-12 md:col-4">
            <label className="block font-bold mb-2">Notes</label>
            <InputText
              name="mrrdt_notes"
              value={formData.mrrdt_notes}
              onChange={(e) => onChange("mrrdt_notes", e.target.value)}
              className={`w-full ${errors.mrrdt_notes ? "p-invalid" : ""}`}
              placeholder="Enter notes"
            />
            <RequiredText text={errors.mrrdt_notes} />
          </div>
          <div className="col-12 md:col-2">
            <Button
              label="Add"
              icon="pi pi-plus"
              size="small"
              severity="info"
              onClick={() => onAddItemsClick()}/>
          </div>
        </div>
      )}
      {/* {JSON.stringify(dataList)} */}
      <div className="grid mt-3">
        <div className="col-12">
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
              <Column field="items_iname" header="Name" body={items_iname_BT} />
              <Column field="mrrdt_trate" header="Rate" />
              <Column field="mrrdt_trqty" header="Qty" body={mrrdt_trqty_BT} />
              <Column field="mrrdt_tramt" header="Amount" />
              <Column
                field="mrrdt_dspct"
                header="Discount"
                body={mrrdt_dspct_BT}
              />
              <Column
                field="mrrdt_sdvat"
                header="VAT/TAX"
                body={mrrdt_sdvat_BT}
              />
              <Column field="mrrdt_fxcst" header="Cost" body={mrrdt_fxcst_BT} />
              <Column field="mrrdt_ntamt" header="Sub Total" />
              <Column field="mrrdt_notes" header="Remarks" />
              <Column header={dataList?.length + " rows"} body={action_BT} />
            </DataTable>
          ) : (
            <EmptyState stateMessage={"No MRR items added yet!"} />
          )}
        </div>
      </div>
    </>
  );
};
export default ItemsComp;
