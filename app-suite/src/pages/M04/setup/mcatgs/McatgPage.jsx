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
import useCategories from "@/hooks/M04/useCategories";
import McatgList from "./McatgList";
import McatgForm from "./McatgForm";
import ScatgList from "./ScatgList";
import ScatgForm from "./ScatgForm";

const McatgPage = () => {
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
    //sub category
    handleSubCategory,
    handleChangeSubCat,
    handleEditSubCat,
    handleDeleteSubCat,
    handleAddNewSubCat,
    handleCancelSubCat,
    handleSubmitSubCat,
  } = useCategories();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? "Categories"
                : "Sub Categories"
            }
            subtitle={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? listData.length + " Categories"
                : listDataItem.length + " Sub Categories"
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
            {pgView === "SYS_VW_LST_2" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconChevronLeft size={14} className="icon-left" />
                Category
              </Button>
            )}
            {pgView === "SYS_VW_LST_2" && (
              <Button size="sm" onClick={handleAddNewSubCat}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <McatgList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSubCategory={handleSubCategory}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <McatgForm
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

          {pgView === "SYS_VW_LST_2" && (
            <ScatgList
              listData={listDataItem}
              onEdit={handleEditSubCat}
              onDelete={handleDeleteSubCat}
            />
          )}
          {pgView === "SYS_VW_FRM_2" && (
            <ScatgForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formDataItem}
              formErrors={formErrors}
              onChange={handleChangeSubCat}
              onCancel={handleCancelSubCat}
              onSubmit={handleSubmitSubCat}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default McatgPage;
