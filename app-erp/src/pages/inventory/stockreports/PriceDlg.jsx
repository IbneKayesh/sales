import { InputNumber } from "primereact/inputnumber";

const PriceDlg = ({ formData, onChange }) => {
  return (
    <div className="flex flex-column gap-4">
      {/* {JSON.stringify(formData)} */}
      <div className="surface-card shadow-1 border-round-md border-1 border-200">
        <div className="grid p-2">
          <div className="col-12 font-bold text-lg">
            for - {formData?.items_iname}
          </div>
          <div className="col-12">
            <label htmlFor="cinvc_itrat" className="font-bold mb-1">
              PP
            </label>
            <InputNumber
              name="cinvc_itrat"
              value={formData.cinvc_itrat}
              className="w-full"
              inputClassName="w-10rem"
              placeholder="Expenses Amount"
              minFractionDigits={2}
              disabled={true}
              variant="filled"
            />
          </div>
          <div className="col-12">
            <label htmlFor="cinvc_dprat" className="font-bold mb-1">
              DP
            </label>
            <InputNumber
              name="cinvc_dprat"
              value={formData.cinvc_dprat}
              onValueChange={(e) => onChange("cinvc_dprat", e.value)}
              className="w-full"
              inputClassName="w-10rem"
              placeholder="Expenses Amount"
              minFractionDigits={2}
            />
          </div>
          <div className="col-12">
            <label htmlFor="cinvc_mcmrp" className="font-bold mb-1">
              MRP
            </label>
            <InputNumber
              name="cinvc_mcmrp"
              value={formData.cinvc_mcmrp}
              onValueChange={(e) => onChange("cinvc_mcmrp", e.value)}
              className="w-full"
              inputClassName="w-10rem"
              placeholder="Expenses Amount"
              minFractionDigits={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PriceDlg;
