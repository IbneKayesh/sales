import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import useMRRPayments from "@/hooks/M08/useMRRPayments";
import MrrList from "./MrrList";
import MrrForm from "./MrrForm";
import PaymentForm from "./PaymentForm";
import PaymentList from "./PaymentList";

const MrrPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    formErrors,
    //others
    mrrpy_Options,
    listDataPayment,
    //functions
    handleEdit,
    handleDelete,
    handleSearch,
    handleCancel,
    handleSubmit,
    //item
    //cost
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
  } = useMRRPayments();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "MRR Due" : "MRR Payment"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " MRR"
                : formData?.mrrdm_trnno || "New MRR Payment"
            }
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSearch}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowModal("PAYMENT")}
                >
                  <IconPlus size={14} className="icon-left" />
                  Add Payment
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
                Create
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <MrrList listData={listData} onEdit={handleEdit} />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <MrrForm
              isBusy={isBusy}
              readOnly={readOnly}
              formData={formData}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              onShowModal={handleShowModal}
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
