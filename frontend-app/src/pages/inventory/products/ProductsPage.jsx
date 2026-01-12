import { useProducts } from "@/hooks/inventory/useProducts";
import ProductsListComp from "./ProductsListComp";
import ProductsFormComp from "./ProductsFormComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import BItemsComp from "./BItemsComp";

const ProductsPage = () => {
  const {
    dataList,
    isBusy,
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
    handleFetchBItem,
    // Business Items
    handleItemPriceView,
    handleFetchBusinessItems,
    businessItems
  } = useProducts();

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList ? "Unit List" : formData.id ? "Edit Unit" : "Add New Unit"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
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
              label="Price"
              icon="pi pi-credit-card"
              size="small"
              severity="secondary"
              onClick={handleItemPriceView}
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
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <ProductsListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
            onFetchBItem={handleFetchBItem}
          />
        ) : (
          <BItemsComp onFetchBusinessItems={handleFetchBusinessItems} dataList={businessItems}/>
        )}
      </Card>
    </>
  );
};

export default ProductsPage;
