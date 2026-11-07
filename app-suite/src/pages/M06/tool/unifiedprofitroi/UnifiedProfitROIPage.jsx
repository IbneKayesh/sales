import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconClose } from "@/icons";
import Button from "@/components/Button";
import GroupButton from "@/components/GroupButton";
import useUnifiedProfitROI from "@/hooks/M06/useUnifiedProfitROI";
import CalculatorForm from "./CalculatorForm";
import "./UnifiedProfitROIPage.css";

const UnifiedProfitROIPage = () => {
  const roi = useUnifiedProfitROI();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title={roi.t("pageTitle")}
            subtitle={roi.t("pageSubtitle")}
          />
          <PageCardActions>
            <div className="unified-profit-roi-page__lang-selector">
              <span>{roi.t("languageLabel")}:</span>
              <GroupButton
                options={[
                  { value: "EN", label: "EN" },
                  { value: "BN", label: "BN" },
                ]}
                value={roi.lang}
                onChange={(e) => roi.setLanguage(e.target.value)}
                size="sm"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={roi.handleResetToBDDefault}>
              {roi.t("loadBDDefaults")}
            </Button>
            {roi.pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={roi.handleCancel}>
                <IconClose size={14} className="icon-left" />
                {roi.t("cancel")}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <CalculatorForm {...roi} />
        </PageCardBody>
      </PageCard>
    </div>
  );
};

export default UnifiedProfitROIPage;
