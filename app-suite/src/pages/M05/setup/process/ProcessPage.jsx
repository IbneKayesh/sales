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
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import useProcess from "@/hooks/M05/useProcess";
import ProcessList from "./ProcessList";
import ProcessForm from "./ProcessForm";
import RMPMForm from "./RMPMForm";
import RMPMList from "./RMPMList";
import FOHForm from "./FOHForm";
import FOHList from "./FOHList";
import SFGForm from "./SFGForm";
import SFGList from "./SFGList";
import BatchForm from "./BatchForm";
import BatchList from "./BatchList";

const ProcessPage = () => {
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
    listDataRMPM,
    formDataRMPM,
    listDataFOH,
    formDataFOH,
    listDataSFGFG,
    formDataSFGFG,
    listDataBatch,
    formDataBatch,
    dpart_Options,
    bom_Options,
    units_Options,
    items_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //other
    handleChangeRMPM,
    handleAddToListRMPM,
    handleEditRMPM,
    handleDeleteRMPM,
    //foh
    handleChangeFOH,
    handleAddToListFOH,
    handleEditFOH,
    handleDeleteFOH,
    //sfg
    handleChangeSFG,
    handleAddToListSFG,
    handleEditSFG,
    handleDeleteSFG,
    //batch
    handleChangeBatch,
    handleAddToListBatch,
    handleEditBatch,
    handleDeleteBatch,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useProcess();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "Process" : "Process Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " Process"
                : formData?.promf_cname || "New Process"
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
                <Button variant="outline" size="sm" onClick={() => handleShowModal("RMPM")}>
                  <IconPlus size={14} className="icon-left" />
                  Add RM/PM
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShowModal("FOH")}>
                  <IconPlus size={14} className="icon-left" />
                  Add FOH
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShowModal("SFG")}>
                  <IconPlus size={14} className="icon-left" />
                  Add SFG/FG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShowModal("Batch")}>
                  <IconPlus size={14} className="icon-left" />
                  Add Batch
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
            <ProcessList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <ProcessForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              bom_Options={bom_Options}
              units_Options={units_Options}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataRMPM.length > 0 && (
            <RMPMList
              readOnly={readOnly}
              listData={listDataRMPM}
              onEdit={handleEditRMPM}
              onDelete={handleDeleteRMPM}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataFOH.length > 0 && (
            <FOHList
              readOnly={readOnly}
              listData={listDataFOH}
              onEdit={handleEditFOH}
              onDelete={handleDeleteFOH}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && listDataSFGFG.length > 0 && (
            <SFGList
              readOnly={readOnly}
              listData={listDataSFGFG}
              onEdit={handleEditSFG}
              onDelete={handleDeleteSFG}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && listDataBatch.length > 0 && (
            <BatchList
              readOnly={readOnly}
              listData={listDataBatch}
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
            />
          )}

          {/* Single Modal for RMPM / FOH / SFG forms */}
          <Modal open={showModal.show} onClose={handleHideModal} size="lg">
            <ModalHeader>
              <ModalTitle
                title={modalTitle.title}
                subtitle={modalTitle.subTitle}
                onClose={handleHideModal}
              />
            </ModalHeader>
            <ModalBody>
              {showModal.modal === "RMPM" && (
                <RMPMForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataRMPM}
                  formErrors={formErrors}
                  onChange={handleChangeRMPM}
                  onAddToList={handleAddToListRMPM}
                  items_Options={items_Options}
                  units_Options={units_Options}
                />
              )}
              {showModal.modal === "FOH" && (
                <FOHForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataFOH}
                  formErrors={formErrors}
                  onChange={handleChangeFOH}
                  onAddToList={handleAddToListFOH}
                  items_Options={items_Options}
                  units_Options={units_Options}
                />
              )}
              {showModal.modal === "SFG" && (
                <SFGForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataSFGFG}
                  formErrors={formErrors}
                  onChange={handleChangeSFG}
                  onAddToList={handleAddToListSFG}
                  items_Options={items_Options}
                  units_Options={units_Options}
                />
              )}
              {showModal.modal === "Batch" && (
                <BatchForm
                  isBusy={isBusy}
                  readOnly={readOnly}
                  stopEdit={stopEdit}
                  formData={formDataBatch}
                  formErrors={formErrors}
                  onChange={handleChangeBatch}
                  onAddToList={handleAddToListBatch}
                  items_Options={items_Options}
                  units_Options={units_Options}
                />
              )}
            </ModalBody>
          </Modal>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ProcessPage;
