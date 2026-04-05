import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { generateGuid } from "@/utils/guid";

const ExpensesDlg = ({
  formData,
  formDataExpensesList,
  setFormDataExpensesList,
  dialogName,
}) => {
  const [errors, setErrors] = useState({});
  const [formDataExpenses, setFormDataExpenses] = useState({
    id: generateGuid(),
    expns_refno: "[Auto]",
    expns_srcnm: "[Transfer]",
    expns_inexc: 1,
    expns_notes: "",
    expns_xpamt: "",
  });

  useEffect(() => {
    if (dialogName === "Including Expenses") {
      setFormDataExpenses((prev) => ({ ...prev, expns_inexc: 1 }));
    } else {
      setFormDataExpenses((prev) => ({ ...prev, expns_inexc: 2 }));
    }
  }, [dialogName]);

  const handleAddToList = () => {
    if (
      formDataExpenses.expns_xpamt <= 0 ||
      formDataExpenses.expns_xpamt === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        expns_xpamt: "Amount must be greater than 0",
      }));
      return;
    }
    setFormDataExpensesList((prev) => [...prev, formDataExpenses]);
    setFormDataExpenses({
      id: generateGuid(),
      expns_refno: "[Auto]",
      expns_srcnm: "[Transfer]",
      expns_inexc: dialogName === "Including Expenses" ? 1 : 2,
      expns_notes: "",
      expns_xpamt: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataExpenses((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFromList = (rowData) => {
    setFormDataExpensesList((prev) =>
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

  const inexc_BT = (rowData) => {
    return rowData.expns_inexc === 1
      ? "Including"
      : rowData.expns_inexc === 2
        ? "Excluding"
        : "Unknown";
  };

  const total_including_cost = () => {
    return formDataExpensesList.filter(
      (item) => item.expns_inexc === 1,
    ).reduce(
      (total, item) => total + Number(item.expns_xpamt),
      0,
    );
  };

  const total_excluding_cost = () => {
    return formDataExpensesList.filter(
      (item) => item.expns_inexc === 2,
    ).reduce(
      (total, item) => total + Number(item.expns_xpamt),
      0,
    );
  };

  return (
    <div>
      <div className="flex flex-column gap-4">
        {!formData.edit_stop && (
          <div className="surface-card shadow-1 border-round-md border-1 border-200">
            <div className="grid p-2">
              <div className="col-12 md:col-4">
                <InputNumber
                  name="expns_xpamt"
                  value={formDataExpenses.expns_xpamt}
                  onValueChange={(e) =>
                    handleChange({
                      target: { name: "expns_xpamt", value: e.value },
                    })
                  }
                  className="w-full"
                  inputClassName="w-10rem"
                  placeholder="Expenses Amount"
                  minFractionDigits={2}
                />
              </div>
              <div className="col-12 md:col-6">
                <InputText
                  name="expns_notes"
                  value={formDataExpenses.expns_notes}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter note (optional)"
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
                />
              </div>
            </div>
            {errors.expns_xpamt && (
              <small className="text-red-500 mt-2 block ml-2">
                {errors.expns_xpamt}
              </small>
            )}
          </div>
        )}

        <div className="surface-card shadow-1 border-round-md border-1 border-200 ">
          <DataTable
            value={formDataExpensesList}
            dataKey="id"
            emptyMessage="No expenses recorded."
            size="small"
            className="shadow-1"
            rowHover
            showGridlines
            footer={
              <div className="flex justify-content-between">
                <span className="text-xl text-bold text-red-500">Including: {total_including_cost()}</span>
                <span className="text-xl text-bold text-red-500">Excluding: {total_excluding_cost()}</span>
              </div>
            }
          >
            <Column field="expns_inexc" header="Type" body={inexc_BT} />
            <Column field="expns_refno" header="Ref" />
            <Column field="expns_srcnm" header="Source" />
            <Column field="expns_notes" header="Note" />
            <Column field="expns_xpamt" header="Amount" />
            {!formData.edit_stop && (
              <Column header="#" body={action_BT} style={{ width: "3rem" }} />
            )}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ExpensesDlg;
