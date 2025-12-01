import React, { useState, useRef, useEffect } from "react";
import { usePurchase } from "@/hooks/purchase/usePurchase";
import PurchaseListComponent from "./PurchaseListComponent";
import PurchaseFormComponent from "./PurchaseFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const PurchasePage = () => {
  const toast = useRef(null);
  const {
    purchaseList,
    toastBox,
    isBusy,
    currentView,
    errors,
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
    handleRefresh,
    handleSavePurchase,
    selectedPoType,
    setSelectedPoType,
    selectedFilter,
    setSelectedFilter,
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
          <PurchaseListComponent
            dataList={purchaseList}
            onEdit={handleEditPurchase}
            onDelete={handleDeletePurchase}
          />
        ) : (
          <PurchaseFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataOrder}
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
            onChange={handleChange}
            onSave={handleSavePurchase}
            paymentOptions={paymentOptions}
            formDataOrderPayments={formDataOrderPayments}
          />
        )}
      </Card>
    </>
  );
};

export default PurchasePage;
