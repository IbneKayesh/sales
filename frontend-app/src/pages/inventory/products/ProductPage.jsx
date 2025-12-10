import React, { useState, useRef, useEffect } from "react";
import { useProducts } from "@/hooks/inventory/useProducts";
import ProductListComponent from "./ProductListComponent";
import ProductFormComponent from "./ProductFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

const ProductsPage = () => {
  const toast = useRef(null);
  const {
    productList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataProduct,
    selectedFilter,
    filterOptions,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditProduct,
    handleDeleteProduct,
    handleRefresh,
    handleSaveProduct,
    handleFilterChange,
    handleLoadProductLedger,    
    selectedItemLedger,
  } = useProducts();

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
            ? "Products List"
            : formDataProduct.product_id
            ? "Edit Product"
            : "Add New Product"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Dropdown
              value={selectedFilter}
              options={filterOptions}
              onChange={(e) => handleFilterChange(e.value)}
              placeholder="Select Filter"
              optionLabel="label"
              optionValue="value"
              className="w-full md:w-auto"
            />
            <Button
              label="New Product"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Products List"
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
          <ProductListComponent
            dataList={productList}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onLedger={handleLoadProductLedger}
            itemLedger={selectedItemLedger}
          />
        ) : (
          <ProductFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataProduct}
            onChange={handleChange}
            onSave={handleSaveProduct}
          />
        )}
      </Card>
    </>
  );
};

export default ProductsPage;
