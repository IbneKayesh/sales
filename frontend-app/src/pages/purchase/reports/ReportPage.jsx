import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { usePbooking } from "@/hooks/purchase/usePbooking";

const ReportPage = () => {
  const {
    dataList,
    isBusy,
    currentView,
    errors,
    setErrors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    //options
    formDataItemList,
    formDataPaymentList,
    setFormDataItemList,
    setFormDataPaymentList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
  } = usePbooking();

  const handleSearchBox = () => {
    setSearchBoxShow(true);
  };
  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Purchase Booking List"
            : formData.id
              ? "Edit Purchase Booking"
              : "New Purchase Booking"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              icon="pi pi-search"
              size="small"
              severity="secondary"
              onClick={handleSearchBox}
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
    <Card header={getHeader()} className="p-3">
      {/* {JSON.stringify(dataList)} */}

      {searchBoxShow && <></>}
      {currentView === "list" ? <></> : <></>}
    </Card>
  );
};

export default ReportPage;
