import React, { useState, useRef, useEffect } from "react";
import { usePurchase } from "@/hooks/purchase/usePurchase";
import OrderListComponent from "./OrderListComponent";
import EntryFormComponent from "./EntryFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const PurchasePage = () => {
  const toast = useRef(null);
  const {
    configLine,
    purchaseList,
    toastBox,
    isBusy,
    currentView,
    errors,
    setErrors,
    formDataOrder,
    setFormDataOrder,
    formDataOrderItems,
    setFormDataOrderItems,
    formDataOrderPayments,
    setFormDataOrderPayments,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPurchase,
    handleDeletePurchase,
    handleSavePurchase,
    selectedPoType,
    selectedFilter,
    poTypeOptions,
    filterOptions,
    paymentOptions,
    handlePoTypeChange,
    handleFilterChange,
  } = usePurchase();

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
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? `${selectedPoType} List`
            : formDataOrder?.po_master_id
              ? `Edit ${formDataOrder?.order_type}: ${formDataOrder?.order_no}`
              : `New ${selectedPoType}`}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Dropdown
              value={selectedPoType}
              options={poTypeOptions}
              onChange={(e) => handlePoTypeChange(e.value)}
              placeholder="Select Filter"
              optionLabel="label"
              optionValue="value"
              className="w-full md:w-auto"
              size="small"
            />
            <Dropdown
              value={selectedFilter}
              options={filterOptions}
              onChange={(e) => handleFilterChange(e.value)}
              placeholder="Select Filter"
              optionLabel="label"
              optionValue="value"
              className="w-full md:w-auto"
              size="small"
            />
            <Button
              label="New Purchase"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Purchase List"
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
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <OrderListComponent
            dataList={purchaseList}
            onEdit={handleEditPurchase}
            onDelete={handleDeletePurchase}
          />
        ) : (
          <EntryFormComponent
            configLine={configLine}
            isBusy={isBusy}
            errors={errors}
            setErrors={setErrors}
            formData={formDataOrder}
            setFormDataOrder={setFormDataOrder}
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
            onChange={handleChange}
            onSave={handleSavePurchase}
            paymentOptions={paymentOptions}
            formDataOrderPayments={formDataOrderPayments}
            setFormDataOrderPayments={setFormDataOrderPayments}
          />
        )}
      </Card>
    </>
  );
};

export default PurchasePage;
