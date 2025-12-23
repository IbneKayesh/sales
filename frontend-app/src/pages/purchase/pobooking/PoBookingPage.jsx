import { useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import OrderListComponent from "./OrderListComponent";
import OrderEntryComponent from "./OrderEntryComponent";
import usePobooking from "@/hooks/purchase/usePobooking";
import SearchBoxComponent from "./SearchBoxComponent";

const PoBookingPage = () => {
  const toast = useRef(null);
  const {
    pageConfig,
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
    handleCancelBooking,
    showSearchBox,
    setShowSearchBox,
  } = usePobooking();

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
        <h3 className="m-0">Booking</h3>
        {currentView === "list" ? (
          <div className="flex align-items-center gap-2">
            <Button
              label=""
              icon="pi pi-search"
              size="small"
              onClick={() => setShowSearchBox(true)}
            />
            <Button
              label="New Booking"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Booking List"
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
      <SearchBoxComponent
        showSearchBox={showSearchBox}
        setShowSearchBox={setShowSearchBox}
      />
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <OrderListComponent
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancelBooking={handleCancelBooking}
          />
        ) : (
          <OrderEntryComponent
            pageConfig={pageConfig}
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

export default PoBookingPage;
