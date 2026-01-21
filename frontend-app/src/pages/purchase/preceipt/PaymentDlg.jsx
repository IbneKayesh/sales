import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { generateGuid } from "@/utils/guid";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { formatDate } from "@/utils/datetime";

const PaymentDlg = ({
  formData,
  formDataPaymentList,
  setFormDataPaymentList,
}) => {
  const [errors, setErrors] = useState({});
  const [formDataPayment, setFormDataPayment] = useState({
    id: generateGuid(),
    paybl_users: "",
    paybl_bsins: "",
    paybl_cntct: "",
    paybl_pymod: "Cash",
    paybl_refid: "",
    paybl_refno: "[Auto]",
    paybl_srcnm: "Booking",
    paybl_trdat: new Date().toISOString().split("T")[0],
    paybl_descr: "",
    paybl_notes: "Payment",
    paybl_dbamt: formData.mbkng_pyamt,
    paybl_cramt: "",
  });

  const handleAddToList = () => {
    //console.log(formDataPayment);
    const { paybl_pymod, paybl_dbamt, paybl_descr } = formDataPayment;

    //set error if payment mode or payment amount is empty
    if (!paybl_pymod || !paybl_dbamt) {
      setErrors({
        paybl_pymod: "Payment mode is required",
        paybl_dbamt: "Payment amount is required",
      });
      return;
    }

    if (paybl_dbamt <= 0 || paybl_dbamt === "") {
      setErrors((prev) => ({
        ...prev,
        paybl_dbamt: "Amount must be greater than 0",
      }));
      return;
    }

    //payment amount validation
    // if (formDataPayment.paybl_dbamt > formData.mbkng_duamt) {
    //   setErrors({
    //     paybl_dbamt: "The payment amount cannot exceed the due amount.",
    //   });
    //   return;
    // } else {
    //   setErrors({
    //     paybl_dbamt: "",
    //   });
    // }

    //setFormDataPaymentList((prev) => [...prev, formDataPayment]);
    setFormDataPaymentList((prevList) => {
      const index = prevList.findIndex(
        (row) => row.paybl_pymod === paybl_pymod,
      );

      // If found → update existing row
      if (index !== -1) {
        const updated = [...prevList];
        updated[index] = {
          ...updated[index],
          paybl_descr: updated[index].paybl_descr,
          paybl_dbamt: Number(updated[index].paybl_dbamt) + Number(paybl_dbamt),
        };
        return updated;
      }

      // If not found → add new row
      return [
        ...prevList,
        {
          id: generateGuid(),
          paybl_users: formData.mbkng_users,
          paybl_bsins: formData.mbkng_bsins,
          paybl_cntct: formData.mbkng_cntct,
          paybl_pymod: paybl_pymod,
          paybl_refid: formData.id,
          paybl_refno: "[Auto]",
          paybl_srcnm: "Booking",
          paybl_trdat: new Date().toISOString().split("T")[0],
          paybl_descr: paybl_descr,
          paybl_notes: "Payment",
          paybl_dbamt: paybl_dbamt,
          paybl_cramt: "0.00",
        },
      ];
    });

    setFormDataPayment({
      id: generateGuid(),
      paybl_users: "",
      paybl_bsins: "",
      paybl_cntct: "",
      paybl_pymod: "Cash",
      paybl_refid: "",
      paybl_refno: "[Auto]",
      paybl_srcnm: "Booking",
      paybl_trdat: new Date().toISOString().split("T")[0],
      paybl_descr: "",
      paybl_notes: "Payment",
      paybl_dbamt: "",
      paybl_cramt: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFromList = (rowData) => {
    setFormDataPaymentList((prev) =>
      prev.filter((item) => item.id !== rowData.id),
    );
  };

  const action_BT = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => handleRemoveFromList(rowData)}
          className="w-2rem h-2rem p-0"
          tooltip="Remove"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const paybl_trdat_BT = (rowData) => {
    return formatDate(rowData.paybl_trdat);
  };
  const paybl_dbamt_BT = (rowData) => {
    return Number(rowData.paybl_dbamt).toFixed(2);
  };
  const paybl_cramt_BT = (rowData) => {
    return Number(rowData.paybl_cramt).toFixed(2);
  };

  const total_dbamt = () => {
    return formDataPaymentList.reduce(
      (total, item) => total + Number(item.paybl_dbamt),
      0,
    );
  };

  const total_cramt = () => {
    return formDataPaymentList.reduce(
      (total, item) => total + Number(item.paybl_cramt),
      0,
    );
  };

  const diff_amount = () => {
    return total_dbamt() - total_cramt();
  };

  return (
    <div>
      <div className="flex flex-column gap-4">
        {!formData.edit_stop && (
          <div className="surface-card shadow-1 border-round-md border-1 border-200">
            <div className="grid p-2">
              <div className="col-12 md:col-3">
                <Dropdown
                  name="paybl_pymod"
                  value={formDataPayment.paybl_pymod}
                  options={paymentModeOptions}
                  onChange={(e) => handleChange(e)}
                  className="w-full"
                  placeholder="Payment Mode"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
              <div className="col-12 md:col-3">
                <InputNumber
                  name="paybl_dbamt"
                  value={formDataPayment.paybl_dbamt}
                  onValueChange={(e) =>
                    handleChange({
                      target: { name: "paybl_dbamt", value: e.value },
                    })
                  }
                  className="w-full"
                  inputClassName="w-10rem"
                  placeholder="Debit Amount"
                  minFractionDigits={2}
                />
              </div>
              <div className="col-12 md:col-4">
                <InputText
                  name="paybl_descr"
                  value={formDataPayment.paybl_descr}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="col-12 md:col-2">
                <Button
                  type="button"
                  label="Add"
                  icon="pi pi-plus"
                  severity="success"
                  onClick={handleAddToList}
                  className="w-full"
                  size="small"
                  //disabled={formData.mbkng_duamt <= 0}
                />
              </div>
            </div>
            {errors.paybl_dbamt && (
              <small className="text-red-500 mt-2 block ml-2">
                {errors.paybl_dbamt}
              </small>
            )}
          </div>
        )}

        <div className="surface-card shadow-1 border-round-md border-1 border-200 ">
          <DataTable
            value={formDataPaymentList}
            dataKey="id"
            emptyMessage="No payments recorded."
            size="small"
            className="shadow-1"
            rowHover
            showGridlines
            footer={
              <div className="flex justify-content-end">
                <span className="text-xl text-bold text-red-500">Diff: {diff_amount()}</span>
              </div>
            }
          >
            <Column field="paybl_pymod" header="Mode" />
            <Column field="paybl_refno" header="Ref" />
            <Column field="paybl_srcnm" header="Source" />
            <Column field="paybl_trdat" header="Date" body={paybl_trdat_BT} />
            <Column field="paybl_descr" header="Description" />
            <Column field="paybl_notes" header="Note" />
            <Column field="paybl_dbamt" header="Debit" body={paybl_dbamt_BT} footer={total_dbamt()} />
            <Column field="paybl_cramt" header="Credit" body={paybl_cramt_BT} footer={total_cramt()} />
            {!formData.edit_stop && (
              <Column header="#" body={action_BT} style={{ width: "3rem" }} />
            )}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default PaymentDlg;
