import { useEffect, useState, useRef } from "react";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ZeroRowCell from "@/components/ZeroRowCell";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import { parseAttributes } from "@/utils/jsonParser";
import tmeb_mretn from "@/models/sales/tmeb_mretn.json";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";

const EntryComp = ({
  isBusy,
  errors,
  formData,
  formDataItemList,
  handleChange,
  onShowIncludeCost,
  onShowExcludeCost,
  onShowPayment,
  handleSubmit
}) => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [showExtraColumns, setShowExtraColumns] = useState(false);
  const [payableNote, setPayableNote] = useState("");

  useEffect(() => {
    let note = "";
    if (!!formData.mretn_vatpy) {
      note += " with Vat";
    }
    setPayableNote(note);
  }, [formData.mretn_vatpy]);

  useEffect(() => {
    const hasCreditLimit = Number(formData.mretn_duamt || 0) > 0;
    //console.log()
    if (hasCreditLimit) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [formData.mretn_duamt]);

  const mretn_cntct_val = () => {
    return (
      formData.cntct_cntnm +
      ", " +
      formData.cntct_cntno +
      ", " +
      formData.cntct_cntno +
      ", " +
      formData.cntct_ofadr
    );
  };

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.cretn_attrb);

    return (
      <div className="flex flex-column">
        {/* {JSON.stringify(rowData.cretn_attrb)} */}
        <span className="text-md">{`${rowData.items_icode} - ${rowData.items_iname}`}</span>
        {Object.keys(parsedAttr).length > 0 && (
          <span className="text-gray-500 text-sm">
            {Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </span>
        )}
      </div>
    );
  };

  const items_iname_FT = () => {
    return (
      <>
        <span>{formDataItemList.length} Items </span>
      </>
    );
  };

  const cretn_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.cretn_itrat).toFixed(2);
    const formattedCostPrice = Number(rowData.cretn_csrat).toFixed(2);
    return (
      <>
        {formattedPrice > 0 ? (
          formattedPrice
        ) : (
          <span className="text-red-500">{formattedPrice}</span>
        )}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const cretn_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.cretn_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const cretn_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cretn_itqty || 0), 0)
      .toFixed(2);
  };

  const cretn_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.cretn_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.cretn_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cretn_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const cretn_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cretn_dsamt || 0), 0)
      .toFixed(2);
  };

  const cretn_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.cretn_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.cretn_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cretn_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const cretn_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cretn_vtamt || 0), 0)
      .toFixed(2);
  };

  const cretn_ntamt_BT = (rowData) => {
    return Number(rowData.cretn_ntamt).toFixed(2);
  };

  const cretn_ntamt_FT = () => {
    return (
      <>
        {netAmount}
        {showExtraColumns ? (
          <span className="text-gray-500"> ({amount})</span>
        ) : null}
      </>
    );
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cretn_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cretn_ntamt || 0), 0)
    .toFixed(2);

  const bulk_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.cretn_itqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const cretn_srcnm_BT = (rowData) => {
    return rowData.cretn_srcnm;
  };

  const rowEditor_HT = () => (
    <span
      className={`pi ${
        showExtraColumns ? "pi-eye-slash text-red-300" : "pi-eye text-gray-300"
      }  px-2 hover:text-gray-500 cursor-pointer`}
      onClick={() => setShowExtraColumns((prev) => !prev)}
    />
  );

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
        min={0}
        minFractionDigits={2}
      />
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
      />
    );
  };

  function getDecimalPart(value) {
    if (value == null || isNaN(value)) return 0;
    return Math.abs(Number(value)) % 1;
  }

  const handleSetRoundOffAmount = () => {
    const decimalPart = getDecimalPart(formData.mretn_pyamt);
    //console.log(decimalPart);
    handleChange("mretn_rnamt", decimalPart);
  };

  return (
    <div>
      {/* {JSON.stringify(formData)} */}
      {/* {JSON.stringify(formDataItemList)} */}
      <div className="grid">
        <div className="col-12 md:col-2">
          <label htmlFor="mretn_trnno" className="block font-bold mb-2">
            {tmeb_mretn.mretn_trnno.label}
          </label>
          <span className="w-full p-inputtext p-component p-disabled p-filled p-variant-filled">
            {formData.mretn_trnno || "[Auto SL]"}
          </span>
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="mretn_trdat" className="block font-bold mb-2">
            {tmeb_mretn.mretn_trdat.label}
          </label>
          <span className="w-full p-inputtext p-component p-disabled p-filled p-variant-filled">
            {formData.mretn_trdat?.toLocaleString().split("T")[0]}
          </span>
        </div>
        <div className="col-12 md:col-5">
          <label htmlFor="mretn_cntct" className="block font-bold mb-2">
            {tmeb_mretn.mretn_cntct.label}
          </label>
          <span className="w-full p-inputtext p-component p-disabled p-filled p-variant-filled">
            {mretn_cntct_val()}
          </span>
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="mretn_refno" className="block font-bold mb-2">
            {tmeb_mretn.mretn_refno.label}
          </label>
          <span className="w-full p-inputtext p-component p-disabled p-filled p-variant-filled">
            {formData.mretn_refno}
          </span>
        </div>
        <div className="col-12 md:col-1">
          <label className="block font-bold mb-2">Posted</label>
          <Tag
            severity="success"
            value="Posted"
            icon="pi pi-lock"
            className="w-full py-1"
          />
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          value={formDataItemList}
          dataKey="id"
          emptyMessage="No items added yet."
          size="small"
          className="shadow-1"
          showGridlines
        >
          <Column
            field="items_iname"
            header="Item"
            body={items_iname_BT}
            footer={items_iname_FT}
          />
          <Column
            field="cretn_itrat"
            header="Price"
            body={cretn_itrat_BT}
            editor={numberEditor}
          />
          <Column
            field="cretn_itqty"
            header="Qty"
            body={cretn_itqty_BT}
            footer={cretn_itqty_FT}
            editor={numberEditor}
          />
          <Column
            field="cretn_itamt"
            header="Amount"
            headerStyle={{ backgroundColor: "#49769bff" }}
            footer={amount}
            hidden={!showExtraColumns}
          />
          <Column
            field="cretn_dspct"
            header="Discount"
            body={cretn_dspct_BT}
            footer={cretn_dspct_FT}
            editor={numberEditor}
          />
          <Column
            field="cretn_vtpct"
            header="VAT"
            body={cretn_vtpct_BT}
            footer={cretn_vtpct_FT}
            editor={numberEditor}
          />
          <Column
            field="cretn_ntamt"
            header="Sub Total"
            body={cretn_ntamt_BT}
            footer={cretn_ntamt_FT}
          />
          <Column field="cretn_notes" header="Remarks" editor={textEditor} />
          <Column header="Bulk" body={bulk_BT} />
          <Column
            field="cretn_srcnm"
            header="Source"
            headerStyle={{ backgroundColor: "#49769bff" }}
            body={cretn_srcnm_BT}
            hidden={!showExtraColumns}
          />
          <Column
            header={rowEditor_HT()}
            rowEditor
            headerStyle={{ minWidth: "20px" }}
          />
        </DataTable>
      </div>
      <div className="grid mt-3">
        <div className="col-12 md:col-4">
          <div className="col-12">
            <label htmlFor="mretn_trnte" className="block font-bold mb-2">
              {tmeb_mretn.mretn_trnte.label}
            </label>
            <span className="w-full p-inputtext p-component p-disabled p-filled p-variant-filled">
              {formData.mretn_trnte || ""}
            </span>
          </div>
        </div>
        <div className="col-12 md:col-4"></div>
        <div className="col-12 md:col-4">
          <div className="surface-card p-3 shadow-1 border-round-md border-left-3 border-primary h-full">
            <div className="flex align-items-center justify-content-between mb-3">
              <h5 className="m-0 font-bold text-900">Order Summary</h5>
              <i className="pi pi-briefcase text-primary text-xl" />
            </div>

            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between">
                <span>Gross Amount (1)</span>
                <span className="font-bold text-900">
                  {Number(formData.mretn_odamt).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-content-between">
                <span>Discount (2)</span>
                <span className="font-bold text-red-500">
                  -{Number(formData.mretn_dsamt).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-content-between">
                <div
                  className={`flex align-items-center gap-2 ${!formData.edit_stop ? "text-white bg-gray-500 p-1 border-round-md cursor-pointer" : ""}`}
                >
                  <i
                    className={
                      !!formData.mretn_vatpy
                        ? "pi pi-check-circle text-bold text-white"
                        : "pi pi-circle text-bold text-red-500"
                    }
                  />
                  <span>VAT (3)</span>
                </div>
                <span className="font-bold text-900">
                  {Number(formData.mretn_vtamt).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-content-between">
                <div
                  className="flex align-items-center gap-2 text-white bg-gray-500 p-1 border-round-md cursor-pointer"
                  onClick={() => onShowIncludeCost()}
                >
                  <i className="pi pi-plus-circle text-bold" />
                  <span>Include Cost (4)</span>
                </div>
                <span className="font-bold">
                  {Number(formData.mretn_incst || 0).toFixed(2)}
                </span>
              </div>

              <div
                className={`flex justify-content-between`}
                onClick={() => !formData.edit_stop && handleSetRoundOffAmount()}
              >
                <div
                  className={`flex align-items-center gap-2 ${!formData.edit_stop ? "text-white bg-gray-500 p-1 border-round-md cursor-pointer" : ""}`}
                >
                  <i className={"pi pi-sync text-bold text-white"} />
                  <span>Round Off (5)</span>
                </div>
                <div>
                  <span className="font-bold">
                    {Number(formData.mretn_rnamt || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-content-between">
                <span>Total (6) [1+3+4-2+5]</span>
                <span className="font-bold text-900">
                  {Number(formData.mretn_ttamt).toFixed(2)}
                </span>
              </div>

              <div className="border-top-1 border-200 my-2"></div>

              <div className="flex justify-content-between">
                <span className="font-bold">Payable (7)</span>
                <div className="flex flex-column align-items-end">
                  <span className="font-bold">{formData.mretn_pyamt}</span>
                  <span className="text-xs text-red-500 font-normal">
                    {payableNote}
                  </span>
                </div>
              </div>

              <div className="flex justify-content-between">
                <div
                  className="flex align-items-center gap-2 text-white bg-gray-500 p-1 border-round-md cursor-pointer"
                  onClick={() => onShowPayment()}
                >
                  <i className="pi pi-plus-circle text-bold" />
                  <span>Paid (8)</span>
                </div>
                <span className="text-green-700 font-bold">
                  {formData.mretn_pdamt}
                </span>
              </div>

              <div className="flex justify-content-between">
                <span>Due (9) [7-8]</span>
                <span className="text-red-700 font-bold">
                  {formData.mretn_duamt}
                </span>
              </div>

              <div className="flex justify-content-between">
                <div
                  className="flex align-items-center gap-2 text-white bg-gray-500 p-1 border-round-md cursor-pointer"
                  onClick={() => onShowExcludeCost()}
                >
                  <i className="pi pi-plus-circle text-bold" />
                  <span>Exclude Cost (10)</span>
                </div>
                <span className="font-bold">
                  {Number(formData.mretn_excst || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-content-end">
        <ButtonGroup>
          <Button
            type="button"
            label="Back"
            icon="pi pi-arrow-left"
            size="small"
            severity="help"
            //onClick={handleCancel}
            disabled={!formData.id}
          />
          <Button
            type="button"
            label="Print"
            icon="pi pi-print"
            severity="info"
            size="small"
            //onClick={handleShowPrint}
            disabled={!formData.id}
          />
          <Button
            type="button"
            label={"Save with Posted"}
            icon={"pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
            onClick={handleSubmit}
            disabled={disableSubmit}
          />
        </ButtonGroup>
      </div>
    </div>
  );
};
export default EntryComp;
