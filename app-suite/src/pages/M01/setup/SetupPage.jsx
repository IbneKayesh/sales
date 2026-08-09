import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import TableColumns from "@/components/common/TableColumns";
import useSetup from "@/hooks/M01/useSetup";

const SetupPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    listTablColumns,
    //functions
    handleChange,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useSetup();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Setup"
            subtitle="Configure table column visibility"
          />
          <PageCardActions></PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-3">
              <p>MRR (Direct)</p>
              <Button
                variant="info"
                size="sm"
                onClick={() =>
                  handleShowModal(
                    "SYS_MRR_DIRECT_ITEMS",
                    "SYS_MRR_DIRECT_ITEMS",
                  )
                }
              >
                Items Column Settings
              </Button>
            </div>
          </div>
          {showModal.modal === "SYS_MRR_DIRECT_ITEMS" && (
            <TableColumns
              title={modalTitle.title}
              open={showModal}
              onClose={handleHideModal}
              cfColumns={listTablColumns}
              onChange={handleChange}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};

export default SetupPage;
