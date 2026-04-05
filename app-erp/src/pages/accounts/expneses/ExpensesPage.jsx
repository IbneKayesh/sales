import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useExpenses } from "@/hooks/accounts/useExpenses";
import ExpensesListComp from "./ExpensesListComp";
import ExpensesFormComp from "./ExpensesFormComp";
import SearchComp from "./SearchComp";

const ExpensesPage = () => {
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
    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
  } = useExpenses();

  const handleSearchBox = () => {
    setSearchBoxShow(!searchBoxShow);
  };
  const getHeader = () => {
    const isList = currentView === "list";

    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {isList
            ? "Expenses List"
            : formData.id
              ? "Edit Expenses"
              : "New Expenses"}
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
    <>
      <Card header={getHeader()} className="border-round p-3">
        
        {searchBoxShow && (
          <SearchComp
            formData={searchBoxData}
            handleChange={handleChangeSearchInput}
            handleSearch={handleSearch}
            searchOptions={searchOptions}
          />
        )}

        {currentView === "list" ? (
          <ExpensesListComp
            dataList={dataList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ExpensesFormComp
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

export default ExpensesPage;
