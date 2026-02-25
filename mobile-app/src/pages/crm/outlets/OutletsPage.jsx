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
    handleChange,
    handleCreateNew,
    handleBack,
    handleEdit,
    handleViewOnly,
    handleSave,
  } = useOutlets();

  return (
    <div className="page-container">
      {currentView === "list" && (
        <OutletListComp
          dataList={dataList}
          isBusy={isBusy}
          searchData={searchData}
          setSearchData={setSearchData}
          onEdit={handleEdit}
          onViewOnly={handleViewOnly}
        />
      )}
      {currentView === "viewonly" && (
        <OutletViewComp
          formData={formData}
          onBack={handleBack}
          onEdit={handleEdit}
        />
      )}
      {currentView === "form" && (
        <OutletFormComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onBack={handleBack}
          onSave={handleSave}
        />
      )}

      {/* FAB — only on list view */}
      {currentView === "list" && (
        <button
          className="btn-fab"
          onClick={handleCreateNew}
          title="Add Outlet"
        >
          <span className="pi pi-plus" style={{ fontSize: 18 }} />
        </button>
      )}
    </div>
  );
};

export default OutletsPage;
