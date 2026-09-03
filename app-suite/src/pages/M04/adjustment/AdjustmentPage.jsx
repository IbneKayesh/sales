import { useState } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave, IconPrint } from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import PrintPreviewModal from "@/print/PrintPreviewModal";
import useAdjustment from "@/hooks/M04/useAdjustment";
import AdjustmentList from "./AdjustmentList";
import AdjustmentForm from "./AdjustmentForm";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import BillSummary from "./BillSummary";
import PrintPage from "./PrintPage";

const AdjustmentPage = () => {
  const [printOpen, setPrintOpen] = useState(false);
  const {
    isBusy,
    pgView,
    pageAuth,
    tcVisibleItem,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    dpart_Options,
    items_Options,
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
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useAdjustment();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "Adjustments" : "Adjustment Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " Adjustments"
                : formData?.invcm_trnno || "New Adjustment"
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
                  onClick={() => handleShowModal("ITEM")}
                >
                  <IconPlus size={14} className="icon-left" />
                  Add Item
                </Button>
              </>
            )}
            {pgView === "SYS_VW_FRM_1" && formData?.id && (
              <Button
                variant="info"
                size="sm"
                onClick={() => setPrintOpen(true)}
              >
                <IconPrint size={14} className="icon-left" />
                Print / Export
              </Button>
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
            <AdjustmentList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <AdjustmentForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              //modal
              onShowModal={handleShowModal}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataItem.length > 0 && (
            <ItemList
              cfColumns={tcVisibleItem.filter(
                (f) => f.tabcl_table === "SYS_MRR_DIRECT_ITEMS",
              )}
              readOnly={readOnly}
              listData={listDataItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}


          
          {pgView === "SYS_VW_FRM_1" && (
            <BillSummary
              formData={formData}
              readOnly={readOnly}
              onChange={handleChange}
            />
          )}
          

          {/* Print preview — one button, then choose Print or Export PDF */}
          {pgView === "SYS_VW_FRM_1" && formData?.id && (
            <PrintPreviewModal
              open={printOpen}
              onClose={() => setPrintOpen(false)}
              title={`Invoice - ${formData.invcm_trnno || formData.invcm_refno || ""}`}
              printTarget="invoice"
              posEnabled
              posChildren={
                <PrintPage
                  pos
                  formData={formData}
                  listDataItem={listDataItem}
                  dpart_Options={dpart_Options}
                />
              }
            >
              <PrintPage
                formData={formData}
                listDataItem={listDataItem}
                dpart_Options={dpart_Options}
              />
            </PrintPreviewModal>
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
export default AdjustmentPage;
