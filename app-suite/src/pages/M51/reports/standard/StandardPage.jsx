import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import useStandard from "@/hooks/M51/useStandard";
import StandardList from "./StandardList";
import StandardForm from "./StandardForm";

const StandardPage = () => {
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
    rptList_Options,
    //functions
    handleChange,
    handleSubmit,
    //others
    formDataReport,
  } = useStandard();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Reports / Standard"
            subtitle="All Reports / Standard"
          />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <Button variant="info" size="sm" onClick={handleSubmit}>
                <IconSearch size={14} className="icon-left" />
                Search
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <StandardForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              rptList_Options={rptList_Options}
              //others
              formDataReport={formDataReport}
            />
          )}
          {pgView === "SYS_VW_LST_1" && <StandardList listData={listData} />}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default StandardPage;
