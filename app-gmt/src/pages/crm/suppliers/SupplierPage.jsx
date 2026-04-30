import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useSupplier from "@/hooks/crm/useSupplier";
import SupplierFormComp from "./SupplierFormComp";
import SupplierListComp from "./SupplierListComp";

const SupplierPage = () => {
  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    acmpDataList,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  } = useSupplier();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              size="small"
              severity="secondary"
              onClick={handleBackClick}
              disabled={isList}
            />
            <Button
              label="Search"
              icon="pi pi-search"
              size="small"
              severity="info"
              onClick={handleSearchClick}
              disabled={isForm}
            />
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="warning"
              onClick={handleRefreshClick}
              disabled={isForm}
            />
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="help"
              onClick={handleAddNewClick}
            />
            <Button
              label="Submit"
              icon="pi pi-save"
              size="small"
              severity="success"
              onClick={handleSubmitClick}
              disabled={isList}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {isList && (
        <SupplierListComp
          dataList={dataList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isForm && (
        <SupplierFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          acmpDataList={acmpDataList}
        />
      )}
    </Card>
  );
};

export default SupplierPage;
