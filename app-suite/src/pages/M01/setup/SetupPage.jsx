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
    listTablColumns,
    //others
    showModal,
    //functions
    handleChange,
    handleOpenModal,
    handleCloseModal,
  } = useSetup();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Setup" subtitle="Configure table column visibility" />
          <PageCardActions></PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-3">
              <p>MRR (Direct)</p>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleOpenModal("SYS_MRR_DIRECT_ITEMS")}
              >
                Items Column Settings
              </Button>
            </div>
          </div>
          {showModal && (
            <TableColumns
              open={showModal}
              onClose={handleCloseModal}
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
