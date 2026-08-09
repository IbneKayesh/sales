import { useCallback, useRef, useState } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import EmptyState from "@/components/EmptyState";
import { IconActivity, IconDownload, IconPrint } from "@/icons";
import { printReport } from "@/utils/export";
import useFstatements from "@/hooks/M08/useFstatements";

// RPT_ report components (hold RPT_.jsx files only)
import RPT_FS_TB from "./RPT_FS_TB";
import RPT_FS_BS from "./RPT_FS_BS";
import RPT_FS_PNL from "./RPT_FS_PNL";
import RPT_FS_CF from "./RPT_FS_CF";
import RPT_LR_GL from "./RPT_LR_GL";
import RPT_LR_JR from "./RPT_LR_JR";
import RPT_LR_AL from "./RPT_LR_AL";
import RPT_LR_SR from "./RPT_LR_SR";
import RPT_RP_ARA from "./RPT_RP_ARA";
import RPT_RP_APA from "./RPT_RP_APA";
import RPT_RP_OST from "./RPT_RP_OST";
import RPT_BC_BR from "./RPT_BC_BR";
import RPT_BC_CB from "./RPT_BC_CB";

// Report selector options (report codes)
const reprt_Options = [
  { label: "Financial Statements > Trial Balance", value: "SYS_RPT_FS_TB" },
  { label: "Financial Statements > Balance Sheet", value: "SYS_RPT_FS_BS" },
  { label: "Financial Statements > Profit and Loss", value: "SYS_RPT_FS_PNL" },
  { label: "Financial Statements > Cash Flow", value: "SYS_RPT_FS_CF" },
  { label: "Ledger Reports > General Ledger", value: "SYS_RPT_LR_GL" },
  { label: "Ledger Reports > Journal Register", value: "SYS_RPT_LR_GR" },
  { label: "Ledger Reports > Account Ledger", value: "SYS_RPT_LR_AL" },
  { label: "Ledger Reports > Sub Ledger", value: "SYS_RPT_LR_SL" },
  { label: "Receivable & Payable > AR Aging", value: "SYS_RPT_RP_ARA" },
  { label: "Receivable & Payable > AP Aging", value: "SYS_RPT_RP_APA" },
  { label: "Receivable & Payable > Outstanding", value: "SYS_RPT_RP_OST" },
  { label: "Banking & Cash > Bank Reconciliation", value: "SYS_RPT_BC_BR" },
  { label: "Banking & Cash > Cash Book", value: "SYS_RPT_BC_CB" },
];

// Map report codes to RPT_ components
const reportComponents = {
  SYS_RPT_FS_TB: RPT_FS_TB,
  SYS_RPT_FS_BS: RPT_FS_BS,
  SYS_RPT_FS_PNL: RPT_FS_PNL,
  SYS_RPT_FS_CF: RPT_FS_CF,
  SYS_RPT_LR_GL: RPT_LR_GL,
  SYS_RPT_LR_GR: RPT_LR_JR,
  SYS_RPT_LR_AL: RPT_LR_AL,
  SYS_RPT_LR_SL: RPT_LR_SR,
  SYS_RPT_RP_ARA: RPT_RP_ARA,
  SYS_RPT_RP_APA: RPT_RP_APA,
  SYS_RPT_RP_OST: RPT_RP_OST,
  SYS_RPT_BC_BR: RPT_BC_BR,
  SYS_RPT_BC_CB: RPT_BC_CB,
};

// Report titles for the result card header
const reportTitles = {
  SYS_RPT_FS_TB: "Trial Balance",
  SYS_RPT_FS_BS: "Balance Sheet",
  SYS_RPT_FS_PNL: "Profit and Loss",
  SYS_RPT_FS_CF: "Cash Flow",
  SYS_RPT_LR_GL: "General Ledger",
  SYS_RPT_LR_GR: "Journal Register",
  SYS_RPT_LR_AL: "Account Ledger",
  SYS_RPT_LR_SL: "Sub Ledger",
  SYS_RPT_RP_ARA: "AR Aging",
  SYS_RPT_RP_APA: "AP Aging",
  SYS_RPT_RP_OST: "Outstanding",
  SYS_RPT_BC_BR: "Bank Reconciliation",
  SYS_RPT_BC_CB: "Cash Book",
};

