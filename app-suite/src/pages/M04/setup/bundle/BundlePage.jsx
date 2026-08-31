import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import Button from "@/components/Button";
import useItemBundle from "@/hooks/M04/useItemBundle";
import BundleList from "./BundleList";
import BundleForm from "./BundleForm";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";

const BrandPage = () => {
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
    //item
    items_Options,
    handleChangeItem,
    handleAddToListItem,
    handleEditItem,
    handleDeleteItem,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useItemBundle();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Bundle"
            subtitle={`${listData.length} Bundle`}
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSearch}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
            {/* {pgView === "SYS_VW_LST_1" && (
              <Button size="sm" onClick={handleAddNew}>
                <IconPlus size={14} className="icon-left" />
                Add
              </Button>
            )} */}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && !readOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowModal("ITEM")}
                >
                  <IconPlus size={14} className="icon-left" />
                  Add Item
                </Button>
              </>
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
            <BundleList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <BundleForm
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
          {pgView === "SYS_VW_FRM_1" && listDataItem.length > 0 && (
            <ItemList
              cfColumns={[]}
              readOnly={readOnly}
              listData={listDataItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}
          {/* Single Modal for Item form */}
          <Modal open={showModal.show} onClose={handleHideModal} size="xxl">
            <ModalHeader>
              <ModalTitle
                title={modalTitle.title}
                subtitle={modalTitle.subTitle}
                onClose={handleHideModal}
              />
            </ModalHeader>
            <ModalBody>
              {showModal.modal === "ITEM" && (
                <ItemForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  formData={formDataItem}
                  formErrors={formErrors}
                  onChange={handleChangeItem}
                  onAddToList={handleAddToListItem}
                  items_Options={items_Options}
                />
              )}
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default BrandPage;
