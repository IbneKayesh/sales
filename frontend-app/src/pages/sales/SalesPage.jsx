import React, { useState, useRef, useEffect } from "react";
import { useSales } from "@/hooks/sales/useSales";
import SalesListComponent from "./SalesListComponent";
import SalesFormComponent from "./SalesFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const SalesPage = () => {
  const toast = useRef(null);
  const {
    salesList,
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
    handleEditSales,
    handleDeleteSales,
    handleRefresh,
    handleSaveSales,
    selectedSoType,
    setSelectedSoType,
    selectedFilter,
    setSelectedFilter,
    soTypeOptions,
    filterOptions,
    paymentOptions,
    handleSoTypeChange,
    handleFilterChange,
  } = useSales();

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
            ? `${selectedSoType} List`
            : formDataOrder?.so_master_id
            ? `Edit ${formDataOrder?.order_type}: ${formDataOrder?.order_no}`
            : `New ${selectedSoType}`}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Dropdown
              value={selectedSoType}
              options={soTypeOptions}
              onChange={(e) => handleSoTypeChange(e.value)}
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
              label="New Sales"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Sales List"
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
          <SalesListComponent
            dataList={salesList}
            onEdit={handleEditSales}
            onDelete={handleDeleteSales}
          />
        ) : (
          <SalesFormComponent
            isBusy={isBusy}
            errors={errors}
            setErrors={setErrors}
            formData={formDataOrder}
            setFormDataOrder={setFormDataOrder}
            formDataOrderItems={formDataOrderItems}
            setFormDataOrderItems={setFormDataOrderItems}
            onChange={handleChange}
            onSave={handleSaveSales}
            paymentOptions={paymentOptions}
            formDataOrderPayments={formDataOrderPayments}
            setFormDataOrderPayments={setFormDataOrderPayments}
          />
        )}
      </Card>
    </>
  );
};

export default SalesPage;
