import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import EntryComp from "./EntryComp";
import { useItransfer } from "@/hooks/inventory/useItransfer";
import ListComp from "./ListComp";
import SearchComp from "./SearchComp";

const TransferPage = () => {
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
    formDataExpensesList,
    formDataPaymentList,
    setFormDataItemList,
    setFormDataExpensesList,
    setFormDataPaymentList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
    //cancel booking items
    cancelledRows,
    setCancelledRows,
    handleCancelBookingItems,
    setCancelledPayment
  } = useItransfer();

  const handleSearchBox = () => {
    setSearchBoxShow(!searchBoxShow);
  };
  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Transfer List"
            : formData.id
            ? "Edit Transfer"
            : "New Transfer"}
        </h3>

        <div className="flex gap-2">
          <ButtonGroup>
            <Button
              label={searchBoxShow ? "Hide" : "Search"}
              icon={searchBoxShow ? "pi pi-filter-slash" : "pi pi-search"}
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

      {searchBoxShow && (
        <SearchComp
          searchBoxData={searchBoxData}
          handleChangeSearchInput={handleChangeSearchInput}
          setSearchBoxShow={setSearchBoxShow}
          handleSearch={handleSearch}
          searchOptions={searchOptions}
        />
      )}
      {currentView === "list" ? (
        <ListComp dataList={dataList} onEdit={handleEdit} />
      ) : (
        <EntryComp
          isBusy={isBusy}
          errors={errors}
          setErrors={setErrors}
          formData={formData}
          handleChange={handleChange}
          formDataItemList={formDataItemList}
          setFormDataItemList={setFormDataItemList}
          formDataExpensesList={formDataExpensesList}
          setFormDataExpensesList={setFormDataExpensesList}
          formDataPaymentList={formDataPaymentList}
          setFormDataPaymentList={setFormDataPaymentList}
          handleSubmit={handleSave}
          
          //cancel booking items
          cancelledRows={cancelledRows}
          setCancelledRows={setCancelledRows}
          onCancelBookingItems={handleCancelBookingItems}
          setCancelledPayment={setCancelledPayment}

          //cancel
          handleCancel={handleCancel}
        />
      )}
    </Card>
  );
};

export default TransferPage;