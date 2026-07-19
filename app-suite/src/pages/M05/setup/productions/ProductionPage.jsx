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
  IconEdit,
  IconDelete,
  IconCheck,
  IconSave,
  IconWarning,
  IconInfo,
} from "@/icons";
import GroupButton from "@/components/GroupButton";
import Button from "@/components/Button";
import useProduction from "@/hooks/M05/useProduction";
import ProductionList from "./ProductionList";
import ProductionForm from "./ProductionForm";

const ProductionPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
  } = useProduction();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Productions" subtitle="All Productions" />
          <PageCardActions>
            {/* <GroupButton
              options={[
                { value: "SYS_BT_SRC_1", label: "Search" },
                { value: "SYS_BT_ADD_1", label: "Add" },
                { value: "SYS_BT_CNL_1", label: "Cancel" },
                { value: "SYS_BT_SVE_1", label: "Save" },
              ]}
              value={pgView.button}
              name="role"
              onChange={(e) => handleSetView(e.target.value)}
              size="md"
            /> */}
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
              <Button size="sm" onClick={handleSubmit} variant="info">
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <ProductionList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <ProductionForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ProductionPage;
