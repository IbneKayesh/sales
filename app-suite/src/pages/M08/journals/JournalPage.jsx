import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import useJournal from "@/hooks/M08/useJournal";
import JournalList from "./JournalList";
import JournalForm from "./JournalForm";
import ItemForm from "./ItemForm";
import ItemsList from "./ItemsList";

const JournalPage = () => {
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
    fsyar_Options,
    acprd_Options,
    //lines
    chtac_Options,
    party_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //journal lines
    handleChangeItem,
    handleAddToList,
    handleEditItem,
    handleDeleteItem,
    handleAutoJournal,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useJournal();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={
              pgView === "SYS_VW_LST_1" ? "Journal Entries" : "Journal Entry"
            }
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " Journals"
                : formData?.jrnlm_narrt || "New Journal"
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
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="info" size="sm" onClick={handleAutoJournal}>
                <IconSearch size={14} className="icon-left" />
                Auto Journal
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <JournalList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <JournalForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              fsyar_Options={fsyar_Options}
              acprd_Options={acprd_Options}
              onShowAddToList={handleShowModal}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <ItemsList
              readOnly={readOnly}
              listData={listDataItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}

          {/* Single Modal for Journal Line forms */}
          <Modal open={showModal.show} onClose={handleHideModal} size="xl">
            <ModalHeader>
              <ModalTitle
                title={modalTitle.title}
                subtitle={modalTitle.subTitle}
                onClose={handleHideModal}
              />
            </ModalHeader>
            <ModalBody>
              <ItemForm
                isBusy={isBusy}
                readOnly={readOnly}
                stopEdit={stopEdit}
                formData={formDataItem}
                formErrors={formErrors}
                onChange={handleChangeItem}
                onAddToList={handleAddToList}
                chtac_Options={chtac_Options}
                party_Options={party_Options}
              />
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default JournalPage;
