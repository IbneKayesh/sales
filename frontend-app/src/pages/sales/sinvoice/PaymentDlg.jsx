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
    rcvbl_users: "",
    rcvbl_bsins: "",
    rcvbl_cntct: "",
    rcvbl_pymod: "Cash",
    rcvbl_refid: "",
    rcvbl_refno: "[Auto]",
    rcvbl_srcnm: "Invoice",
    rcvbl_trdat: new Date().toISOString().split("T")[0],
    rcvbl_descr: "",
    rcvbl_notes: "Payment",
    rcvbl_dbamt: "",
    rcvbl_cramt: "",
  });

  const handleAddToList = () => {
    //console.log(formDataPayment);
    const { rcvbl_pymod, rcvbl_dbamt, rcvbl_descr } = formDataPayment;

    //set error if payment mode or payment amount is empty
    if (!rcvbl_pymod || !rcvbl_dbamt) {
      setErrors({
        rcvbl_pymod: "Payment mode is required",
        rcvbl_dbamt: "Payment amount is required",
      });
      return;
    }

    if (rcvbl_dbamt <= 0 || rcvbl_dbamt === "") {
      setErrors((prev) => ({
        ...prev,
        rcvbl_dbamt: "Amount must be greater than 0",
      }));
      return;
    }

    //payment amount validation
    if (formDataPayment.rcvbl_dbamt > formData.minvc_duamt) {
      setErrors({
        rcvbl_dbamt: "The payment amount cannot exceed the due amount.",
      });
      return;
    } else {
      setErrors({
        rcvbl_dbamt: "",
      });
    }

    //setFormDataPaymentList((prev) => [...prev, formDataPayment]);
    setFormDataPaymentList((prevList) => {
      const index = prevList.findIndex(
        (row) => row.rcvbl_pymod === rcvbl_pymod,
      );

      // If found → update existing row
      if (index !== -1) {
        const updated = [...prevList];
        updated[index] = {
          ...updated[index],
          rcvbl_descr: updated[index].rcvbl_descr,
          rcvbl_dbamt: Number(updated[index].rcvbl_dbamt) + Number(rcvbl_dbamt),
        };
        return updated;
      }

      // If not found → add new row
      return [
        ...prevList,
        {
          id: generateGuid(),
          rcvbl_users: formData.minvc_users,
          rcvbl_bsins: formData.minvc_bsins,
          rcvbl_cntct: formData.minvc_cntct,
          rcvbl_pymod: rcvbl_pymod,
          rcvbl_refid: formData.id,
          rcvbl_refno: "[Auto]",
          rcvbl_srcnm: "Invoice",
          rcvbl_trdat: new Date().toISOString().split("T")[0],
          rcvbl_descr: rcvbl_descr,
          rcvbl_notes: "Payment",
          rcvbl_dbamt: rcvbl_dbamt,
          rcvbl_cramt: "0.00",
        },
      ];
    });

    setFormDataPayment({
      id: generateGuid(),
      rcvbl_users: "",
      rcvbl_bsins: "",
      rcvbl_cntct: "",
      rcvbl_pymod: "Cash",
      rcvbl_refid: "",
      rcvbl_refno: "[Auto]",
      rcvbl_srcnm: "Invoice",
      rcvbl_trdat: new Date().toISOString().split("T")[0],
      rcvbl_descr: "",
      rcvbl_notes: "Payment",
      rcvbl_dbamt: "",
      rcvbl_cramt: "",
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

  const rcvbl_trdat_BT = (rowData) => {
    return formatDate(rowData.rcvbl_trdat);
  };
  const rcvbl_dbamt_BT = (rowData) => {
    return Number(rowData.rcvbl_dbamt).toFixed(2);
  };
  const rcvbl_cramt_BT = (rowData) => {
    return Number(rowData.rcvbl_cramt).toFixed(2);
  };

  const total_dbamt = () => {
    return formDataPaymentList.reduce(
      (total, item) => total + Number(item.rcvbl_dbamt),
      0,
    );
  };

  const total_cramt = () => {
    return formDataPaymentList.reduce(
      (total, item) => total + Number(item.rcvbl_cramt),
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
                  name="rcvbl_pymod"
                  value={formDataPayment.rcvbl_pymod}
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
                  name="rcvbl_dbamt"
                  value={formDataPayment.rcvbl_dbamt}
                  onValueChange={(e) =>
                    handleChange({
                      target: { name: "rcvbl_dbamt", value: e.value },
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
                  name="rcvbl_descr"
                  value={formDataPayment.rcvbl_descr}
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
                  //disabled={formData.minvc_duamt <= 0}
                />
              </div>
            </div>
            {errors.rcvbl_dbamt && (
              <small className="text-red-500 mt-2 block ml-2">
                {errors.rcvbl_dbamt}
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
            <Column field="rcvbl_pymod" header="Mode" />
            <Column field="rcvbl_refno" header="Ref" />
            <Column field="rcvbl_srcnm" header="Source" />
            <Column field="rcvbl_trdat" header="Date" body={rcvbl_trdat_BT} />
            <Column field="rcvbl_descr" header="Description" />
            <Column field="rcvbl_notes" header="Note" />
            <Column field="rcvbl_dbamt" header="Debit" body={rcvbl_dbamt_BT} footer={total_dbamt()} />
            <Column field="rcvbl_cramt" header="Credit" body={rcvbl_cramt_BT} footer={total_cramt()} />
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
