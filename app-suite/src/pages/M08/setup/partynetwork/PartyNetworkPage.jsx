import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import usePartyNetwork from "@/hooks/M08/usePartyNetwork";
import PartyNetworkList from "./PartyNetworkList";

const PartyNetworkPage = () => {
  const {
    isBusy,
    pgView,
    listData,
    //others
    //functions
    handleEdit,
    handleDelete,
    handleSearch,
  } = usePartyNetwork();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Party Network"
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
            <PartyNetworkList
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
export default PartyNetworkPage;
