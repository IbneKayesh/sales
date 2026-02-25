import useOutlets from "@/hooks/crm/useOutlets";
import OutletListComp from "./OutletListComp";
import OutletViewComp from "./OutletViewComp";
import OutletFormComp from "./OutletFormComp";

const OutletsPage = () => {
  const {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    searchData,
    setSearchData,
    handleCreateNew,
    // handleBack,
  } = useOutlets();

  return (
    <div className="page-container">
      {currentView === "list" && (
        <OutletListComp
          dataList={dataList}
          isBusy={isBusy}
          searchData={searchData}
          setSearchData={setSearchData}
          onCreateNew={handleCreateNew}
        />
      )}
      {/* {currentView === "view" && (
        <OutletViewComp
          outlet={selectedOutlet}
          handleBack={handleBack}
          handleEdit={handleEdit}
        />
      )}
      {currentView === "form" && (
        <OutletFormComp
          outlet={selectedOutlet}
          handleBack={handleBack}
          handleCancel={handleCancel}
        />
      )} */}

      <button className="btn-fab">
        <span className="pi pi-plus text-lg"></span>
      </button>
    </div>
  );
};

export default OutletsPage;
