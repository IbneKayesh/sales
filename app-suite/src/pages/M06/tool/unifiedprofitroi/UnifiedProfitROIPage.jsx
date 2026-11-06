import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconClose } from "@/icons";
import Button from "@/components/Button";
import useUnifiedProfitROI from "@/hooks/M06/useUnifiedProfitROI";
import CalculatorForm from "./CalculatorForm";

const UnifiedProfitROIPage = () => {
  const roi = useUnifiedProfitROI();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Unified Profit / ROI Calculator"
            subtitle="Simulate margins, markups, costs and profitability across stages"
          />
          <PageCardActions>
            <Button variant="secondary" size="sm" onClick={roi.handleResetToBDDefault}>
              Load BD Defaults
            </Button>
            {roi.pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={roi.handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
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
