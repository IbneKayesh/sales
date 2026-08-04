import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import {
  IconDollar,
  IconActivity,
  IconBox,
  IconDownload,
  IconUsers,
  IconCheck,
  IconClose,
} from "@/icons";
import useFstatements from "@/hooks/M08/useFstatements";
import RPT_FS_TB from "./RPT_FS_TB";
import RPT_FS_BS from "./RPT_FS_BS";

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
    reprt_Options,
    dpart_Options,
    fsyar_Options,
    acprd_Options,
    //functions
    handleChange,
    handleSubmit,
  } = useFstatements();
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
            <Button onClick={() => handleSubmit()}>
              <IconActivity size={14} className="icon-left" />
              Generate Report
            </Button>
            <Button>
              <IconDownload size={14} className="icon-left" />
              Export
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
                optionValue="id"
                optionLabel="acprd_cname"
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>
      {/* Results Table */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={
              formData.reprt_cname === "SYS_RPT_FS_TB"
                ? "Trial Balance"
                : formData.reprt_cname === "SYS_RPT_FS_BS"
                  ? "Balance Sheet"
                  : "Report Result"
            }
            subtitle="Key metrics and performance indicators"
          />
        </PageCardHeader>
        <PageCardBody>
          {formData.reprt_cname === "SYS_RPT_FS_TB" && (
            <RPT_FS_TB listData={listData} />
          )}
          {formData.reprt_cname === "SYS_RPT_FS_BS" && (
            <RPT_FS_BS listData={listData} />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default Fstatements;
