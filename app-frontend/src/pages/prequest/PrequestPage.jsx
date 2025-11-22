import React, { useState, useRef, useEffect } from "react";
import { usePoMaster } from "@/hooks/prequest/usePoMaster";
import PrequestListComponent from "./PrequestListComponent";
import BookingComponent from "./BookingComponent";
import ReceiveComponent from "./ReceiveComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import OrderComponent from "./OrderComponent";
import ReturnComponent from "./ReturnComponent";

const PrequestPage = () => {
  const toast = useRef(null);
  const {
    poMasters,
    orderChildItems,
    setOrderChildItems,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPoMaster,
    selectedFilter,
    filterOptions,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPoMaster,
    handleDeletePoMaster,
    handleRefresh,
    handleFilterChange,
    handleSaveAll,
    refNoOptions,
    poTypeOptions,
    selectedPoType,
    handlePoTypeChange,
  } = usePoMaster();

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
            ? "Order List"
            : formDataPoMaster?.po_master_id
            ? `Edit ${formDataPoMaster.order_type}: ${formDataPoMaster.order_no} for ${formDataPoMaster.ref_no}`
            : `Add New ${selectedPoType}`}
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
              label={"New " + selectedPoType}
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            size="small"
            onClick={() => {
              handleCancel();
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Card header={getHeader()} className="bg-dark-200 border-round p-2">
        {currentView === "list" ? (
          <PrequestListComponent
            dataList={poMasters}
            onEdit={handleEditPoMaster}
            onDelete={handleDeletePoMaster}
          />
        ) : (
          <>
            {formDataPoMaster.order_type === "Purchase Booking" && (
              <BookingComponent
                isBusy={isBusy}
                errors={errors}
                formData={formDataPoMaster}
                onChange={handleChange}
                poTypeOptions={poTypeOptions}
                refNoOptions={refNoOptions}
                orderChildItems={orderChildItems}
                setOrderChildItems={setOrderChildItems}
                onSaveAll={handleSaveAll}
              />
            )}
            {formDataPoMaster.order_type === "Purchase Receive" && (
              <ReceiveComponent
                isBusy={isBusy}
                errors={errors}
                formData={formDataPoMaster}
                onChange={handleChange}
                poTypeOptions={poTypeOptions}
                refNoOptions={refNoOptions}
                orderChildItems={orderChildItems}
                setOrderChildItems={setOrderChildItems}
                onSaveAll={handleSaveAll}
              />
            )}
            {formDataPoMaster.order_type === "Purchase Order" && (
              <OrderComponent
                isBusy={isBusy}
                errors={errors}
                formData={formDataPoMaster}
                onChange={handleChange}
                poTypeOptions={poTypeOptions}
                refNoOptions={refNoOptions}
                orderChildItems={orderChildItems}
                setOrderChildItems={setOrderChildItems}
                onSaveAll={handleSaveAll}
              />
            )}
            {formDataPoMaster.order_type === "Purchase Return" && (
              <ReturnComponent
                isBusy={isBusy}
                errors={errors}
                formData={formDataPoMaster}
                onChange={handleChange}
                poTypeOptions={poTypeOptions}
                refNoOptions={refNoOptions}
                orderChildItems={orderChildItems}
                setOrderChildItems={setOrderChildItems}
                onSaveAll={handleSaveAll}
              />
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default PrequestPage;
