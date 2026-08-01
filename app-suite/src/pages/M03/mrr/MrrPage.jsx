import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import useMRR from "@/hooks/M03/useMRR";
import MrrList from "./MrrList";
import MrrForm from "./MrrForm";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import CostForm from "./CostForm";

const MrrPage = () => {
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
    dpart_Options,
    cntct_Options,
    items_Options,
    units_Options,
    party_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //item
    handleChangeItem,
    handleAddToListItem,
    handleEditItem,
    handleDeleteItem,
    //cost
    handleChangeCost,
    handleAddToListCost,
    handleEditCost,
    handleDeleteCost,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useMRR();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "MRR" : "MRR Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " MRR"
                : formData?.mrrdm_trnno || "New MRR"
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
            {pgView === "SYS_VW_FRM_1" && !readOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowModal("PAYMENT")}
                >
                  <IconPlus size={14} className="icon-left" />
                  Add Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowModal("COSTING")}
                >
                  <IconPlus size={14} className="icon-left" />
                  Add Costing
                </Button>
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
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button
                variant="info"
                size="sm"
                onClick={handleSubmit}
                disabled={readOnly}
              >
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <MrrList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <MrrForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              cntct_Options={cntct_Options}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataItem.length > 0 && (
            <ItemList
              readOnly={readOnly}
              listData={listDataItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}

          {/* Single Modal for Item form */}
          <Modal open={showModal.show} onClose={handleHideModal} size="xl">
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
                  stopEdit={stopEdit}
                  formData={formDataItem}
                  formErrors={formErrors}
                  onChange={handleChangeItem}
                  onAddToList={handleAddToListItem}
                  items_Options={items_Options}
                />
              )}
              {showModal.modal === "COSTING" && (
                <CostForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataItem}
                  formErrors={formErrors}
                  onChange={handleChangeCost}
                  onAddToList={handleAddToListCost}
                  party_Options={party_Options}
                />
              )}
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default MrrPage;
