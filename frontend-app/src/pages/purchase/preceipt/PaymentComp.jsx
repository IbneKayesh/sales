import React, { useState, useEffect } from "react";
import { generateGuid } from "@/utils/guid";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/utils/datetime";
import { Tag } from "primereact/tag";
import tmpb_pmstr from "@/models/purchase/tmpb_pmstr.json";

const PaymentComp = ({
  errors,
  setErrors,
  formData,
  handleChange,
  formDataPaymentList,
  setFormDataPaymentList,
}) => {
  const [payableNote, setPayableNote] = useState("");
  useEffect(() => {
    let note = "";
    if (formData.pmstr_vatpy === 1) {
      note += " with Vat";
    }
    setPayableNote(note);
  }, [formData.pmstr_vatpy]);

  function getDecimalPart(value) {
    if (value == null || isNaN(value)) return 0;
    return Math.abs(Number(value)) % 1;
  }

  const handleSetRoundOffAmount = () => {
    const decimalPart = getDecimalPart(formData.pmstr_pyamt);
    //console.log(decimalPart);
    handleChange("pmstr_rnamt", decimalPart);
  };




  return (
    <div className="grid mt-4">
      <div className="col-12 md:col-4">
        <div className="col-12 mb-3">
          <label htmlFor="pmstr_trnte" className="block font-bold mb-2">
            {tmpb_pmstr.pmstr_trnte.label}
          </label>
          <InputText
            id="pmstr_trnte"
            name="pmstr_trnte"
            value={formData.pmstr_trnte}
            onChange={(e) => handleChange("pmstr_trnte", e.target.value)}
            className={`w-full ${errors.pmstr_trnte ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmpb_pmstr.pmstr_trnte.label}`}
            disabled={formData.edit_stop}
            variant={formData.edit_stop ? "filled" : "outlined"}
          />
          {errors.pmstr_trnte && (
            <small className="mb-3 text-red-500">{errors.pmstr_trnte}</small>
          )}
        </div>
        {formData.edit_stop === 1 && formData.pmstr_ispad === "0" && (
          <Tag
            severity="danger"
            value="Unpaid"
            icon="pi pi-ban"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_ispad === 1 && (
          <Tag
            severity="success"
            value="Paid"
            icon="pi pi-check-circle"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_ispad === 2 && (
          <Tag
            severity="warning"
            value="Partially Paid"
            icon="pi pi-check"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_ispst === 0 && (
          <Tag
            severity="danger"
            value="Not Posted"
            icon="pi pi-times"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_isret === 1 && (
          <Tag
            severity="danger"
            value="Returned"
            icon="pi pi-arrow-left"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_iscls === 1 && (
          <Tag
            severity="danger"
            value="Closed"
            icon="pi pi-lock"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_vatcl === 1 && (
          <Tag
            severity="success"
            value="VAT Collected"
            icon="pi pi-check-circle"
            className="p-2 mr-2"
          />
        )}
        {formData.pmstr_hscnl === 1 && (
          <Tag
            severity="danger"
            value="Cancelled"
            icon="pi pi-ban"
            className="p-2 mr-2"
          />
        )}
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
                {Number(formData.pmstr_odamt).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-content-between">
              <span>Discount (2)</span>
              <span className="font-bold text-red-500">
                -{Number(formData.pmstr_dsamt).toFixed(2)}
              </span>
            </div>

            <div
              className={`flex justify-content-between ${
                !formData.edit_stop
                  ? "cursor-pointer hover:surface-100 border-round py-2"
                  : ""
              }`}
              onClick={() =>
                !formData.edit_stop &&
                handleChange(
                  "pmstr_vatpy",
                  formData.pmstr_vatpy === 1 ? 0 : 1
                )
              }
            >
              <div className={`flex align-items-center gap-2 ${!formData.edit_stop ? "bg-green-200 p-1 border-round-md" : ""}`}>
                <i
                  className={
                    formData.pmstr_vatpy === 1
                      ? "pi pi-check-circle text-bold text-green-500"
                      : "pi pi-circle text-bold text-red-500"
                  }
                />
                <span>VAT (3)</span>
              </div>
              <span className="font-bold text-900">
                {Number(formData.pmstr_vtamt).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-content-between">
              <span>Include Cost (4)</span>
              {formData.edit_stop ? (
                <span className="font-bold">
                  {Number(formData.pmstr_incst || 0).toFixed(2)}
                </span>
              ) : (
                <InputNumber
                  value={formData.pmstr_incst}
                  onValueChange={(e) => handleChange("pmstr_incst", e.value)}
                  className={`${errors.pmstr_excst ? "p-invalid" : ""}`}
                  inputStyle={{
                    width: "100%",
                    padding: "3px",
                    color: formData.pmstr_incst > 0 ? "red" : "",
                    backgroundColor:
                      formData.pmstr_incst > 0 ? "#f9fae9ff" : "",
                    textAlign: "right",
                  }}
                  mode="decimal"
                  minFractionDigits={2}
                />
              )}
            </div>

            <div className="flex justify-content-between">
              <span>Exclude Cost (5)</span>
              {formData.edit_stop ? (
                <span className="font-bold">
                  {Number(formData.pmstr_excst || 0).toFixed(2)}
                </span>
              ) : (
                <InputNumber
                  value={formData.pmstr_excst}
                  onValueChange={(e) => handleChange("pmstr_excst", e.value)}
                  className={`${errors.pmstr_excst ? "p-invalid" : ""}`}
                  inputStyle={{
                    width: "100%",
                    padding: "3px",
                    color: formData.pmstr_excst > 0 ? "red" : "",
                    backgroundColor:
                      formData.pmstr_excst > 0 ? "#f9fae9ff" : "",
                    textAlign: "right",
                  }}
                  mode="decimal"
                  minFractionDigits={2}
                />
              )}
            </div>

            <div
              className={`flex justify-content-between ${
                !formData.edit_stop
                  ? "cursor-pointer hover:surface-100 border-round py-2"
                  : ""
              }`}
              onClick={() => !formData.edit_stop && handleSetRoundOffAmount()}
            >
              <div className={`flex gap-2 ${!formData.edit_stop ? "bg-green-200 p-1 border-round-md" : ""}`}>
                <i
                  className={
                    formData.edit_stop === 0
                      ? "pi pi-sync text-bold text-green-500 px-2"
                      : "pi pi-sync text-bold text-red-500"
                  }
                />
                <span>Round Off (6)</span>
              </div>
              <div>
                {formData.edit_stop === 1 ? (
                  <span className="font-bold">
                    {Number(formData.pmstr_rnamt || 0).toFixed(2)}
                  </span>
                ) : (
                  <InputNumber
                    value={formData.pmstr_rnamt}
                    onValueChange={(e) => handleChange("pmstr_rnamt", e.value)}
                    className={`${errors.pmstr_rnamt ? "p-invalid" : ""}`}
                    inputStyle={{
                      width: "100%",
                      padding: "3px",
                      color: formData.pmstr_rnamt > 0 ? "red" : "",
                      backgroundColor:
                        formData.pmstr_rnamt > 0 ? "#f9fae9ff" : "",
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
              <span>Total (7)</span>
              <span className="font-bold text-900">
                {Number(formData.pmstr_ttamt).toFixed(2)}
              </span>
            </div>

            <div className="border-top-1 border-200 my-2"></div>

            <div className="flex justify-content-between">
              <span className="font-bold">Payable (8)</span>
              <div className="flex flex-column align-items-end">
                <span className="font-bold">{formData.pmstr_pyamt}/-</span>
                <span className="text-xs text-red-500 font-normal">
                  {payableNote}
                </span>
              </div>
            </div>

            <div className="flex justify-content-between">
              <span>Paid (9)</span>
              <span className="text-green-700 font-bold">
                {formData.pmstr_pdamt}/-
              </span>
            </div>

            <div className="flex justify-content-between">
              <span>Due (10)</span>
              <span className="text-red-700 font-bold">
                {formData.pmstr_duamt}/-
              </span>
            </div>
            {formData.edit_stop === 1 && formData.pmstr_isret === 1 && (
              <div className="flex justify-content-between">
                <span>Returned (11)</span>
                <span className="font-bold">{formData.pmstr_rtamt}/-</span>
              </div>
            )}

            {formData.edit_stop === 1 && formData.pmstr_hscnl === 1 && (
              <div className="flex justify-content-between">
                <span>Cancelled (12)</span>
                <span className="font-bold">{formData.pmstr_cnamt}/-</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Entry and List */}
      <div className="col-12 md:col-4">
      </div>
    </div>
  );
};

export default PaymentComp;
