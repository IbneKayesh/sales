import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import useReports from "@/hooks/accounts/useReports.js";
import SearchComp from "./SearchComp";
import TBComp from "./TBComp";
import BalanceSheetComp from "./BalanceSheetComp";
import CashFlowComp from "./CashFlowComp";
import PnLComp from "./PnLComp";

const ReportsPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    report_Options,
    mjrnl_dpart_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    djrnl_chtac_Options,
    djrnl_party_Options,
    //functions
    handleChange,
    handleSearchClick,
    handleQueryClick,
    //other functions
  } = useReports();

  const isList = crView === "list" && true;
  const isForm = crView === "form" && true;

  const cardTitle = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <span className="page-title-text">{crTitle}</span>
        <div className="flex gap-2">
          <ButtonGroup>
            {(crView === "SYS_FIND_1" || crView === "SYS_FORM_1") && (
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                size="small"
                severity="secondary"
              />
            )}
            {crView === "SYS_LIST_1" && (
              <Button
                label="Find"
                icon="pi pi-search"
                size="small"
                severity="info"
                onClick={handleSearchClick}
              />
            )}
            {crView === "SYS_FIND_1" && (
              <Button
                label="Search"
                icon="pi pi-search"
                size="small"
                severity="success"
                onClick={handleQueryClick}
              />
            )}
            {isList && (
              <Button
                label="Refresh"
                icon="pi pi-refresh"
                size="small"
                severity="warning"
              />
            )}
            <Button
              label="New"
              icon="pi pi-plus"
              size="small"
              severity="help"
            />
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <Card title={cardTitle} className="shadow-2 border-round p-2">
      {/* {JSON.stringify(dataList)} */}
      {crView === "SYS_FIND_1" && (
        <SearchComp
          formData={formData}
          errors={errors}
          onChange={handleChange}
          report_Options={report_Options}
          mjrnl_dpart_Options={mjrnl_dpart_Options}
          mjrnl_fsyar_Options={mjrnl_fsyar_Options}
          mjrnl_acprd_Options={mjrnl_acprd_Options}
          djrnl_chtac_Options={djrnl_chtac_Options}
          djrnl_party_Options={djrnl_party_Options}
        />
      )}
      {formData.report_type === "SYS_TB1" && (
        <TBComp pageAuth={pageAuth} dataList={dataList} />
      )}
      {formData.report_type === "SYS_PL1" && (
        <PnLComp pageAuth={pageAuth} dataList={dataList} />
      )}
      {formData.report_type === "SYS_BS1" && (
        <BalanceSheetComp pageAuth={pageAuth} dataList={dataList} />
      )}
      {formData.report_type === "SYS_CFS1" && (
        <CashFlowComp pageAuth={pageAuth} dataList={dataList} />
      )}
    </Card>
  );
};

export default ReportsPage;
