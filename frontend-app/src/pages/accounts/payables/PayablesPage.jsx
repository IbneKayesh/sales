import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { usePayables } from "@/hooks/accounts/usePayables";
import PayablesListComp from "./PayablesListComp";
import PayablesFormComp from "./PayablesFormComp";
import SearchComp from "./SearchComp";
import PaymentDetailListComp from "./PaymentDetailListComp";

const PayablesPage = () => {
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
    //other functions
    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
    paymentDetailList,
  } = usePayables();

  const handleSearchBox = () => {
    setSearchBoxShow(true);
  };

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Payables List"
            : formData.id
              ? "Edit Payable"
              : "Add New Payable"}
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
              disabled={true}
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
        {searchBoxShow && (
          <SearchComp
            searchBoxData={searchBoxData}
            handleChangeSearchInput={handleChangeSearchInput}
            setSearchBoxShow={setSearchBoxShow}
            handleSearch={handleSearch}
            searchOptions={searchOptions}
          />
        )}
        {paymentDetailList.length > 0 && (
          <PaymentDetailListComp
            dataList={paymentDetailList}
          />
        )}

        {currentView === "list" ? (
          <PayablesListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <PayablesFormComp
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
          />
        )}
      </Card>
    </>
  );
};

export default PayablesPage;
