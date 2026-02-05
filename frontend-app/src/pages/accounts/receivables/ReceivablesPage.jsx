import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useReceivables } from "@/hooks/accounts/useReceivables";
import ReceivablesListComp from "./ReceivablesListComp";
import ReceivablesFormComp from "./ReceivablesFormComp";
import SearchComp from "./SearchComp";
import PaymentDetailListComp from "./PaymentDetailListComp";

const ReceivablesPage = () => {
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
  } = useReceivables();

  const handleSearchBox = () => {
    setSearchBoxShow(true);
  };

  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Receivable List"
            : formData.id
              ? "Edit Receivable"
              : "Add New Receivable"}
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
          <ReceivablesListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ReceivablesFormComp
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

export default ReceivablesPage;
