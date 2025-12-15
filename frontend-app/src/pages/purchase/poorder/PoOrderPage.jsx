import { useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import OrderListComponent from "./OrderListComponent";
import OrderEntryComponent from "./OrderEntryComponent";
import  usePoorder  from "@/hooks/purchase/usePoorder";

const PoReturnPage = () => {
  const toast = useRef(null);
  const {
    configLine,
    toastBox,
    isBusy,
    currentView,
    errors,
    setErrors,
    dataList,
    formData,
    setFormData,
    formDataList,
    setFormDataList,
    formDataPaymentList,
    setFormDataPaymentList,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
  } = usePoorder();

  useEffect(() => {
    if (toastBox && toast.current) {
      toast.current.show({
        severity: toastBox.severity,
        summary: toastBox.summary,
        detail: toastBox.detail,
        life: 3000,
      });
    }
  }, [toastBox]);

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">Order</h3>
        {currentView === "list" ? (
          <Button
            label="New Order"
            icon="pi pi-plus"
            size="small"
            onClick={handleAddNew}
          />
        ) : (
          <Button
            label="Order List"
            icon="pi pi-arrow-left"
            size="small"
            onClick={handleCancel}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <OrderListComponent
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <OrderEntryComponent
            configLine={configLine}
            isBusy={isBusy}
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            setFormData={setFormData}
            formDataList={formDataList}
            setFormDataList={setFormDataList}
            formDataPaymentList={formDataPaymentList}
            setFormDataPaymentList={setFormDataPaymentList}
            handleChange={handleChange}
            handleSave={handleSave}
          />
        )}
      </Card>
    </>
  );
};

export default PoReturnPage;
