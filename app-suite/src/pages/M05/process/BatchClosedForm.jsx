import Button from "@/components/Button";
import InputLabel from "@/components/InputLabel";
import Badge from "@/components/Badge";
import { IconPlus } from "@/icons";
import { amountInWords } from "@/utils/ntw.js";

const BatchClosedForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onBatchClosed,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-4">
          <InputLabel label="Yield" value={formData.outputSum} />
        </div>
        <div className="col-span-4">
          <InputLabel label="Batch Complete" value={formData.batchSum} />
        </div>
        <div className="col-span-4">
          <InputLabel
            label="Closing Variance"
            value={formData.variance_value}
          />
        </div>
        <div className="col-span-12">
          <InputLabel
            label="Amount in words"
            value={amountInWords(formData.variance_value)}
          />
        </div>
        <div className="col-span-3 p-3">
          <strong>Closing Status</strong>
          <Badge
            variant={formData.variance_value > 0 ? "danger" : "success"}
            className="mt-5"
          >
            {formData.variance_value > 0
              ? "Production Loss"
              : "Production Gain"}
          </Badge>
        </div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
        <div className="col-span-12 mt-5"></div>
      </div>
      <div className="form-actions">
        <Button variant="outline" onClick={onBatchClosed} disabled={isBusy}>
          <IconPlus size={16} className="icon-left" />
          Close Batch
        </Button>
      </div>
    </div>
  );
};
export default BatchClosedForm;
