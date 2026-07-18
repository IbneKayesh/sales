import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import GroupButton from "@/components/GroupButton";
import useProduction from "@/hooks/M05/useProduction";
import ProductionList from "./ProductionList";
import ProductionForm from "./ProductionForm";

const ProductionPage = () => {
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
    handleSetView,
    handleEdit,
    handleDelete,
    handleChange,
  } = useProduction();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Productions" subtitle="All Productions" />
          <PageCardActions>
            <GroupButton
              options={[
                { value: "SYS_BT_SRC_1", label: "Search" },
                { value: "SYS_BT_ADD_1", label: "Add" },
                { value: "SYS_BT_CNL_1", label: "Cancel" },
                { value: "SYS_BT_SVE_1", label: "Save" },
              ]}
              value={pgView.button}
              name="role"
              onChange={(e) => handleSetView(e.target.value)}
              size="md"
            />
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView.view === "SYS_VW_LST_1" && (
            <ProductionList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView.view === "SYS_VW_FRM_1" && (
            <ProductionForm
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ProductionPage;
