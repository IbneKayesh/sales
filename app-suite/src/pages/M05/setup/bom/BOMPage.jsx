import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import {
  IconSearch,
  IconClose,
  IconPlus,
  IconSave,
  IconChevronLeft,
} from "@/icons";
import Button from "@/components/Button";
import useBOM from "@/hooks/M05/useBOM";
import BOMList from "./BOMList";
import BOMForm from "./BOMForm";
import RawMaterialList from "./RawMaterialList";
import RawMaterialForm from "./RawMaterialForm";
import FactoryOverheadList from "./FactoryOverheadList";
import FactoryOverheadForm from "./FactoryOverheadForm";
import OutputSFGList from "./OutputSFGList";
import OutputSFGForm from "./OutputSFGForm";

const BOMPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    formErrors,
    activeTab,
    showSubForm,
    //raw materials
    listDataRM,
    formDataRM,
    formErrorsRM,
    //factory overhead
    listDataFOH,
    formDataFOH,
    formErrorsFOH,
    //output SFG
    listDataSFG,
    formDataSFG,
    formErrorsSFG,
    //other
    dpart_Options,
    units_Options,
    itemOptions,
    //BOM master
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //tab
    handleTabChange,
    //raw materials
    handleAddRM,
    handleEditRM,
    handleChangeRM,
    handleCancelRM,
    handleSubmitRM,
    handleDeleteRM,
    //factory overhead
    handleAddFOH,
    handleEditFOH,
    handleChangeFOH,
    handleCancelFOH,
    handleSubmitFOH,
    handleDeleteFOH,
    //output SFG
    handleAddSFG,
    handleEditSFG,
    handleChangeSFG,
    handleCancelSFG,
    handleSubmitSFG,
    handleDeleteSFG,
  } = useBOM();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "BOM" : "BOM Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " BOM"
                : formData?.bommf_cname || "New BOM"
            }
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSearch}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
            {pgView === "SYS_VW_LST_1" && (
              <Button size="sm" onClick={handleAddNew}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="info" size="sm" onClick={handleSubmit}>
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <BOMList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <div className="entry-screen">
              {/* BOM Master Form */}
              <BOMForm
                isBusy={isBusy}
                readOnly={readOnly}
                stopEdit={stopEdit}
                formData={formData}
                formErrors={formErrors}
                onChange={handleChange}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                dpart_Options={dpart_Options}
                units_Options={units_Options}
              />

              {/* Sub-Section Tabs */}
              <div className="sub-section-tabs">
                <div className="tabs-header">
                  <button
                    type="button"
                    className={`tab-btn${activeTab === "raw-materials" ? " tab-btn--active" : ""}`}
                    onClick={() => handleTabChange("raw-materials")}
                  >
                    Raw Materials ({listDataRM.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn${activeTab === "factory-overhead" ? " tab-btn--active" : ""}`}
                    onClick={() => handleTabChange("factory-overhead")}
                  >
                    Factory Overhead ({listDataFOH.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn${activeTab === "output-sfg" ? " tab-btn--active" : ""}`}
                    onClick={() => handleTabChange("output-sfg")}
                  >
                    Output SFG/FG ({listDataSFG.length})
                  </button>
                </div>

                <div className="tab-content">
                  {/* Raw Materials Tab */}
                  {activeTab === "raw-materials" && !showSubForm && (
                    <RawMaterialList
                      listData={listDataRM}
                      onEdit={handleEditRM}
                      onDelete={handleDeleteRM}
                      onAdd={handleAddRM}
                    />
                  )}
                  {activeTab === "raw-materials" && showSubForm && (
                    <RawMaterialForm
                      isBusy={isBusy}
                      formData={formDataRM}
                      formErrors={formErrorsRM}
                      itemOptions={itemOptions}
                      units_Options={units_Options}
                      onChange={handleChangeRM}
                      onCancel={handleCancelRM}
                      onSubmit={handleSubmitRM}
                    />
                  )}

                  {/* Factory Overhead Tab */}
                  {activeTab === "factory-overhead" && !showSubForm && (
                    <FactoryOverheadList
                      listData={listDataFOH}
                      onEdit={handleEditFOH}
                      onDelete={handleDeleteFOH}
                      onAdd={handleAddFOH}
                    />
                  )}
                  {activeTab === "factory-overhead" && showSubForm && (
                    <FactoryOverheadForm
                      isBusy={isBusy}
                      formData={formDataFOH}
                      formErrors={formErrorsFOH}
                      itemOptions={itemOptions}
                      unitsOptions={units_Options}
                      onChange={handleChangeFOH}
                      onCancel={handleCancelFOH}
                      onSubmit={handleSubmitFOH}
                    />
                  )}

                  {/* Output SFG Tab */}
                  {activeTab === "output-sfg" && !showSubForm && (
                    <OutputSFGList
                      listData={listDataSFG}
                      onEdit={handleEditSFG}
                      onDelete={handleDeleteSFG}
                      onAdd={handleAddSFG}
                    />
                  )}
                  {activeTab === "output-sfg" && showSubForm && (
                    <OutputSFGForm
                      isBusy={isBusy}
                      formData={formDataSFG}
                      formErrors={formErrorsSFG}
                      itemOptions={itemOptions}
                      unitsOptions={units_Options}
                      onChange={handleChangeSFG}
                      onCancel={handleCancelSFG}
                      onSubmit={handleSubmitSFG}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default BOMPage;
