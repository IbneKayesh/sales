import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import GroupButton from "@/components/GroupButton";
import useChartOfAccounts from "@/hooks/M05/useChartOfAccounts";
import COAList from "./COAList";

const ChartOfAccountsPage = () => {
  const { pgView, formData, dataList, handleSetView, handleEdit } =
    useChartOfAccounts();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Chart of Accounts"
            subtitle="All accounts heads"
          />
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
            <COAList dataList={dataList} onEdit={handleEdit} />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default ChartOfAccountsPage;
