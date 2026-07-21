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
import useBOM from "@/hooks/M05/useBOM";
import BOMList from "./BOMList";
import BOMForm from "./BOMForm";
import RMPMForm from "./RMPMForm";
import RMPMList from "./RMPMList";

const BOMPage = () => {
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
    listDataSFGFG,
    formDataSFGFG,
    dpart_Options,
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
  } = useBOM();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={pgView === "SYS_VW_LST_1" ? "BOM" : "BOM Entry"}
            subtitle={
              pgView === "SYS_VW_LST_1"
                ? listData.length + " BOM"
                : formData?.bommf_cname || "New BOM"
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
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <BOMList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {pgView === "SYS_VW_FRM_1" && (
            <BOMForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              dpart_Options={dpart_Options}
              units_Options={units_Options}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
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
          {pgView === "SYS_VW_FRM_1" && listDataRMPM.length > 0 && (
            <RMPMList
              listData={listDataRMPM}
              onEdit={handleEditRMPM}
              onDelete={handleDeleteRMPM}
            />
          )}
          //do below similar as RMPM
          //FOHForm, FOHList
          //SFGForm, SFGList
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default BOMPage;
