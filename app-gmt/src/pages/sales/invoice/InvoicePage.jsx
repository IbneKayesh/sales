import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useInvoice from "@/hooks/sales/useInvoice";
import InvoiceFormComp from "./InvoiceFormComp";
import InvoiceListComp from "./InvoiceListComp";
import SearchComp from "./SearchComp";
import InvoiceViewComp from "./InvoiceViewComp";

const InvoicePage = () => {
  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    formDataSearch,
    aemp_id_Options,
    formDataList,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    handleChangeSearch,
    handleFindClick,
    handleViewInvoice,
    handleCloseViewClick,
  } = useInvoice();

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
              label={crView === "search" ? "Hide" : "Search"}
              icon={crView === "search" ? "pi pi-filter-slash" : "pi pi-search"}
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
              visible={false}
            />
            <Button
              label="Submit"
              icon="pi pi-save"
              size="small"
              severity="success"
              onClick={handleSubmitClick}
              disabled={isList}
              visible={false}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {crView === "search" && (
        <SearchComp
          formData={formDataSearch}
          onChange={handleChangeSearch}
          onSubmitClick={handleFindClick}
          aemp_id_Options={aemp_id_Options}
        />
      )}
      {(crView === "list" || crView === "view") && (
        <InvoiceListComp
          dataList={dataList}
          onView={handleViewInvoice}
          onDelete={handleDelete}
        />
      )}
      {isForm && (
        <InvoiceFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
      )}

      {crView === "view" && (
        <InvoiceViewComp
          formData={formData}
          formDataList={formDataList}
          showDialog={crView === "view"}
          onCloseClick={handleCloseViewClick}
        />
      )}
    </Card>
  );
};

export default InvoicePage;
