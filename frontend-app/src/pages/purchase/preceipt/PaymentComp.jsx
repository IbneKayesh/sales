import React, { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import tmpb_mrcpt from "@/models/purchase/tmpb_mrcpt.json";

const PaymentComp = ({
  errors,
  formData,
  handleChange,
  onShowIncludeCost,
  onShowExcludeCost,
  onShowPayment,
}) => {
  const [payableNote, setPayableNote] = useState("");
  useEffect(() => {
    let note = "";
    if (formData.mrcpt_vatpy === 1) {
      note += " with Vat";
    }
    setPayableNote(note);
  }, [formData.mrcpt_vatpy]);

  function getDecimalPart(value) {
    if (value == null || isNaN(value)) return 0;
    return Math.abs(Number(value)) % 1;
  }

  const handleSetRoundOffAmount = () => {
    const decimalPart = getDecimalPart(formData.mrcpt_pyamt);
    //console.log(decimalPart);
    handleChange("mrcpt_rnamt", decimalPart);
  };

  return (
    <div className="grid mt-3">
      <div className="col-12 md:col-4">
        <div className="col-12 mb-3">
          <label htmlFor="mrcpt_trnte" className="block font-bold mb-2">
            {tmpb_mrcpt.mrcpt_trnte.label}
          </label>
          <InputText
            id="mrcpt_trnte"
            name="mrcpt_trnte"
            value={formData.mrcpt_trnte}
            onChange={(e) => handleChange("mrcpt_trnte", e.target.value)}
            className={`w-full ${errors.mrcpt_trnte ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmpb_mrcpt.mrcpt_trnte.label}`}
            disabled={formData.edit_stop}
            variant={formData.edit_stop ? "filled" : "outlined"}
          />
          {errors.mrcpt_trnte && (
            <small className="mb-3 text-red-500">{errors.mrcpt_trnte}</small>
          )}
        </div>
        {formData.edit_stop === 1 && formData.mrcpt_ispad === "0" && (
          <Tag
            severity="danger"
            value="Unpaid"
            icon="pi pi-ban"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_ispad === 1 && (
          <Tag
            severity="success"
            value="Paid"
            icon="pi pi-check-circle"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_ispad === 2 && (
          <Tag
            severity="warning"
            value="Partially Paid"
            icon="pi pi-check"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_ispst === 0 && (
          <Tag
            severity="danger"
            value="Not Posted"
            icon="pi pi-times"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_iscls === 1 && (
          <Tag
            severity="danger"
            value="Closed"
            icon="pi pi-lock"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_vatcl === 1 && (
          <Tag
            severity="success"
            value="VAT Collected"
            icon="pi pi-check-circle"
            className="p-2 mr-2"
          />
        )}
        {formData.mrcpt_hscnl === 1 && (
          <Tag
            severity="danger"
            value="Cancelled"
            icon="pi pi-ban"
            className="p-2 mr-2"
          />
        )}
      </div>
      {/* Payment Entry and List */}
      <div className="col-12 md:col-4">
      </div>
      {/* Financial Summary Information */}
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
                {Number(formData.mrcpt_odamt).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-content-between">
              <span>Discount (2)</span>
              <span className="font-bold text-red-500">
                -{Number(formData.mrcpt_dsamt).toFixed(2)}
              </span>
            </div>

            <div
              className={`flex justify-content-between`}
              onClick={() =>
                !formData.edit_stop &&
                handleChange("mrcpt_vatpy", formData.mrcpt_vatpy === 1 ? 0 : 1)
              }
            >
              <div
                className={`flex align-items-center gap-2 ${!formData.edit_stop ? "text-white bg-gray-500 p-1 border-round-md cursor-pointer" : ""}`}
              >
                <i
                  className={
                    formData.mrcpt_vatpy === 1
                      ? "pi pi-check-circle text-bold text-white"
                      : "pi pi-circle text-bold text-red-500"
                  }
                />
                <span>VAT (3)</span>
              </div>
              <span className="font-bold text-900">
                {Number(formData.mrcpt_vtamt).toFixed(2)}
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
                {Number(formData.mrcpt_incst || 0).toFixed(2)}
              </span>
            </div>

            <div
              className={`flex justify-content-between`}
              onClick={() => !formData.edit_stop && handleSetRoundOffAmount()}
            >
              <div
                className={`flex align-items-center gap-2 ${!formData.edit_stop ? "text-white bg-gray-500 p-1 border-round-md cursor-pointer" : ""}`}
              >
                <i
                  className={
                    formData.edit_stop === 0
                      ? "pi pi-sync text-bold text-white"
                      : "pi pi-sync text-bold text-white"
                  }
                />
                <span>Round Off (5)</span>
              </div>
              <div>
                {formData.edit_stop === 1 ? (
                  <span className="font-bold">
                    {Number(formData.mrcpt_rnamt || 0).toFixed(2)}
                  </span>
                ) : (
                  <InputNumber
                    value={formData.mrcpt_rnamt}
                    onValueChange={(e) => handleChange("mrcpt_rnamt", e.value)}
                    className={`${errors.mrcpt_rnamt ? "p-invalid" : ""}`}
                    inputStyle={{
                      width: "100%",
                      padding: "3px",
                      color: formData.mrcpt_rnamt > 0 ? "red" : "",
                      backgroundColor:
                        formData.mrcpt_rnamt > 0 ? "#f9fae9ff" : "",
                      textAlign: "right",
                    }}
                    max={10}
                    min={0}
                    minFractionDigits={2}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-content-between">
              <span>Total (6) [1+3+4-2+5]</span>
              <span className="font-bold text-900">
                {Number(formData.mrcpt_ttamt).toFixed(2)}
              </span>
            </div>

            <div className="border-top-1 border-200 my-2"></div>

            <div className="flex justify-content-between">
              <span className="font-bold">Payable (7)</span>
              <div className="flex flex-column align-items-end">
                <span className="font-bold">{formData.mrcpt_pyamt}</span>
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
                {formData.mrcpt_pdamt}
              </span>
            </div>

            <div className="flex justify-content-between">
              <span>Due (9)</span>
              <span className="text-red-700 font-bold">
                {formData.mrcpt_duamt}
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
                {Number(formData.mrcpt_excst || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComp;
