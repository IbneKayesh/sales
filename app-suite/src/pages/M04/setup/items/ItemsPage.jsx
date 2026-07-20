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
import useItems from "@/hooks/M04/useItems";
import ItemsList from "./ItemsList";
import ItemsForm from "./ItemsForm";
import PriceList from "./PriceList";
import PriceForm from "./PriceForm";

const ItemsPage = () => {
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
    //others
    units_Options,
    sgrup_Options,
    scatg_Options,
    brand_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //price
    handlePrice,
    handleChangePrice,
    handleEditPrice,
    handleDeletePrice,
    handleAddNewPrice,
    handleCancelPrice,
    handleSubmitPrice,
  } = useItems();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? "Items"
                : "Prices"
            }
            subtitle={
              ["SYS_VW_LST_1", "SYS_VW_FRM_1"].some((view) =>
                pgView.includes(view),
              )
                ? listData.length + " Items"
                : listDataItem.length + " Prices"
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
                Items
              </Button>
            )}
            {pgView === "SYS_VW_LST_2" && (
              <Button size="sm" onClick={handleAddNewPrice}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <ItemsList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrice={handlePrice}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <ItemsForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              //others
              units_Options={units_Options}
              sgrup_Options={sgrup_Options}
              scatg_Options={scatg_Options}
              brand_Options={brand_Options}
            />
          )}

          {pgView === "SYS_VW_LST_2" && (
            <PriceList
              listData={listDataItem}
              onEdit={handleEditPrice}
              onDelete={handleDeletePrice}
            />
          )}
          {pgView === "SYS_VW_FRM_2" && (
            <PriceForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formDataItem}
              formErrors={formErrors}
              onChange={handleChangePrice}
              onCancel={handleCancelPrice}
              onSubmit={handleSubmitPrice}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ItemsPage;
