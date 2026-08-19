import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import useTax from "@/hooks/M04/useTax";
import TaxList from "./TaxList";
import TaxForm from "./TaxForm";

const TaxPage = () => {
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
  } = useTax();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="TAX"
            subtitle={`${listData.length} TAX`}
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
            <TaxList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <TaxForm
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
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default TaxPage;
