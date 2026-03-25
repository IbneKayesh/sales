import { useProducts } from "@/hooks/inventory/useProducts";
import ProductsListComp from "./ProductsListComp";
import ProductsFormComp from "./ProductsFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import BItemsComp from "./BItemsComp";
import FormulaFormComp from "./FormulaFormComp";
import ConvertFormComp from "./ConvertFormComp";

const ProductsPage = () => {
  const {
    isBusy,
    dataList,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    // BItem
    formDataBItem,
    handleChangeBItem,
    handleSaveBItem,
    handleFetchBItemSelectShop,
    // Business Items
    handleItemInventoryList,
    handleFetchBusinessItems,
    BItemList,
    handleFilterDataList,
    handleFilterBusinessItems,
    //Formula
    handleFormula,
    formDataFormula,
    handleChangeFormula,
    handleSaveFormula,
    formulaList,
    handleDeleteFormula,
    //convert stock
    handleConvertStock,
  } = useProducts();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Products List"
            : formData.id
              ? "Edit Product"
              : currentView === "inventory"
                ? "Inventory"
                : "Add Product"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
              disabled={!isList}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="info"
              onClick={handleAddNew}
              disabled={!isList}
            />
            <Button
              label="Inventory"
              icon="pi pi-shop"
              size="small"
              severity="warning"
              onClick={handleItemInventoryList}
              disabled={!isList}
            />
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="help"
              onClick={handleCancel}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="border-round p-3">
        {currentView === "list" ? (
          <ProductsListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFilterDataList={handleFilterDataList}
            onFormula={handleFormula}
          />
        ) : currentView === "form" ? (
          <ProductsFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            // BItem
            formDataBItem={formDataBItem}
            onChangeBItem={handleChangeBItem}
            onSaveBItem={handleSaveBItem}
            onFetchBItemSelectShop={handleFetchBItemSelectShop}
          />
        ) : currentView === "formula" ? (
          <FormulaFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formDataFormula}
            onChange={handleChangeFormula}
            onSave={handleSaveFormula}
            dataList={formulaList}
            onDelete={handleDeleteFormula}
          />
        ) : currentView === "convert" ? (
          <ConvertFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formDataFormula}
            onChange={handleChangeFormula}
            onSave={handleSaveFormula}
            dataList={formulaList}
            onDelete={handleDeleteFormula}
          />
        ) : (
          <BItemsComp
            onFetchBusinessItems={handleFetchBusinessItems}
            dataList={BItemList}
            onFilterBusinessItems={handleFilterBusinessItems}
            onConvertStock={handleConvertStock}
          />
        )}
      </Card>
    </>
  );
};

export default ProductsPage;
