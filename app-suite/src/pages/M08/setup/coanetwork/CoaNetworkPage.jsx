import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import useCoaNetwork from "@/hooks/M08/useCoaNetwork";
import CoaNetworkList from "./CoaNetworkList";

const CoaNetworkPage = () => {
  const {
    isBusy,
    pgView,
    listData,
    //others
    //functions
    handleEdit,
    handleDelete,
    handleSearch,
  } = useCoaNetwork();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="COA Network"
            subtitle={`${listData.length} Configurations`}
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSearch}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <CoaNetworkList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default CoaNetworkPage;
