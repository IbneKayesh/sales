import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { useState } from "react";
import {
  IconSearch,
  IconClose,
  IconPlus,
  IconSave,
  IconPrint,
} from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import PrintPreviewModal from "@/print/PrintPreviewModal";
import useMRR from "@/hooks/M03/useMRR";
import MrrList from "./MrrList";
import MrrForm from "./MrrForm";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import CostForm from "./CostForm";
import CostList from "./CostList";
import BillSummary from "./BillSummary";
import PaymentForm from "./PaymentForm";
import PaymentList from "./PaymentList";
import PrintPage from "./PrintPage";

const MrrPage = () => {
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
    cntct_Options,
    items_Options,
    mrrcs_Options,
    listDataCost,
    mrrpy_Options,
    listDataPayment,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //item
    itemTaxList,
    handleChangeItem,
    handleAddToListItem,
    handleEditItem,
    handleDeleteItem,
    //cost
    formDataCost,
    handleChangeCost,
    handleAddToListCost,
    handleEditCost,
    handleDeleteCost,
    //payment
    formDataPayment,
    handleChangePayment,
    handleAddToListPayment,
    handleEditPayment,
    handleDeletePayment,
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
            {pgView === "SYS_VW_FRM_1" && formData?.id && (
              <Button variant="info" size="sm" onClick={() => setPrintOpen(true)}>
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
          {pgView === "SYS_VW_FRM_1" && listDataCost.length > 0 && (
            <CostList
              readOnly={readOnly}
              listData={listDataCost}
              onEdit={handleEditCost}
              onDelete={handleDeleteCost}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataPayment.length > 0 && (
            <PaymentList
              readOnly={readOnly}
              listData={listDataPayment}
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
            />
          )}

          {/* Print preview — one button, then choose Print or Export PDF */}
          {pgView === "SYS_VW_FRM_1" && formData?.id && (
            <PrintPreviewModal
              open={printOpen}
              onClose={() => setPrintOpen(false)}
              title={`MRR - ${formData.mrrdm_trnno || formData.mrrdm_refno || ""}`}
              printTarget="mrr"
            >
              <PrintPage
                formData={formData}
                listDataItem={listDataItem}
                listDataCost={listDataCost}
                listDataPayment={listDataPayment}
                dpart_Options={dpart_Options}
                cntct_Options={cntct_Options}
              />
            </PrintPreviewModal>
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
                  itemTaxList={itemTaxList}
                />
              )}
              {showModal.modal === "COSTING" && (
                <CostForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataCost}
                  formErrors={formErrors}
                  onChange={handleChangeCost}
                  onAddToList={handleAddToListCost}
                  party_Options={mrrcs_Options}
                />
              )}
              {showModal.modal === "PAYMENT" && (
                <PaymentForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataPayment}
                  formErrors={formErrors}
                  onChange={handleChangePayment}
                  onAddToList={handleAddToListPayment}
                  party_Options={mrrpy_Options}
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
