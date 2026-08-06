import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import useContact from "@/hooks/M06/useContact";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";

const ContactPage = () => {
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
    partyData,
    dzone_Options,
    tarea_Options,
    trtry_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //address
    listDataAddress,
    formDataAddress,
    handleChangeAddress,
    handleSaveAddress,
    handleEditAddress,
    handleDeleteAddress,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useContact();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Contacts" subtitle="All Contacts" />
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShowModal("ADDRESS")}
              >
                <IconPlus size={14} className="icon-left" />
                Add Address
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
            <ContactList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <ContactForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              partyData={partyData}
              dzone_Options={dzone_Options}
              tarea_Options={tarea_Options}
              trtry_Options={trtry_Options}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataAddress.length > 0 && (
            <AddressList
              readOnly={readOnly}
              listData={listDataAddress}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
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
              {showModal.modal === "ADDRESS" && (
                <AddressForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataAddress}
                  formErrors={formErrors}
                  onChange={handleChangeAddress}
                  onSaveAddress={handleSaveAddress}
                />
              )}
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ContactPage;
