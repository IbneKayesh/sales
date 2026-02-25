import useOutlets from "@/hooks/crm/useOutlets";
import OutletListComp from "./OutletListComp";
import OutletViewComp from "./OutletViewComp";
import OutletFormComp from "./OutletFormComp";
import TitleTopBar from "@/components/TitleTopBar";
import LiteLoader from "@/components/LiteLoader";

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
    <>
      <TitleTopBar
        viewName={currentView}
        titleName="Outlet"
        idValue={formData.id}
        funcName={handleBack}
      />
      
      <div className="page-container">
        {isBusy && <LiteLoader />}
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
    </>
  );
};

export default OutletsPage;
