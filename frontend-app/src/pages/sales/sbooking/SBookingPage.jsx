import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Dialog } from "primereact/dialog";
import EntryComp from "./EntryComp";
import { useSbooking } from "@/hooks/sales/useSbooking";
import ListComp from "./ListComp";
import SearchComp from "./SearchComp";
import { OverlayPanel } from "primereact/overlaypanel";

const SBookingPage = () => {
  const {
    configs,
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
  } = useSbooking();

  const handleSearchBox = () => {
    setSearchBoxShow(!searchBoxShow);
  };

  const opInfo = useRef(null);
  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          <span
            className="pi pi-info-circle mr-2 text-blue-500 cursor-pointer"
            onClick={(e) => opInfo.current.toggle(e)}
          ></span>
          {isList
            ? "Sales Booking List"
            : formData.id
              ? "Edit Sales Booking"
              : "New Sales Booking"}
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
      <OverlayPanel ref={opInfo} showCloseIcon closeOnEscape dismissable={true}>
        <div className="flex flex-column gap-3">
          <div className="flex align-items-start gap-3">
            <i className="pi pi-info-circle text-blue-500 text-2xl"></i>
            <div>
              <p className="m-0 font-bold text-lg">FN</p>
              <p className="m-0 text-gray-600">G#SB-1002</p>
            </div>
          </div>

          <div className="surface-border border-top-1 py-3">
            <p className="m-0 font-semibold mb-2">Quick</p>
            <p className="m-0 text-gray-600">
              Manage your sales bookings efficiently. Use the list view to track
              existing entries or create new ones using the form.
            </p>
          </div>

          <div className="flex justify-content-end mt-2"></div>
        </div>
      </OverlayPanel>

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
          configs={configs}
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

export default SBookingPage;
