import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import useInvoice from "@/hooks/M02/useInvoice";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import CostForm from "./CostForm";
import CostList from "./CostList";
import PaymentForm from "./PaymentForm";
import PaymentList from "./PaymentList";

const InvoicePage = () => {
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
  } = useInvoice();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "Invoice" : "Invoice Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " Invoice"
                : formData?.mrrdm_trnno || "New Invoice"
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
            <InvoiceList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <InvoiceForm
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
export default InvoicePage;