const Fstatements = () => {
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
    dpart_Options,
    fsyar_Options,
    acprd_Options,
    //functions
    handleChange,
    handleSubmit,
  } = useFstatements();

  // Active report + its CSV export handler (registered by the RPT_ component)
  const exportRef = useRef(null);
  const [hasExport, setHasExport] = useState(false);
  const registerExport = useCallback((fn) => {
    exportRef.current = fn;
    setHasExport(!!fn);
  }, []);
  const ActiveReport = reportComponents[formData.reprt_cname];
  const reportTitle = reportTitles[formData.reprt_cname] || "Report Result";
  const hasData = listData.length > 0;

  return (
    <div className="page-wrap">
      {/* Report Generator */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Financial Statements"
            subtitle="Select parameters and generate business reports"
          />
          <PageCardActions>
            <Button onClick={() => handleSubmit()} disabled={isBusy}>
              <IconActivity size={14} className="icon-left" />
              Generate Report
            </Button>
            <Button
              onClick={() => exportRef.current && exportRef.current()}
              disabled={isBusy || !hasData || !hasExport}
            >
              <IconDownload size={14} className="icon-left" />
              Export
            </Button>
            <Button
              variant="secondary"
              onClick={() => printReport(reportTitle)}
              disabled={isBusy || !hasData}
            >
              <IconPrint size={14} className="icon-left" />
              Print
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-5">
              <Dropdown
                label="Report"
                options={reprt_Options}
                value={formData.reprt_cname}
                onChange={(e) => handleChange("reprt_cname", e.target.value)}
                error={formErrors.reprt_cname}
                required
                placeholder="Select..."
                disabled={isBusy}
              />
            </div>
            <div className="col-span-3">
              <Dropdown
                label="Department"
                options={dpart_Options}
                value={formData.jrnlm_dpart}
                onChange={(e) => handleChange("jrnlm_dpart", e.target.value)}
                error={formErrors.jrnlm_dpart}
                required
                placeholder="Select..."
                disabled={isBusy}
                optionValue="id"
                optionLabel="dpart_cname"
              />
            </div>
            <div className="col-span-2">
              <Dropdown
                label="Fiscal Year"
                options={fsyar_Options}
                value={formData.jrnlm_fsyar}
                onChange={(e) => handleChange("jrnlm_fsyar", e.target.value)}
                error={formErrors.jrnlm_fsyar}
                required
                placeholder="Select..."
                disabled={isBusy}
                optionValue="id"
                optionLabel="fsyar_cname"
              />
            </div>
            <div className="col-span-2">
              <Dropdown
                label="Period No"
                options={acprd_Options}
                value={formData.jrnlm_acprd}
                onChange={(e) => handleChange("jrnlm_acprd", e.target.value)}
                error={formErrors.jrnlm_acprd}
                required
                placeholder="Select..."
                disabled={isBusy}
                optionValue="id"
                optionLabel="acprd_cname"
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>
      {/* Results */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={reportTitle}
            subtitle="Report output based on selected parameters"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="report-print-area">
            {isBusy ? (
              <EmptyState
                variant="info"
                title="Loading..."
                message="Loading report data..."
              />
            ) : !ActiveReport ? (
              <EmptyState
                title="Select Report"
                message="Select a report and generate to view results."
              />
            ) : !hasData ? (
              <EmptyState
                title="No Data"
                message="Generate the report to fetch data."
              />
            ) : (
              <ActiveReport listData={listData} onRegisterExport={registerExport} />
            )}
          </div>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default Fstatements;
