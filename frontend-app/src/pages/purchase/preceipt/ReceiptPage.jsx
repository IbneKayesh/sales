import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import EntryComp from "./EntryComp";
import { usePreceipt } from "@/hooks/purchase/usePreceipt";
import ListComp from "./ListComp";
import SearchComp from "./SearchComp";

const ReceiptPage = () => {
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
    setCancelledPayment,
    //fetch receipt items
    fetchAvailableReceiptItems,
  } = usePreceipt();

  const handleSearchBox = () => {
    setSearchBoxShow(true);
  };
  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Purchase Receipt List"
            : formData.id
            ? "Edit Purchase Receipt"
            : "New Purchase Receipt"}
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
          //fetch receipt items
          fetchAvailableReceiptItems={fetchAvailableReceiptItems}
        />
      )}
    </Card>
  );
};

export default ReceiptPage;