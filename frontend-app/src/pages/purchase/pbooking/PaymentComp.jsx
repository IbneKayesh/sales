import React, { useState, useEffect } from "react";
import { generateGuid } from "@/utils/guid";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PaymentComp = ({
  errors,
  setErrors,
  formData,
  handleChange,
  formDataPaymentList,
  setFormDataPaymentList,
}) => {
  const [payableNote, setPayableNote] = useState("");
  const [formDataPayment, setFormDataPayment] = useState({
    id: "",
    rcvpy_users: "",
    rcvpy_bsins: "",
    rcvpy_cntct: "",
    rcvpy_pymod: "Cash",
    rcvpy_trdat: new Date().toISOString().split("T")[0],
    rcvpy_refno: "",
    rcvpy_srcnm: formData.pmstr_odtyp,
    rcvpy_notes: "",
    rcvpy_pyamt: "",
  });
  useEffect(() => {
    let note = "";
    if (formData.pmstr_vatpy === "1") {
      note += " with Vat";
    }
    setPayableNote(note);
  }, [formData.pmstr_vatpy]);

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setFormDataPayment({ ...formDataPayment, [name]: value });
  };

  const handleAddPayment = () => {
    const { rcvpy_pymod, rcvpy_notes, rcvpy_pyamt } = formDataPayment;
    //set error if payment mode or payment amount is empty
    if (!rcvpy_pymod || !rcvpy_pyamt) {
      setErrors({
        rcvpy_pymod: "Payment mode is required",
        rcvpy_pyamt: "Payment amount is required",
      });
      return;
    }

    //payment amount validation
    if (formDataPayment.rcvpy_pyamt > formData.pmstr_duamt) {
      setErrors({
        rcvpy_pyamt: "The payment amount cannot exceed the due amount.",
      });
      return;
    } else {
      setErrors({
        rcvpy_pyamt: "",
      });
    }

    setFormDataPaymentList((prevList) => {
      const index = prevList.findIndex(
        (row) => row.rcvpy_pymod === rcvpy_pymod
      );

      // If found → update existing row
      if (index !== -1) {
        const updated = [...prevList];
        updated[index] = {
          ...updated[index],
          rcvpy_notes: updated[index].rcvpy_notes,
          rcvpy_pyamt: updated[index].rcvpy_pyamt + rcvpy_pyamt,
        };
        return updated;
      }

      // If not found → add new row
      return [
        ...prevList,
        {
          id: generateGuid(),
          rcvpy_users: formData.pmstr_users,
          rcvpy_bsins: formData.pmstr_bsins,
          rcvpy_cntct: formData.pmstr_cntct,
          rcvpy_pymod: rcvpy_pymod,
          rcvpy_trdat: new Date().toISOString().split("T")[0],
          rcvpy_refno: formData.pmstr_trnno,
          rcvpy_srcnm: formData.pmstr_odtyp,
          rcvpy_notes: rcvpy_notes,
          rcvpy_pyamt: rcvpy_pyamt,
        },
      ];
    });

    // Reset form
    setFormDataPayment({
      id: "",
      rcvpy_users: formData.pmstr_users,
      rcvpy_bsins: formData.pmstr_bsins,
      rcvpy_cntct: formData.pmstr_cntct,
      rcvpy_pymod: "Cash",
      rcvpy_trdat: new Date().toISOString().split("T")[0],
      rcvpy_refno: formData.pmstr_trnno,
      rcvpy_srcnm: formData.pmstr_odtyp,
      rcvpy_notes: "",
      rcvpy_pyamt: "",
    });
  };

  const handleDelete = (rowData) => {
    setFormDataPaymentList((prev) =>
      prev.filter((item) => item.id !== rowData.id)
    );
  };

  const action_BT = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };
  return (
    <div className="grid mt-2">
      <div className="col-4 col-offset-4 border-2 border-gray-200 p-2">
        <div className="flex flex-column gap-3 mb-4">
          <div className="flex justify-content-between">
            <span>Amount (1)</span>
            <span className="font-bold">{formData.pmstr_odamt}/-</span>
          </div>
          <div className="flex justify-content-between">
            Discount (2)
            <span className="font-bold">{formData.pmstr_dsamt}/-</span>
          </div>
          <div className="flex justify-content-between">
            <span 
              onClick={() => handleChange("pmstr_vatpy", formData.pmstr_vatpy === "1" ? "0" : "1")}
            >
              <input type="checkbox" checked={formData.pmstr_vatpy === "1"} readOnly />
              VAT (3)
            </span>
            <span className="font-bold">{formData.pmstr_vtamt}/-</span>
          </div>
          <div className="flex justify-content-between">
            <span>Include Cost (4)</span>
            <InputNumber
              name="pmstr_incst"
              value={formData.pmstr_incst}
              onValueChange={(e) => handleChange("pmstr_incst", e.value)}
              className={`${errors.pmstr_incst ? "p-invalid" : ""}`}
              inputStyle={{
                width: "100%",
                padding: "3px",
                color: formData.pmstr_incst > 0 ? "red" : "",
                backgroundColor: formData.pmstr_incst > 0 ? "#f9fae9ff" : "",
                textAlign: "right",
              }}
            />
            {errors.pmstr_incst && (
              <small className="text-red-500">{errors.pmstr_incst}</small>
            )}
          </div>
          <div className="flex justify-content-between">
            <span>Exclude Cost (5)</span>
            <InputNumber
              name="pmstr_excst"
              value={formData.pmstr_excst}
              onValueChange={(e) => handleChange("pmstr_excst", e.value)}
              className={`${errors.pmstr_excst ? "p-invalid" : ""}`}
              inputStyle={{
                width: "100%",
                padding: "3px",
                color: formData.pmstr_excst > 0 ? "red" : "",
                backgroundColor: formData.pmstr_excst > 0 ? "#f9fae9ff" : "",
                textAlign: "right",
              }}
            />
            {errors.pmstr_excst && (
              <small className="text-red-500">{errors.pmstr_excst}</small>
            )}
          </div>
          <div className="flex justify-content-between">
            <span>Total Amount (6) = (1-2+3+4+5)</span>
            <span className="font-bold">{formData.pmstr_ttamt}/-</span>
          </div>
          <div className="flex justify-content-between">
            <span className="text-sm text-blue-500">Payable Amount (7)</span>
            <span className="text-sm text-red-500">{payableNote}</span>
            <span className="font-bold text-blue-500">
              {formData.pmstr_pyamt}/-
            </span>
          </div>
          <div className="flex justify-content-between">
            <span>Paid Amount (8)</span>
            <span className="font-bold text-green-500">
              {formData.pmstr_pdamt}/-
            </span>
          </div>
          <div className="flex justify-content-between">
            <span>Due Amount (9)</span>
            <span className="font-bold text-red-500">
              {formData.pmstr_duamt}/-
            </span>
          </div>
          <div className="flex justify-content-between">
            <span>Returned Amount (10)</span>
            <span className="font-bold text-red-500">
              {formData.pmstr_rtamt}/-
            </span>
          </div>
          <div className="flex justify-content-between">
            <span>Cancelled Amount (11)</span>
            <span className="font-bold text-red-500">
              {formData.pmstr_cnamt}/-
            </span>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="field mb-3">
          <div className="flex flex-column gap-3 mb-4">
            <div className="flex gap-3">
              <Dropdown
                name="rcvpy_pymod"
                value={formDataPayment.rcvpy_pymod}
                options={paymentModeOptions}
                onChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.rcvpy_pymod ? "p-invalid" : ""}`}
                placeholder={`Select mode`}
                optionLabel="label"
                optionValue="value"
              />
              <InputNumber
                name="rcvpy_pyamt"
                value={formDataPayment.rcvpy_pyamt}
                onValueChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.rcvpy_pyamt ? "p-invalid" : ""}`}
                placeholder="Payment Amount"
                inputStyle={{ width: "100%" }}
                minFractionDigits={2}
                maxFractionDigits={2}
              />
            </div>
            {errors.rcvpy_pyamt && (
              <small className="text-red-500">{errors.rcvpy_pyamt}</small>
            )}
            <div className="flex gap-3">
              <InputText
                name="rcvpy_notes"
                value={formDataPayment.rcvpy_notes}
                onChange={(e) => handleChangePayment(e)}
                className={`flex-1 ${errors.rcvpy_notes ? "p-invalid" : ""}`}
                placeholder="Note"
              />
              <Button
                type="button"
                label="Add"
                icon="pi pi-plus"
                severity="info"
                size="small"
                onClick={handleAddPayment}
                disabled={formData.pmstr_duamt <= 0 || formData.edit_stop}
              />
            </div>
          </div>

          <DataTable
            value={formDataPaymentList}
            editMode="row"
            dataKey="id"
            emptyMessage="No items found."
            size="small"
          >
            <Column field="rcvpy_srcnm" header="Head" />
            <Column field="rcvpy_pymod" header="Mode" />
            <Column field="rcvpy_trdat" header="Date" />
            <Column field="rcvpy_pyamt" header="Paid" />
            <Column field="rcvpy_notes" header="Note" />
            <Column header="#" body={action_BT} style={{ width: "80px" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default PaymentComp;
